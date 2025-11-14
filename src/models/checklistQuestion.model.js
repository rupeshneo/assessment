"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChecklistQuestion extends Model {
    static associate(models) {
      // A question belongs to one checklist
      ChecklistQuestion.belongsTo(models.Checklist, {
        foreignKey: "checklistId",
        as: "checklist",
      });
    }
  }

  ChecklistQuestion.init(
    {
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("text","radio","dropdown","textarea","number","checkbox","file","datetime","date"),
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON,
        allowNull: true, // e.g. ["Yes", "No"]
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ChecklistQuestion",
      tableName: "checklistQuestions",
    }
  );

  return ChecklistQuestion;
};
