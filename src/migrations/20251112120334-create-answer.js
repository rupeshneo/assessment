"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("answers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      answers: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: "[]",
      },
      submittedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      inspectionManagerId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "NO ACTION",
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: "orders", key: "id" },
        onDelete: "NO ACTION",
      },
      checklistId: {
        type: Sequelize.INTEGER,
        references: { model: "checklists", key: "id" },
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
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("answers");
  },
};
