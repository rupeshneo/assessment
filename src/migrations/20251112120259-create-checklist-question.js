"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("checklistQuestions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      questionText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("text","radio","dropdown","textarea","number","checkbox","file","datetime","date"),
        allowNull: false,
      },
      options: {
        type: Sequelize.JSON,
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      checklistId: {
        type: Sequelize.INTEGER,
        references: { model: "checklists", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("checklistQuestions");
  },
};
