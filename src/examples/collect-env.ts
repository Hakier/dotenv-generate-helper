import { DotEnvHelper } from '..';

// tslint:disable:no-console
DotEnvHelper.prepare();

import './config';

console.info('Collected env:', JSON.stringify(DotEnvHelper.accessedEnvMap, null, 2));
