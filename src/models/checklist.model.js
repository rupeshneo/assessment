"use strict";

module.exports = (sequelize, DataTypes) => {
  const Checklist = sequelize.define(
    "Checklist",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },

      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
    },
    {
      tableName: "checklists",
      paranoid: true,
    }
  );

  // Associations
  Checklist.associate = (models) => {
    Checklist.belongsTo(models.User, {
      as: "createdBy",
      foreignKey: "createdById",
    });

    Checklist.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });

    Checklist.hasMany(models.ChecklistQuestion, {
      foreignKey: "checklistId",
      as: "questions",
    });

    Checklist.hasOne(models.Answer, {
      foreignKey: "checklistId",
      as: "answers",
    });
  };

  return Checklist;
};
