import ProcessEnv = NodeJS.ProcessEnv;
import * as dotEnv from 'dotenv';
import { promises } from 'fs';

const loadEnvVariablesFromFile = () => dotEnv.config({ debug: false });
const preventClutteringEnvVariables = () => (dotEnv as any).config = (): null => null;
const observeEnv = () => {
  const accessedEnvMap: ProcessEnv = {};
  const handler = {
    get: (obj: ProcessEnv, key: string): string | undefined => {
      return typeof obj[key] === 'function' ? obj[key] : (accessedEnvMap[key] = obj[key]);
    },
  };

  process.env = new Proxy(process.env, handler) as any;

  return accessedEnvMap;
};

export class DotEnvHelper {
  public static accessedEnvMap: ProcessEnv;

  public static prepare(): void {
    loadEnvVariablesFromFile();
    preventClutteringEnvVariables();

    DotEnvHelper.accessedEnvMap = observeEnv();
  }

  public static convertMapToString(): string {
    return Object.entries(DotEnvHelper.accessedEnvMap).map(([key, value]) => `${key}=${value || ''}`).join('\n');
  }

  public static async save(path: string = '.env'): Promise<void> {
    return await promises.writeFile(path, DotEnvHelper.convertMapToString(), 'utf8');
  }

  public static async collectEnvUsedInFile(file: string): Promise<void> {
    DotEnvHelper.prepare();
    require(file);

    return await DotEnvHelper.save();
  }
}
