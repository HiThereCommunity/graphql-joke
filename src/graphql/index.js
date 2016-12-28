// @flow
/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import {GraphQLSchema} from 'graphql'

 import query from './query'
 import mutation from './mutations'

 export default new GraphQLSchema({
   query,
   mutation
 })
