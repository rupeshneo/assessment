const { body, validationResult } = require('express-validator');

// name, description, questions, orderId
/**
 * Validations for checklist:
 * - name: required string
 * - description: optional string
 * - questions: required non-empty array of question objects
 *    - questions.*.text: required string
 *    - questions.*.type: optional enum
 *    - questions.*.options: optional non-empty array of non-empty strings (for choice types)
 *    - questions.*.required: optional boolean
 * - orderId: optional integer (non-negative)
 */

const checklistValidationRules = () => [
    body('name')
        .exists({ checkFalsy: true }).withMessage('name is required')
        .isString().withMessage('name must be a string')
        .isLength({ min: 1, max: 255 }).withMessage('name must be 1-255 characters'),

    body('description')
        .optional({ nullable: true })
        .isString().withMessage('description must be a string')
        .isLength({ max: 2000 }).withMessage('description max length is 2000 characters'),

    body('questions')
        .exists({ checkFalsy: true }).withMessage('questions is required')
        .isArray({ min: 1 }).withMessage('questions must be a non-empty array'),

    body('questions.*.text')
        .exists({ checkFalsy: true }).withMessage('question text is required')
        .isString().withMessage('question text must be a string')
        .isLength({ min: 1 }).withMessage('question text cannot be empty'),

    body('questions.*.type')
        .optional()
        .isIn(["text","radio","dropdown","textarea","number","checkbox","file","datetime","date"])
        .withMessage('invalid question type'),

    body('questions.*.options')
        .optional()
        .isArray({ min: 1 }).withMessage('options must be a non-empty array')
        .bail()
        .custom((opts) => Array.isArray(opts) && opts.every(o => typeof o === 'string' && o.trim().length > 0))
        .withMessage('each option must be a non-empty string'),

    body('questions.*.required')
        .optional()
        .isBoolean().withMessage('required must be a boolean'),

    body('orderId')
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage('orderId must be a non-negative integer'),
];

const validateChecklist = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ errors: errors.array() });
};

module.exports = {
    checklistValidationRules,
    validateChecklist,
};
