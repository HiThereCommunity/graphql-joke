// @flow
import TodoList from '../todoList'
import { testDBConnection } from '../../testUtils'
import {PostgresConnector} from '../../connectors'

describe('TodoList model', () => {
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

  it('retrieves all the todos', async () => {
    await createTodo('dummy todo 1', false)
    await createTodo('dummy todo 2', true)
    await createTodo('dummy todo 3', false)
    await createTodo('dummy todo 4', true)

    const todoList = new TodoList(rootValue)
    const todoItems = await todoList.getAll()
    expect(todoItems.length).toEqual(4)
  })

  it('retrieves all completed todos', async () => {
    await createTodo('dummy todo 1', false)
    await createTodo('dummy todo 2', true)
    await createTodo('dummy todo 3', true)
    await createTodo('dummy todo 4', true)

    const todoList = new TodoList(rootValue)
    const todoItems = await todoList.getCompleted()
    expect(todoItems.length).toEqual(3)
  })

  it('retrieves all active todos', async () => {
    await createTodo('dummy todo 1', false)
    await createTodo('dummy todo 2', true)
    await createTodo('dummy todo 3', true)
    await createTodo('dummy todo 4', true)

    const todoList = new TodoList(rootValue)
    const todoItems = await todoList.getActive()
    expect(todoItems.length).toEqual(1)
  })

  it('retrieves the todo list by id', async () => {
    const todoList = TodoList.gen('TodoListId', rootValue)
    expect(todoList).not.toBeNull()
  })

  it('returns null if todo list is retrieved for an unknown id', async () => {
    const todoList = TodoList.gen('_unknown_', rootValue)
    expect(todoList).toBeNull()
  })
})
