// @flow
//
import TodoItem from '../todoItem'
import db from '../../database';
import DataLoader from 'dataloader';
import User from '../user';
import { batchGetTodoItems } from '../../loaders';

const loader = new DataLoader(ids => batchGetTodoItems(ids));

describe('TodoItem model', () => {

  beforeEach(async () => {
    loader.clearAll();
    // clear the database before each test. Make sure that the name of the database table matches test.
    await db.sequelize.sync({force: true, match: /test$/})
  })

  afterAll(() => db.sequelize.close())

  const createTodo = async (id: number, title: string, completed: boolean, creator: number) => {
    return await db.todo_item.create({id, title, completed, creator})
  }

  const createUser = async (id: number, name: string) => {
    return await db.user.create({id, name});
  }

  describe('static gen', () => {
    it('retrieves a todo', async () => {

      const userData = await createUser(1, "Bob");
      await createTodo(2, 'dummy todo', false, 1);
      const viewer = new User(userData);
      const todoItemGen = await TodoItem.gen(viewer, "2", loader);

      if (todoItemGen == null)
        throw new Error(`Expected todo to be found but got ${String(todoItemGen)}`)

      expect(todoItemGen).toMatchObject({
        id: "2",
        title: "dummy todo",
        completed: false
      });

      expect(await TodoItem.gen(viewer, "3", loader)).toBeNull();

      await todoItemGen.update(true);

      expect(todoItemGen.completed).toEqual(true);

      await todoItemGen.destroy(loader);

      const todoItem = await db.todo_item.findById(2);
      expect(todoItem).toBeNull();

    });

    it('returns null if a todo is retrieved for a user with access', async () => {
      await createUser(1, "Bob");
      const userDataAndrew = await createUser(2, "Andrew");

      await createTodo(2, 'dummy todo', false, 1);
      const viewer = new User(userDataAndrew);

      expect(await TodoItem.gen(viewer, "2", loader)).toBeNull();
    });
  });

  //
  //
  // it('returns when retrieving a todo for an unknown id', async () => {
  //   const todoItemGen = await TodoItem.gen('1', rootValue)
  //   expect(todoItemGen).toBeNull()
  // })
  //
  // it('creates a new todo', async () => {
  //   const newTodo = await TodoItem.write('new todo', rootValue)
  //   if (newTodo == null) {
  //     throw new Error(`should have created a new todo but got ${String(newTodo)}`)
  //   }
  //
  //   const dbTodo = await postgres.getTodoItemEntity().findById(newTodo.getId())
  //   expect(dbTodo).not.toBeNull()
  //
  //   expect(dbTodo.title).toEqual('new todo')
  //   expect(dbTodo.completed).toEqual(false)
  // })
  //
  // it('updates a todo', async () => {
  //   const newTodoItem = await createTodo('dummy todo', false)
  //   const updatedTodo = await TodoItem.update(newTodoItem.id, true, rootValue)
  //   if (updatedTodo == null) {
  //     throw new Error(`Expected updated todo to be found but got ${String(updatedTodo)}`)
  //   }
  //
  //   expect(updatedTodo.getId()).toEqual(newTodoItem.id)
  //   expect(updatedTodo.getTitle()).toEqual('dummy todo')
  //   expect(updatedTodo.getCompleted()).toEqual(true)
  //
  //   const updatedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
  //   expect(updatedTodoDB.title).toEqual('dummy todo')
  //   expect(updatedTodoDB.completed).toEqual(true)
  // })
  //
  // it('updates a todo', async () => {
  //   const newTodoItem = await createTodo('dummy todo', false)
  //   const updatedTodo = await TodoItem.update(newTodoItem.id, true, rootValue)
  //   if (updatedTodo == null) {
  //     throw new Error(`Expected updated todo to be found but got ${String(updatedTodo)}`)
  //   }
  //
  //   expect(updatedTodo.getId()).toEqual(newTodoItem.id)
  //   expect(updatedTodo.getTitle()).toEqual('dummy todo')
  //   expect(updatedTodo.getCompleted()).toEqual(true)
  //
  //   const updatedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
  //   expect(updatedTodoDB.title).toEqual('dummy todo')
  //   expect(updatedTodoDB.completed).toEqual(true)
  // })
  //
  // it('returns null when updating a todo for a nonexistent id', async () => {
  //   const updatedTodo = await TodoItem.update('123', true, rootValue)
  //   expect(updatedTodo).toBeNull()
  // })
  //
  // it('deletes a todo', async () => {
  //   const newTodoItem = await createTodo('dummy todo', false)
  //
  //   const deletedTodoItem = await TodoItem.delete(newTodoItem.id, rootValue)
  //   if (deletedTodoItem == null) {
  //     throw new Error(`Expected deleted item but got ${String(deletedTodoItem)}`)
  //   }
  //   expect(deletedTodoItem.getId()).toEqual(newTodoItem.id)
  //   expect(deletedTodoItem.getTitle()).toEqual('dummy todo')
  //   expect(deletedTodoItem.getCompleted()).toEqual(false)
  //
  //   const deletedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
  //   expect(deletedTodoDB).toBeNull()
  // })
  //
  // it('returns null when deleting a todo for a nonexistent id', async () => {
  //   const deletedTodoItem = await TodoItem.delete('123', rootValue)
  //   expect(deletedTodoItem).toBeNull()
  // })
})
