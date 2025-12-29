"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM(
          "created",
          "inspection_pending",
          "inspected",
          "reinspection_required",
          "completed"
        ),
        defaultValue: "created",
      },

      statusFlow: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: ["created"],

        // FIXED GETTER
        get() {
          const raw = this.getDataValue("statusFlow");
          return raw ? raw : [];
        },
      },

      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      procurementManagerId: {
        type: DataTypes.INTEGER,
      },

      inspectionManagerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "orders",
      paranoid: true,
    }
  );

  // Associations
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      as: "client",
      foreignKey: "clientId",
    });

    Order.belongsTo(models.User, {
      as: "procurementManager",
      foreignKey: "procurementManagerId",
    });

    Order.belongsTo(models.User, {
      as: "inspectionManager",
      foreignKey: "inspectionManagerId",
    });

    Order.hasOne(models.Checklist, {
      foreignKey: "orderId",
      as: "checklist",
    });

    Order.hasMany(models.Answer, {
      foreignKey: "orderId",
      as: "answers",
    });
  };

  return Order;
};



