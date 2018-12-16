import * as Chance from 'chance';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { times } from 'lodash';
import { types } from 'util';

import { DotEnvHelper } from './dot-env-helper';

jest.mock('dotenv');
jest.mock('fs');

const config = dotenv.config;

describe('generateDotEnvFile', () => {
  interface IStringMap {
    [key: string]: string;
  }

  const chance = new Chance();

  describe('prepare', () => {
    let envName: string;
    let envValue: string;
    let accessedKeysAndValues: IStringMap;

    beforeAll(() => {
      envName = chance.word();
      envValue = chance.word();
      process.env[envName] = envValue;
      process.env[chance.word()] = chance.word();
      accessedKeysAndValues = {};
      times(chance.d12(), (): void => {
        const key = chance.word();

        process.env[key] = accessedKeysAndValues[key] = chance.word();
      });

      DotEnvHelper.prepare();

      Object.keys(accessedKeysAndValues).forEach((key: string) => process.env[key]);
      process.env.hasOwnProperty(chance.word());
    });

    it('should use dotenv to load env variables out of .env file', () => {
      expect(config).toHaveBeenCalledTimes(1);
      expect(config).toHaveBeenCalledWith({ debug: false });
    });
    it('should replace config of dotenv with empty function to prevent cluttering env variables', () => {
      expect(config).toHaveBeenCalledTimes(1);
      dotenv.config();
      dotenv.config();
      expect(config).toHaveBeenCalledTimes(1);
      expect(dotenv.config).not.toBe(config);
    });
    it('should replace process.env with Proxy to collect accessed property names', () => {
      expect(types.isProxy(process.env)).toBeTruthy();
    });
    it('should collect keys and values of accessed env variables and NOT functions', () => {
      expect(DotEnvHelper.accessedEnvMap).toEqual(accessedKeysAndValues);
    });
  });
  describe('convertMapToString', () => {
    beforeAll(() => {
      DotEnvHelper.accessedEnvMap = {
        key1: 'value1',
        key2: undefined,
        key3: 'value3',
      };
    });

    it('should convert to .env file format', () => {
      expect(DotEnvHelper.convertMapToString()).toEqual('key1=value1\nkey2=\nkey3=value3');
    });
  });
  describe('save', () => {
    describe('when NOT given path', () => {
      describe('and writeFile resolves', () => {
        beforeAll(async () => {
          DotEnvHelper.convertMapToString = jest.fn(() => 'result of convertMapToString');
          (fs as any).promises = { writeFile: jest.fn() };

          await DotEnvHelper.save();
        });

        it('should write result to .env file', () => {
          expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
          expect(fs.promises.writeFile).toHaveBeenCalledWith('.env', 'result of convertMapToString', 'utf8');
        });
      });
      describe('and writeFile rejects', () => {
        let rejectedValue: string;

        beforeAll(async () => {
          DotEnvHelper.convertMapToString = jest.fn(() => 'result of convertMapToString');
          (fs as any).promises = { writeFile: jest.fn().mockRejectedValue('writeFile rejected') };

          try {
            await DotEnvHelper.save();
          } catch (err) {
            rejectedValue = err;
          }
        });

        it('should be able to catch error outside', () => {
          expect(rejectedValue).toBe('writeFile rejected');
        });
      });
    });
    describe('when given path', () => {
      describe('and writeFile resolves', () => {
        let path: string;

        beforeAll(async () => {
          path = chance.word();
          DotEnvHelper.convertMapToString = jest.fn(() => 'result of convertMapToString');
          (fs as any).promises = { writeFile: jest.fn() };

          await DotEnvHelper.save(path);
        });

        it('should write result to given path', () => {
          expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
          expect(fs.promises.writeFile).toHaveBeenCalledWith(path, 'result of convertMapToString', 'utf8');
        });
      });
      describe('and writeFile rejects', () => {
        let path: string;
        let rejectedValue: string;

        beforeAll(async () => {
          path = chance.word();
          DotEnvHelper.convertMapToString = jest.fn(() => 'result of convertMapToString');
          (fs as any).promises = { writeFile: jest.fn().mockRejectedValue('writeFile rejected') };

          try {
            await DotEnvHelper.save(path);
          } catch (err) {
            rejectedValue = err;
          }
        });

        it('should be able to catch error outside', () => {
          expect(rejectedValue).toBe('writeFile rejected');
        });
      });
    });
  });
  describe('collectEnvUsedInFile', () => {
    const file: string = '../examples/config';
    let require: jest.Mock;

    beforeAll(async () => {
      DotEnvHelper.prepare = jest.fn();
      DotEnvHelper.save = jest.fn();
      require = jest.fn();

      jest.doMock(file, () => require(file));

      await DotEnvHelper.collectEnvUsedInFile(file);
    });

    it('should call prepare', () => {
      expect(DotEnvHelper.prepare).toHaveBeenCalledTimes(1);
      expect(DotEnvHelper.prepare).toHaveBeenCalledWith();
    });
    it('should require given file', () => {
      expect(require).toHaveBeenCalledTimes(1);
      expect(require).toHaveBeenCalledWith(file);
    });
    it('should save to file', () => {
      expect(DotEnvHelper.save).toHaveBeenCalledTimes(1);
      expect(DotEnvHelper.save).toHaveBeenCalledWith();
    });
  });
});
