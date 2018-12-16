# dotenv-generate-helper

A helper created to generate .env file of accessed ENV variables with its values. It assumes that You have [dotenv](https://github.com/motdotla/dotenv) installed to be able to load ENV variables from .env file.

## Installation

Via npm:

```bash
$ npm install [-g] dotenv-generate-helper
```

## Command line use

```
$ collect-env-used-in-file path-to-config-that-uses-env-vars
```

For example
```
$ collect-env-used-in-file ./config.js
```

## Import helper

`import { DotEnvHelper } from 'dotenv-generate-helper';`

## Usage

### Collect env

```typescript
import { DotEnvHelper } from 'dotenv-generate-helper';

// tslint:disable:no-console
DotEnvHelper.prepare();

import './config';

console.info('Collected env:', JSON.stringify(DotEnvHelper.accessedEnvMap, null, 2));
```

### Generate env
```typescript
import { DotEnvHelper } from 'dotenv-generate-helper';

// tslint:disable:no-console
DotEnvHelper.collectEnvUsedInFile('./config')
  .then(() => console.info('.env file generated'))
  .catch(console.error);
```

Or You can do it like this:
```typescript
import { DotEnvHelper } from 'dotenv-generate-helper';

DotEnvHelper.prepare();

require('./file1');
require('./file2');
require('./file3');

// tslint:disable:no-console
DotEnvHelper.save()
  .then(() => console.info('.env file generated'))
  .catch(console.error);
```
