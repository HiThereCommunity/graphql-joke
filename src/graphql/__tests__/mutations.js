
import { testDBConnection } from '../../testUtils'
import {PostgresConnector} from '../../connectors'
import { graphql } from 'graphql'

import schema from '../'

describe('GraphQL mutations', () => {
  const postgres = new PostgresConnector(testDBConnection, true)

  const rootValue = {
    db: postgres
  }

  beforeEach(async () => {
    // clear the database before each test. Make sure that the name of the database table matches test.
    await postgres.getSequelize().sync({force: true, match: /test$/})
  })

  afterAll(() => postgres.getSequelize().close())

  it('adds a todo', async () => {
    const mutation = `
      mutation AddTodoQuery($input: AddTodoItemInput!) {
        addTodo(input: $input) {
          clientMutationId
          newTodo {
            id
            title
            completed
          }
        }
      }
    `

    const params = {
      input: {
        clientMutationId: '1234',
        title: 'new todo'
      }
    }

    const result = await graphql(schema, mutation, rootValue, null, params)
    expect(result).toMatchSnapshot()
  })

  it('updates a todo', async () => {
    await postgres.getTodoItemEntity().create({
      id: 1,
      title: 'todo',
      completed: false
    })

    const mutation = `
      mutation AddTodoQuery($input: UpdateTodoItemInput!) {
        updateTodo(input: $input) {
          clientMutationId
          updatedTodo {
            id
            title
            completed
          }
        }
      }
    `

    const params = {
      input: {
        clientMutationId: '1234',
        completed: true,
        todoId: 'VG9kb0l0ZW06MQ=='
      }
    }

    const result = await graphql(schema, mutation, rootValue, null, params)
    expect(result).toMatchSnapshot()
  })

  it('deletes a todo', async () => {
    await postgres.getTodoItemEntity().create({
      id: 1,
      title: 'todo',
      completed: false
    })

    const mutation = `
      mutation DeleteTodoQuery($input: DeleteTodoItemInput!) {
        deleteTodo(input: $input) {
          clientMutationId
          deletedTodoId
          deletedTodo {
            id
            title
            completed
          }
        }
      }
    `

    const params = {
      input: {
        clientMutationId: '1234',
        todoId: 'VG9kb0l0ZW06MQ=='
      }
    }

    const result = await graphql(schema, mutation, rootValue, null, params)
    expect(result).toMatchSnapshot()
  })
})
