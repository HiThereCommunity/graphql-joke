
import { testDBConnection } from '../../testUtils'
import {PostgresConnector} from '../../connectors'
import { graphql } from 'graphql'

import schema from '../'

describe('GraphQL object identification', () => {
  const postgres = new PostgresConnector(testDBConnection, true)

  const rootValue = {
    db: postgres
  }

  beforeEach(async () => {
    // clear the database before each test. Make sure that the name of the database table matches test.
    await postgres.getSequelize().sync({force: true, match: /test$/})
  })

  afterAll(() => postgres.getSequelize().close())

  it('fetches the ID of the todo list', async () => {
    const query = `
      query TodoListQuery {
        todoList {
          id
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })

  it('fetches the todo list node', async () => {
    const query = `
      query TodoListNode {
        node(id: "VG9kb0xpc3Q6VG9kb0xpc3RJZA==") {
          id
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })

  it('fetches the todo item node', async () => {
    await postgres.getTodoItemEntity().create({
      id: 1,
      title: 'todo',
      completed: false
    })

    const query = `
      query TodoItemNode {
        node(id: "VG9kb0l0ZW06MQ==") {
          id
          ...on TodoItem {
            title
            completed
          }
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })
})
