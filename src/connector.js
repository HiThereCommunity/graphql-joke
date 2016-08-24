/**
 * Created by Dirk-Jan Rutten on 14/08/16.
 */

import Sequelize from "sequelize";


type configType = {
    "host": string,
    "user": string,
    "password": string,
    "database": string
}

export default class PostgresConnector {

    _sequelize: Sequelize;

    _user;

    _todoItem;

    constructor(config: configType){

        let options = {
            host: config.host,
            dialect: "postgres",
            define: {
                timestamps: false
            },
            logging: false
        };

        let sequelize = new Sequelize(config.database, config.user, config.password, options);
        this._sequelize = sequelize;

        let user = sequelize.define('user', {
            firstName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });

        let todoItem = sequelize.define("todo_item", {
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            is_done: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });

        this._user = user;
        this._todoItem = todoItem;

        this._sequelize.sync({
            force:false
        });
    }

    //async synchronizeDB(): Promise {
    //    return this._sequelize.sync({
    //        force:false
    //    })
    //}

    getTodoItem() {
        return this._todoItem;
    }

    getUser() {
        return this._user;
    }

}




