'use strict';
module.exports = function (sequelize, DataTypes) {
  var TodoItem = sequelize.define('TodoItem', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    state: {
      allowNull: false,
      defaultValue: 'active',
      type: DataTypes.STRING(16),
    },
    description: {
      allowNull: false,
      defaultValue: 'Things to do .',
      type: DataTypes.STRING(256),
    },
    remark: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    tag: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    deadline: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  }, {
    underscored: false,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      },
    },
  });
  return TodoItem;
};