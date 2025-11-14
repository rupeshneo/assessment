"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    static associate(models) {
      Checklist.belongsTo(models.User, {
        as: "createdBy",
        foreignKey: "createdById",
      });
      Checklist.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
      Checklist.hasMany(models.ChecklistQuestion, {
        foreignKey: "checklistId",
        as: "questions",
      });
      Checklist.hasMany(models.Answer, {
        foreignKey: "checklistId",
        as: "answers",
      });
    }
  }

  Checklist.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "Checklist", tableName: "checklists" }
  );

  return Checklist;
};
