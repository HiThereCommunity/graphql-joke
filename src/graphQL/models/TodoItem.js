// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */
var Pool = require('pg').Pool;

type databaseItem = {
    id: string,
    title: string,
    is_done: boolean
}

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

    static initializeFromData(id: string, title: string, isDone: boolean): TodoItem{

        return new TodoItem({
            id: id,
            title: title,
            is_done: isDone
        });
    }

    static async gen(id: string, db: Pool): Promise<?TodoItem> {

        let todoItem = await db.query("SELECT * FROM todo_item WHERE id=$1 LIMIT 1;", [id]);

        return todoItem.rowCount ===1 ? new TodoItem(todoItem.rows[0]) : null;
    }

    static async write(title: string, db: Pool): Promise<?TodoItem> {

        let todoItem = await db.query("INSERT INTO todo_item(title, is_done) values ($1, $2) RETURNING *;", [title, false]);

        return todoItem.rowCount ===1 ? new TodoItem(todoItem.rows[0]) : null;
    }

    static async updateItem(id: string, completed: boolean, db: Pool): Promise<?TodoItem> {

        let todoItem = await db.query("UPDATE todo_item SET is_done=$1 WHERE id=$2 RETURNING *;", [completed, id]);

        return todoItem.rowCount ===1 ? new TodoItem(todoItem.rows[0]) : null;
    }
}