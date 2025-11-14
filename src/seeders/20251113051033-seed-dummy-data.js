"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Rupesh@123", 10);

    await queryInterface.sequelize.query(
      "INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `createdBy`, `assign`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES \
      (1,	'System Admin',	'admin@manage.com',	'9876543210',	'$2b$10$QEy2uXwdjg.UWqOKDP8nv.EWZAI10Q.1rPGP2XNiP2o93eG1TNsiK',	NULL,	NULL,	'admin',	1,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20'), \
      (2,	'System Admin',	'procurement@manage.com',	'9876543211',	'$2b$10$MOF1lq.WLAhBad7zAuHKjujipJ8ezjtS4UP0ktZ7ozdFDC1FirLqK',	1,	1,	'procurement',	1,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20'), \
      (3,	'System Admin',	'inspection@manage.com',	'9876543212',	'$2b$10$MOF1lq.WLAhBad7zAuHKjujipJ8ezjtS4UP0ktZ7ozdFDC1FirLqK',	1,	1,	'inspection',	1,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20'), \
      (4,	'Admin User',	'client@manage.com',	'9876543213',	'$2b$10$MOF1lq.WLAhBad7zAuHKjujipJ8ezjtS4UP0ktZ7ozdFDC1FirLqK',	1,	1,	'client',	1,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20');"
    );

    await queryInterface.sequelize.query(
      "INSERT INTO `orders` (`id`, `title`, `description`, `status`, `clientId`, `procurementManagerId`, `inspectionManagerId`, `createdAt`, `updatedAt`) VALUES \
      (1,	'Order for office supplies',	'Order for electronic components',	'created',	4,	2,	3,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20');"
    );

    await queryInterface.sequelize.query(
      "INSERT INTO `checklists` (`id`, `name`, `description`, `isDefault`, `createdById`, `orderId`, `createdAt`, `updatedAt`) VALUES \
      (1,	'New Checklist',	'Checklist description',	1,	2,	1,	'2025-11-14 12:24:20',	'2025-11-14 12:24:20');"
    );

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
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("orders", null, {});
    await queryInterface.bulkDelete("checklists", null, {});
    await queryInterface.bulkDelete("checklistQuestions", null, {});
  },
};
