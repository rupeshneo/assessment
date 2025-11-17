"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("checklists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdById: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "NO ACTION",
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: { model: "orders", key: "id" },
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
    await queryInterface.dropTable("checklists");
  },
};
