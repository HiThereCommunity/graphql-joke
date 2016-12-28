// @flow
/**
 * Created by Dirk-Jan Rutten on 29/09/16.
 */

import Sequelize from 'sequelize'

type configType = {
    "host": string,  // this the url e.g. localhost...
    "user": string,
    "password": string,
    "database": string,
    "port": number
}

/**
 * A class that provides a connection to a sequelize connection with a postgres database.
 *
 * This class does the following:
 *
 * - Create a connection with the postgres database
 * - Create the sequelize models
 * - Sync the models with the database
 * - Expose getter for retrieving the sequelize models
 *
 */
export default class PostgresConnector {

  _todoItemEntity: Object;
  _sequelize: Object;

    /**
     * Create a connection with a postgres database and instantiate the connector
     * @param config the configuration file containing the connection data
     * @param testSetup boolean determining whether we are running in a test mode or not. Defaults to false.
     */
  constructor (config: configType, testSetup?: boolean = false) {
        // Set the options for sequelize
    let options = {
      host: config.host,
      dialect: 'postgres',
      port: config.port,
            // prevent sequelize from logging all the queries to the console.
      logging: false
    }

        // Create a connection with sequelize
    let sequelize = new Sequelize(config.database, config.user, config.password, options)

    let todoItem = sequelize.define('todo_item', {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })

    this._todoItemEntity = todoItem
    this._sequelize = sequelize

        // In a test setup we want manually reset the database on every test.
    if (testSetup === false) {
      sequelize.sync({
        force: false
      })
    }
  }

  getSequelize () {
    return this._sequelize
  }

  getTodoItemEntity () {
    return this._todoItemEntity
  }
}
