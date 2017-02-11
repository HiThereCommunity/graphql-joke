// @flow

import DataLoader from 'dataloader';
import Sequelize from 'sequelize';

export default class TodoItemConnector {

  _loader: DataLoader<string, Object>

  model: Object;

  constructor(sequelize: Object) {

    this._loader = new DataLoader(ids =>
      todoItem.findAll({
        where: {
          id: { $in: ids }
        }
      })
    )

    this.model = todoItem;
  }

  fetch(id: string): Promise<Object> {
    return this._loader.load(id);
  }

  write(title: string): Promise<Object> {
    return this.model.create({title});
  }


}
