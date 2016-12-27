// @flow
/**
 * Created by dirk-janrutten on 04/09/16.
 */

export {default as PostgresConnector} from './postgresConnector'

type SequelizeID = number;

export type TodoItemEntity = {
  id: SequelizeID,
  title: string,
  completed: boolean
}
