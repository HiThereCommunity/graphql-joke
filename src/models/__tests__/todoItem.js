
import TodoItem from '../todoItem'
import { testDBConnection } from '../../testUtils'
import {PostgresConnector} from '../../connectors'

describe('TodoItem model', () => {
  const postgres = new PostgresConnector(testDBConnection, true)

  const rootValue = {
    db: postgres
  }

  beforeEach(async () => {
    // clear the database before each test. Make sure that the name of the database table matches test.
    await postgres.getSequelize().sync({force: true, match: /test$/})
  })

  afterAll(() => postgres.getSequelize().close())

  const createTodo = async (title: string, completed: ?boolean = false) => {
    return await postgres.getTodoItemEntity().create({title, completed})
  }

  it('retrieves a todo', async () => {
    const newTodoItem = await createTodo('dummy todo', false)
    const todoItemGen = await TodoItem.gen(newTodoItem.id, rootValue)

    if (todoItemGen == null) {
      throw new Error(`Expected todo to be found but got ${String(todoItemGen)}`)
    }

    expect(todoItemGen.getId()).toEqual(newTodoItem.id)
    expect(todoItemGen.getTitle()).toEqual('dummy todo')
    expect(todoItemGen.getCompleted()).toEqual(false)
  })

  it('returns when retrieving a todo for an unknown id', async () => {
    const todoItemGen = await TodoItem.gen('1', rootValue)
    expect(todoItemGen).toBeNull()
  })

  it('creates a new todo', async () => {
    const newTodo = await TodoItem.write('new todo', rootValue)
    if (newTodo == null) {
      throw new Error(`should have created a new todo but got ${String(newTodo)}`)
    }

    const dbTodo = await postgres.getTodoItemEntity().findById(newTodo.getId())
    expect(dbTodo).not.toBeNull()

    expect(dbTodo.title).toEqual('new todo')
    expect(dbTodo.completed).toEqual(false)
  })

  it('updates a todo', async () => {
    const newTodoItem = await createTodo('dummy todo', false)
    const updatedTodo = await TodoItem.update(newTodoItem.id, true, rootValue)
    if (updatedTodo == null) {
      throw new Error(`Expected updated todo to be found but got ${String(updatedTodo)}`)
    }

    expect(updatedTodo.getId()).toEqual(newTodoItem.id)
    expect(updatedTodo.getTitle()).toEqual('dummy todo')
    expect(updatedTodo.getCompleted()).toEqual(true)

    const updatedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
    expect(updatedTodoDB.title).toEqual('dummy todo')
    expect(updatedTodoDB.completed).toEqual(true)
  })

  it('updates a todo', async () => {
    const newTodoItem = await createTodo('dummy todo', false)
    const updatedTodo = await TodoItem.update(newTodoItem.id, true, rootValue)
    if (updatedTodo == null) {
      throw new Error(`Expected updated todo to be found but got ${String(updatedTodo)}`)
    }

    expect(updatedTodo.getId()).toEqual(newTodoItem.id)
    expect(updatedTodo.getTitle()).toEqual('dummy todo')
    expect(updatedTodo.getCompleted()).toEqual(true)

    const updatedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
    expect(updatedTodoDB.title).toEqual('dummy todo')
    expect(updatedTodoDB.completed).toEqual(true)
  })

  it('returns null when updating a todo for a nonexistent id', async () => {
    const updatedTodo = await TodoItem.update('123', true, rootValue)
    expect(updatedTodo).toBeNull()
  })

  it('deletes a todo', async () => {
    const newTodoItem = await createTodo('dummy todo', false)

    const deletedTodoItem = await TodoItem.delete(newTodoItem.id, rootValue)
    if (deletedTodoItem == null) {
      throw new Error(`Expected deleted item but got ${String(deletedTodoItem)}`)
    }
    expect(deletedTodoItem.getId()).toEqual(newTodoItem.id)
    expect(deletedTodoItem.getTitle()).toEqual('dummy todo')
    expect(deletedTodoItem.getCompleted()).toEqual(false)

    const deletedTodoDB = await postgres.getTodoItemEntity().findById(newTodoItem.id)
    expect(deletedTodoDB).toBeNull()
  })

  it('returns null when deleting a todo for a nonexistent id', async () => {
    const deletedTodoItem = await TodoItem.delete('123', rootValue)
    expect(deletedTodoItem).toBeNull()
  })
})
