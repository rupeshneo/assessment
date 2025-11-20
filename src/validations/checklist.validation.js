const { body } = require("express-validator");

exports.checklistValidationRules = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("name must be 1-255 characters"),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 2000 })
    .withMessage("description max length is 2000 characters"),

  body("questions")
    .exists({ checkFalsy: true })
    .withMessage("questions is required")
    .isArray({ min: 1 })
    .withMessage("questions must be a non-empty array"),

  body("questions.*.questionText")
    .exists({ checkFalsy: true })
    .withMessage("question text is required")
    .isString()
    .withMessage("question text must be a string")
    .isLength({ min: 1 })
    .withMessage("question text cannot be empty"),

  body("questions.*.type")
    .optional()
    .isIn([
      "text",
      "radio",
      "dropdown",
      "textarea",
      "number",
      "checkbox",
      "file",
      "datetime",
      "date",
    ])
    .withMessage("invalid question type"),

  body("questions.*.options").custom((value, { req, path }) => {
    const match = path.match(/\[(\d+)\]/);
    if (!match) return true;

    const index = match[1];
    const type = req.body.questions?.[index]?.type;

    const needsOptions = ["radio", "dropdown", "checkbox"].includes(type);

    if (needsOptions) {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(
          "options is required for radio, dropdown, and checkbox"
        );
      }

      const validItems = value.every(
        (o) => typeof o === "string" && o.trim().length > 0
      );

      if (!validItems) {
        throw new Error("each option must be a non-empty string");
      }
    }
    return true;
  }),

  body("questions.*.required")
    .optional()
    .isBoolean()
    .withMessage("required must be a boolean"),

  body("orderId")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("orderId must be a non-negative integer"),
];
