/**
 * Created by dirk-janrutten on 04/09/16.
 */


export type TodoItemStructure = {
    id: string,
    title: string,
    is_done: boolean,
    creatorId: string //reference to the id of the user
}
var uuid = require('node-uuid');

//This is the place where batching takes place related to the database etc.
//In addition, this class can be configured to create logs of errors in the database and crete graphQL friendly error messages.
export class TodoItemDB {

    todoItems: Array<TodoItemStructure>;

    constructor(){
        this.todoItems = [];

        this.todoItems.push({
            id: "123",
            title: "play tennis",
            is_done: false,
            creatorId: "1234"
        })
    }

    getTodo(id: string, creatorId: string): ?TodoItemStructure{

        let todo =  this.todoItems.find(item => item.id === id && item.creatorId === creatorId);
        if (todo == null) return null;
        else return todo;
    }

    getAllTodo(creatorId: string):Array<TodoItemStructure>{
        return this.todoItems.filter(item => item.creatorId === creatorId);
    }

    deleteTodo(id: string, creatorId: string): ?TodoItemStructure{

        let removeIndex:number = this.todoItems.map((item) => item.id).indexOf(id);

        if (removeIndex === -1) return null;

        let todoItemToDelete = this.todoItems[removeIndex];
        if (todoItemToDelete.creatorId !== creatorId) return null;

        this.todoItems.splice(removeIndex, 1);

        return todoItemToDelete;
    }

    writeTodo(title: string, creatorId: string): TodoItemStructure{

        let todoItem: TodoItemStructure = {
            id: uuid.v4(),
            title: title,
            is_done: false,
            creatorId: creatorId
        };

        this.todoItems.push(todoItem);

        return todoItem;
    }

    updateTodo(id: string, is_done: boolean, creatorId: string): TodoItemStructure {

        let updateIndex:number = this.todoItems.map((item) => item.id)
            .indexOf(id);

        if (updateIndex === -1) return null;

        let todoItemToUpdate: TodoItemStructure = this.todoItems[updateIndex];
        if (todoItemToUpdate.creatorId !== creatorId) return null;

        todoItemToUpdate.is_done = is_done;

        return todoItemToUpdate;

    }
}