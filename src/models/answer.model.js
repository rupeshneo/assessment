"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.User, {
        as: "inspectionManager",
        foreignKey: "inspectionManagerId",
      });
      Answer.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
      Answer.belongsTo(models.Checklist, {
        foreignKey: "checklistId",
        as: "checklist",
      });
      Answer.hasMany(models.FileUpload, {
        foreignKey: "answerId",
        as: "fileUploads",
      });
      Answer.hasMany(models.ChecklistQuestion, {
        foreignKey: "checklistId",
        sourceKey: "checklistId",
        as: "questions",
      });
    }
  }

  Answer.init(
    {
      answers: { type: DataTypes.JSON, allowNull: true },
      submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      inspectionManagerId: { type: DataTypes.INTEGER },
      orderId: { type: DataTypes.INTEGER },
      checklistId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "Answer", tableName: "answers" }
  );

  return Answer;
};
