// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */

import type {TodoItemStructure} from "./../connectors";
import type {RootValue, Viewer} from "./../types";

//This class acts as the middle layer between the connector and the graphql schema.
//In addition, it also performs things such as authorization checking.
//TODO: Check that the person has authorization to view the object.
export default class TodoItem {

    _id: string;
    _title: string;
    _isDone: boolean;

    constructor(data: TodoItemStructure){
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

        let todoItem: ?TodoItemStructure = root.db.todo.getTodo(id);
        if (todoItem === null) return null;

        const isOwner = checkOwner(todoItem, root.viewer);
        return isOwner  ? new TodoItem(todoItem) : null;
    }

    static write(title: string, root: RootValue): TodoItem {

        let newTodoItem: TodoItemStructure = root.db.todo.writeTodo(title, root.viewer.id);
        return newTodoItem ? new TodoItem(newTodoItem) : null;
    }

    static update(id: number, completed: boolean, root: RootValue): Promise<?TodoItem> {
        let updatedTodoItem: ?TodoItemStructure = root.db.todo.updateTodo(id, completed);
        return updatedTodoItem ? new TodoItem(updatedTodoItem) : null;
    }

    static delete(id: number, root: RootValue): ?TodoItem {
        let deletedTodo: ?TodoItemStructure = root.db.todo.deleteTodo(id);
        return new TodoItem(deletedTodo);
    }
}

function checkOwner(todoItem: TodoItemStructure, viewer: Viewer): boolean{
    return todoItem.creatorId === viewer.id;
}