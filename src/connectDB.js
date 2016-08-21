/**
 * Created by dirk-janrutten on 13/08/16.
 */
var Pool = require('pg').Pool;

const environment = process.env.NODE_ENV;

type configType = {
    "host": string,
    "user": string,
    "password": string,
    "database": string
}

var config: configType;

//Load the database config depending on the environment.

switch(environment){
    case "production":
        throw new Error("Production DB has not been defined yet");
        break;
    case "development":
        config = require("./../dbConfig.json");
        break;
    default:
        throw new Error(`Unrecognized environment ${environment}`);
}

const pool = new Pool(config);

export default pool;