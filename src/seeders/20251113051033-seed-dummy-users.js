"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Rupesh@123", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "System Admin",
        email: "procurement@manage.com",
        phone: "9876543211",
        password: hashedPassword,
        role: "procurement",
        isActive: true,
        createdBy: 1,
        assign: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "System Admin",
        email: "inspection@manage.com",
        phone: "9876543212",
        password: hashedPassword,
        role: "inspection",
        isActive: true,
        createdBy: 1,
        assign: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin User",
        email: "client@manage.com",
        phone: "9876543213",
        password: hashedPassword,
        role: "client",
        isActive: true,
        createdBy: 1,
        assign: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("orders", [
      {
        clientId: 4,
        procurementManagerId: 2,
        inspectionManagerId: 3,
        title: "Order for office supplies",
        description: "Order for electronic components",
        status: "created",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("checklists", [
      {
        orderId: 1,
        createdById: 2,
        name: "New Checklist",
        description: "Checklist description",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    //execute query directly
    await queryInterface.sequelize.query(
      "INSERT INTO `checklistQuestions` (`id`, `questionText`, `type`, `options`, `required`, `checklistId`, `createdAt`, `updatedAt`) VALUES \
          (1,	'What is your name',	'text',	'[]',	1,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (2,	'Are you working remotely?',	'radio',	'[\"yes\",\"no\"]',	1,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (3,	'Select your favorite fruits',	'dropdown',	'[\"Apple\",\"Banana\",\"Orange\",\"Grapes\"]',	0,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (4,	'Provide additional comments',	'textarea',	'[]',	0,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (5,	'How many years of experience do you have?',	'number',	'[]',	1,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (6,	'Choose your preferred programming languages',	'checkbox',	'[\"JavaScript\",\"Python\",\"Java\",\"C#\"]',	0,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (7,	'Upload your resume',	'file',	'[]',	1,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (8,	'Select your appointment date and time',	'datetime',	'[]',	0,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42'), \
          (9,	'Select your birth date',	'date',	'[]',	1,	1,	'2025-11-14 05:45:42',	'2025-11-14 05:45:42')"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      { email: "client@manage.com" },
      {}
    );
  },
};
