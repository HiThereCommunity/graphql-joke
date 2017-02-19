
import { testDBConnection } from '../../testUtils'
import {PostgresConnector} from '../../connectors'
import { graphql } from 'graphql'

import schema from '../'

describe('GraphQL connections', () => {
  const postgres = new PostgresConnector(testDBConnection, true)

  const rootValue = {
    db: postgres
  }

  beforeAll(async () => {
    // clear the database before each test. Make sure that the name of the database table matches test.
    await postgres.getSequelize().sync({force: true, match: /test$/})

    const data = [
      { id: 1, title: 'todo 1', completed: false },
      { id: 2, title: 'todo 2', completed: true },
      { id: 3, title: 'todo 3', completed: false },
      { id: 4, title: 'todo 4', completed: false }
    ]

    await postgres.getTodoItemEntity().bulkCreate(data, { validate: true })
  })

  afterAll(() => postgres.getSequelize().close())

  it('fetches all the todos in the list', async () => {
    const query = `
      query TodoListQuery {
        todoList {
          items {
            ...TodoItemConnectionQuery
          }
          completed {
            ...TodoItemConnectionQuery
          }
          active {
            ...TodoItemConnectionQuery
          }
        }
      }

      fragment TodoItemConnectionQuery on TodoItemConnection {
        edges {
          cursor
          node {
            id
            title
            completed
          }
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })

  it('fetches the first todo in the list after a cursor', async () => {
    const query = `
      query FirstAfterCursorTodoQuery {
        todoList {
          items(first: 1 after: "YXJyYXljb25uZWN0aW9uOjA=") {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
                title
                completed
              }
            }
          }
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })

  it('fetches no todos at the end of the list', async () => {
    const query = `
      query EndOfTodoQuery {
        todoList {
          items(first: 1 after: "YXJyYXljb25uZWN0aW9uOjM=") {
            edges {
              node {
                id
                title
                completed
              }
            }
          }
        }
      }
    `

    const result = await graphql(schema, query, rootValue)
    expect(result).toMatchSnapshot()
  })
})
