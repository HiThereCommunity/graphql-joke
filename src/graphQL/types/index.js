/**
 * Created by dirk-janrutten on 01/09/16.
 */

import {TodoItemDB} from "./../connectors";

export type Viewer = {
    id: string
}

export type RootValue = {
    viewer: Viewer,
    db: {
        todo: TodoItemDB
    }
}