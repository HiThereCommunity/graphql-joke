// @flow

const env = process.env
const environment = env.NODE_ENV

export type configType = {
  db: {
      host: string,
      user: string,
      password: string,
      database: string,
      port: number
  },
  port: number,
  environment: "production" | "development" | "test"

}
var config: configType

// Load the database config depending on the environment.
switch (environment) {
  case 'production':

    if (!env.DB_HOST) {
      throw new Error('You must set the database host using the environment variable DB_HOST')
    }
    if (!env.DB_USER) {
      throw new Error('You must set the database user using the environment variable DB_USER')
    }
    if (!env.DB_PASSWORD) {
      throw new Error('You must set the database password using the environment variable DB_PASSWORD')
    }
    if (!env.DB_DATABASE) {
      throw new Error('You must set the database database name using the environment variable DB_DATABASE')
    }

    const db = {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      port: 5432
    }

    config = {
      db,
      port: 80,
      environment
    }
    break
  case 'development':

    if (!env.DB_PASSWORD) {
      throw new Error('You must set the database password using the environment variable DB_PASSWORD')
    }
    if (!env.DB_DATABASE) {
      throw new Error('You must set the database database name using the environment variable DB_DATABASE')
    }

    config = {
      db: {
        host: "127.0.0.1",
        user: "postgres",
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        port: 5432
      },
      port: 3000,
      environment
    }
    break
  case 'test':

    if (!env.DB_PASSWORD) {
      throw new Error('You must set the database password using the environment variable DB_PASSWORD')
    }

    config = {
      db: {
        host: '127.0.0.1',
        database: 'test',
        user: "postgres",
        password: env.DB_PASSWORD,
        port: 5432
      },
      port: 3000,
      environment
    }
    break
  default:
    throw new Error(`Unrecognized environment ${String(environment)}`)
}

export default config
