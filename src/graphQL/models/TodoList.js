// @flow
/**
 * Created by dirk-janrutten on 13/08/16.
 */


import TodoItem from "./TodoItem";
var Pool = require('pg').Pool;

export default class TodoList {

    _todoList: Array<TodoItem>;

    constructor(todoList: Array<TodoItem>){

        this._todoList = todoList;
    }

    getAll(): Array<TodoItem>{
        return this._todoList;
    }

    getActive(): Array<TodoItem> {
        return this._todoList.filter(t => !t.getIsDone());
    }

    getCompleted(): Array<TodoItem>{
        return this._todoList.filter(t => t.getIsDone());
    }

    static async gen(db: Pool): Promise<TodoList>{

        let todoList = await db.query("SELECT * FROM todo_item;");

        let list: Array<TodoItem> = [];

        for (var i=0; i<todoList.rowCount; i++){
            list.push(new TodoItem(todoList.rows[i]));
        }

        return new TodoList(list);

    }

}