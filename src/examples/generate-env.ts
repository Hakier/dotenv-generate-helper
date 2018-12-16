import { DotEnvHelper } from '..';

// tslint:disable:no-console
DotEnvHelper.collectEnvUsedInFile('./config')
  .then(() => console.info('.env file generated'))
  .catch(console.error);

/*
// Or You can do it like this:
DotEnvHelper.prepare();

require('./file1');
require('./file2');
require('./file3');

DotEnvHelper.save()
  .then(() => console.info('.env file generated'))
  .catch(console.error);
*/
