"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Note: Sequelize doesn't support `hide: true`
        // This is usually handled in serializer or response filtering.
      },

      role: {
        type: DataTypes.ENUM(
          "admin",
          "procurement",
          "inspection",
          "client"
        ),
        allowNull: false,
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      assign: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      paranoid: true,
    }
  );

  // Associations
  User.associate = (models) => {
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
  };

  return User;
};
