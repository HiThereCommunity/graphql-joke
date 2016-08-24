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

import Postgres from "./../../connector";

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

    static async gen(id: number, db: PostgresConnector): Promise<?TodoItem> {

        let todoItem = await db.getTodoItem().findById(id);

        return todoItem ? new TodoItem(todoItem.dataValues) : null;
    }

    static async write(title: string, db: PostgresConnector): Promise<?TodoItem> {

        let todoItem = await db.query("INSERT INTO todo_item(title, is_done) values ($1, $2) RETURNING *;", [title, false]);

        return todoItem.rowCount ===1 ? new TodoItem(todoItem.rows[0]) : null;
    }

    static async updateItem(id: number, completed: boolean, db: PostgresConnector): Promise<?TodoItem> {

        let todoItem = await db.query("UPDATE todo_item SET is_done=$1 WHERE id=$2 RETURNING *;", [completed, id]);

        return todoItem.rowCount ===1 ? new TodoItem(todoItem.rows[0]) : null;
    }
}