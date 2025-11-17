const { body } = require("express-validator");

const answerValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isNumeric()
    .withMessage("Order ID must be a number"),

body("responses")
  .notEmpty()
  .withMessage("Responses is required")
  .custom((value) => {
    let parsed;

    try {
      parsed = JSON.parse(value); // because it comes as string
    } catch (err) {
      throw new Error("Responses must be valid JSON");
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Responses must be an array");
    }

    parsed.forEach((item, index) => {
      if (!item.questionId) {
        throw new Error(`questionId is required at index ${index}`);
      }
      if (
        item.answers === undefined ||
        item.answers === null
      ) {
        throw new Error(`answers is required at index ${index}`);
      }
    });

    return true;
  })
];

module.exports = {
  answerValidation,
};
