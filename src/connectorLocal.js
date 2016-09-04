/**
 * Created by dirk-janrutten on 01/09/16.
 */


type TodoItem = {
    id: string,
    title: string,
    is_done: boolean
}

let todoItems: Array<TodoItem> = [];

todoItems.push({
    "id": "294e01ec-afde-4bef-acfd-4ef11c94d0f5",
    "is_done": false,
    "title": "play tennis"
});

export default class ConnectorLocal {

    getTodoItems(): Array<TodoItem> {
        return todoItems;
    }
}