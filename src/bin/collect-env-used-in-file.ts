#!/usr/bin/env node

import { DotEnvHelper } from '..';

if (require.main !== module) {
  throw new Error('Executable-only module should not be required');
}

// tslint:disable:no-console
function exitWithErrorMessage(msg: string): void {
  console.log(msg);
  console.log();
  process.exit(1);
}

if (process.argv.length < 3) {
  exitWithErrorMessage('DotEnvHelper: missing argument (file name)');
}

const [, , file] = process.argv;

DotEnvHelper.collectEnvUsedInFile(`${process.cwd()}/${file}`)
  .then(() => console.log('.env file generated'))
  .catch(exitWithErrorMessage);
