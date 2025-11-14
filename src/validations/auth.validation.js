const { body } = require("express-validator");

exports.createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 13 })
    .withMessage("Mobile number must be between 10 to 13 digits"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .custom((value, { req }) => {
      const creatorRole = req.user.role;

      const allowedRolesByCreator = {
        admin: ["procurement", "inspection", "client"],
        procurement: ["inspection", "client"],
        inspection: ["client"],
      };

      const allowed = allowedRolesByCreator[creatorRole] || [];

      if (!allowed.includes(value)) {
        throw new Error(
          `${creatorRole} cannot create a ${value}.`
        );
      }

      return true;
    }),
];

exports.loginValidation = [
  body("email")
    .if(body("phone").not().exists())
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phone")
    .if(body("email").not().exists())
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 13 })
    .withMessage("Mobile number must be between 10 to 13 digits"),

  body("password").notEmpty().withMessage("Password is required"),
];

exports.assignIncpectionManagerValidation = [
  body("inspectionManagerId")
    .notEmpty()
    .withMessage("Inspection Manager ID is required")
    .isInt()
    .withMessage("Inspection Manager ID must be an integer"),
];
