// @flow

export default (sequelize: Object, DataTypes: Object): Object => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return user;
}
