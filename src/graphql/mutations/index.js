// @flow

import {GraphQLObjectType} from 'graphql'
import GraphQLMutationCreateTodo from './addTodo'
import GraphQLMutationUpdateTodo from './updateTodo'
import GraphQLMutationDeleteTodo from './deleteTodo'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodo: GraphQLMutationCreateTodo,
    updateTodo: GraphQLMutationUpdateTodo,
    deleteTodo: GraphQLMutationDeleteTodo
  })
})
