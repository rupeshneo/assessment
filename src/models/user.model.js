"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "clientId",
        as: "clientOrders",
      });
      User.hasMany(models.Order, {
        foreignKey: "procurementManagerId",
        as: "procurementOrders",
      });
      User.hasMany(models.Order, {
        foreignKey: "inspectionManagerId",
        as: "inspectionOrders",
      });
      User.hasMany(models.Checklist, {
        foreignKey: "createdById",
        as: "createdChecklists",
      });
      User.hasMany(models.Answer, {
        foreignKey: "inspectionManagerId",
        as: "submittedAnswers",
      });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true, unique: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      password: { type: DataTypes.STRING, allowNull: false, hide: true },
      role: {
        type: DataTypes.ENUM("admin", "procurement", "inspection", "client"),
        allowNull: false,
      },
      createdBy: { type: DataTypes.INTEGER, allowNull: true },
      assign: { type: DataTypes.INTEGER, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, tableName: "users", modelName: "User" }
  );

  return User;
};
