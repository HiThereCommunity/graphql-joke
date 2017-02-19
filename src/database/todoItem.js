// @flow

export default (sequelize: Object, DataTypes: Object): Object => {
  const todoItem = sequelize.define('todo_item', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        todoItem.belongsTo(models.user, {
          foreignKey: {
            name: "creator",
            allowNull: false,
            targetKey: "id"
          }
        });
      }
    }
  });

  return todoItem;
}
