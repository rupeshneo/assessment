"use strict";

module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      answers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      inspectionManagerId: {
        type: DataTypes.INTEGER,
      },
      orderId: {
        type: DataTypes.INTEGER,
      },
      checklistId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "answers",
      paranoid: true,
    }
  );

  // Associations
  Answer.associate = (models) => {
    Answer.belongsTo(models.User, {
      as: "inspectionManager",
      foreignKey: "inspectionManagerId",
    });

    Answer.belongsTo(models.Order, {
      as: "order",
      foreignKey: "orderId",
    });

    Answer.belongsTo(models.Checklist, {
      as: "checklist",
      foreignKey: "checklistId",
    });

    Answer.hasMany(models.FileUpload, {
      as: "fileUploads",
      foreignKey: "answerId",
    });

    Answer.hasMany(models.ChecklistQuestion, {
      as: "questions",
      foreignKey: "checklistId",
      sourceKey: "checklistId",
    });
  };

  return Answer;
};
