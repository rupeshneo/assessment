"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("created", "inspection_pending", "inspected", "reinspection_required", "completed"),
        defaultValue: "created",
      },
      statusFlow: {
        type: Sequelize.JSON,
        defaultValue: '["created"]'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      clientId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: true,
        onDelete: "NO ACTION",
      },
      procurementManagerId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "NO ACTION",
      },
      inspectionManagerId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "NO ACTION",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
