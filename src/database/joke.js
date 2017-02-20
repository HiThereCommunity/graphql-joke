// @flow

export default (sequelize: Object, DataTypes: Object): Object => {
  const joke = sequelize.define('joke', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    funnyLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        joke.belongsTo(models.user, {
          foreignKey: {
            name: "creator",
            allowNull: false,
            targetKey: "id"
          }
        });
      }
    }
  });

  return joke;
}
