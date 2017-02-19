// @flow

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
import config from '../config';
var db: Object        = {};

const configDB = config.db;

const options = {
  host: configDB.host,
  dialect: "postgres",
  port: configDB.port,
  //prevent sequelize from logging all the queries to the console.
  //logging: true
};

//Create a connection with sequelize
const sequelize = new Sequelize(
  configDB.database,
  configDB.user,
  configDB.password,
  options
);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
