/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const),

  /*
  |----------------------------------------------------------
  | Variables for server port/host
  |----------------------------------------------------------
  */
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  PUBLIC_URL: Env.schema.string({ format: 'url', tld: false }),

  /*
  |----------------------------------------------------------
  | Variables for encryption and hashing
  |----------------------------------------------------------
  */
  APP_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DATABASE_URL: Env.schema.string(),
  DATABASE_POOL_MAX: Env.schema.number.optional(),
  // DATABASE_AUTOMIGRATE: Env.schema.boolean.optional(),
})
