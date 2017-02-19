// @flow

/**
 * Contains some utilties used for test files.
 */

const env = process.env

if (!env.TEST_DB_USER) {
  throw new Error('You must set the test database user using the environment variable TEST_DB_USER')
}

/**
 * Retrieve the test database connection
 */
export const testDBConnection = {
  host: '127.0.0.1',
  database: 'test',
  user: env.TEST_DB_USER,
  password: env.TEST_DB_PASSWORD,
  port: env.TEST_DB_PORT ? env.TEST_DB_PORT : 5432
}
