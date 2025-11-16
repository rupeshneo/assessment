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
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("options");
          return rawValue ? JSON.parse(rawValue) : null;
        }
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      checklistId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "checklists",
          key: "id",
        },
        onDelete: "CASCADE",
      }
    },
    {
      sequelize,
      modelName: "ChecklistQuestion",
      tableName: "checklistQuestions",
      paranoid: true,
    }
  );

  return ChecklistQuestion;
};
