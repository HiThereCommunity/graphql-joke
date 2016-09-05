// @flow
/**
 * Created by dirk-janrutten on 13/08/16.
 */


import TodoItem from "./TodoItem";
import {RootValue, Viewer} from "./../types";
import type {TodoItemStructure} from "./../connectors";

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

    static async gen(root: RootValue): Promise<TodoList>{

        let viewer: Viewer = root.viewer;

        let todoList: Array<TodoItemStructure> = root.db.todo.getAllTodo(viewer.id);

        let list: Array<TodoItem> = [];

        for (var i=0; i<todoList.length; i++){
            if (!checkOwner(todoList[i], viewer)) list.push(new TodoItem(todoList[i]));
        }

        return new TodoList(list);
    }
}

function checkOwner(todoItem: TodoItemStructure, viewer: Viewer): boolean {
    return todoItem.creatorId === viewer.id;
}