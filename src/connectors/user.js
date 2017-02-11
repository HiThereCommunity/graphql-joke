
// @flow

/**
 * Created by Florentijn Hogerwerf on 11/02/17.
 */

import Sequelize from 'sequelize';

export default class UserConnector {

  _model: Object;

  constructor(sequelize: Object) {
    this._model = sequelize.models.user;
  }

  getEntity(): Object {
    return this._model;
  }
}
