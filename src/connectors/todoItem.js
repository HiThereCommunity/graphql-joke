// @flow

import DataLoader from 'dataloader';
import Sequelize from 'sequelize';

export default class TodoItemConnector {

  _loader: DataLoader<string, Object>
  _model: Object;

  constructor(sequelize: Object) {

    this._loader = new DataLoader(ids =>
      sequelize.models.todo_item.findAll({
        where: {
          id: { $in: ids }
        }
      })
    )
    this._model = sequelize.models.todo_item;
  }

  fetch(id: string): Promise<Object> {
    return this._loader.load(id);
  }

  getEntity(): Object {
    return this._model;
  }
}
