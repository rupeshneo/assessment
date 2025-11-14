"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "System Admin",
        email: "admin@manage.com",
        phone: "9876543210",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@procurement.com" }, {});
  },
};
