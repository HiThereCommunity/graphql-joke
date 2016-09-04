// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */
import PostgresConnector from "./../../connector";

type databaseItem = {
    id: string,
    title: string,
    is_done: boolean
}

var uuid = require('node-uuid');

import type RootValue from "./../types";

export default class TodoItem {

    _id: string;
    _title: string;
    _isDone: boolean;

    constructor(data: databaseItem){
        this._id = data.id;
        this._title = data.title;
        this._isDone = data.is_done;
    }

    getId(): string {
        return this._id;
    }
    getTitle(): string {
        return this._title;
    }
    getIsDone(): boolean {
        return this._isDone;
    }

    static initializeFromData(id: number, title: string, isDone: boolean): TodoItem{

        return new TodoItem({
            id: id,
            title: title,
            is_done: isDone
        });
    }

    static gen(id: string, root: RootValue): ?TodoItem {

        let todoItem = root.local.getTodoItems().filter(item =>  item.id === id);

        return todoItem.length>0 ? new TodoItem(todoItem[0]) : null;
    }

    static write(title: string, root: RootValue): TodoItem {


        let todoItem = {
            id: uuid.v4(),
            title: title,
            is_done: false
        };

        root.local.getTodoItems().push(todoItem);

        return new TodoItem(todoItem);
    }

    static async updateItem(id: number, completed: boolean, root: RootValue): Promise<?TodoItem> {

        let todoItem = await db.getTodoItem().findById(id);

        if (!todoItem) return null;

        await todoItem.update({is_done: completed});

        return new TodoItem(todoItem.dataValues);
    }

    static async delete(id: number, root: RootValue): Promise<number> {

        let todoItem = await db.getTodoItem().destroy({where: {id: id}});

        return todoItem;
    }
}