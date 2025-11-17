"use strict";

module.exports = (sequelize, DataTypes) => {
  const ChecklistQuestion = sequelize.define(
    "ChecklistQuestion",
    {
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM(
          "text",
          "radio",
          "dropdown",
          "textarea",
          "number",
          "checkbox",
          "file",
          "datetime",
          "date"
        ),
        allowNull: false,
      },

      options: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("options");
          return rawValue ? JSON.parse(rawValue) : null;
        },
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
      },
    },
    {
      tableName: "checklistQuestions",
      paranoid: true,
    }
  );

  // Associations
  ChecklistQuestion.associate = (models) => {
    ChecklistQuestion.belongsTo(models.Checklist, {
      foreignKey: "checklistId",
      as: "checklist",
    });
  };

  return ChecklistQuestion;
};
