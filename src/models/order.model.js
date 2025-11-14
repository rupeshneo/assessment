"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { as: "client", foreignKey: "clientId" });
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
      Order.hasMany(models.Answer, { foreignKey: "orderId", as: "answers" });
    }
  }

  Order.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      status: {
        type: DataTypes.ENUM("created", "in_progress", "completed", "verified"),
        defaultValue: "created",
      },
    },
    { sequelize, tableName: "orders", modelName: "Order" }
  );

  return Order;
};
