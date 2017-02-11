// @flow
import Sequelize from 'sequelize';

type configType = {
  "host": string,
  //this the url e.g. localhost...
  "user": string,
  "password": string,
  "database": string,
  "port": number
};

/**
 * Instantiates a sequelize instance from a config.
 */
export default (config: configType) => {
  const options = {
    host: config.host,
    dialect: "postgres",
    port: config.port,
    //prevent sequelize from logging all the queries to the console.
    logging: false
  };

  //Create a connection with sequelize
  const sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    options
  );

  sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  const todoItem = sequelize.define('todo_item', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  todoItem.belongsTo(sequelize.models.user, {
    foreignKey: {
      name: "user_account",
      allowNull: false,
      targetKey: "id"
    }
  });

  return sequelize;
}
