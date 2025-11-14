const { body, validationResult } = require("express-validator");
const { Order } = require("../../models");

const answerValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isNumeric()
    .withMessage("Order ID must be a number"),

  body("responses")
    .notEmpty()
    .withMessage("Answer content is required")
    .isArray({ min: 1 })
    .withMessage("Responses must be a non-empty array"),

  body("responses.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required for each response")
    .isNumeric()
    .withMessage("Question ID must be a number"),

  body("responses.*.answer")
    .notEmpty()
    .withMessage("Answer is required for each response")
    .isString()
    .withMessage("Answer must be a string"),
];

module.exports = {
  answerValidation,
};
