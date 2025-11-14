exports.createOderValidation = [
    body("title").isString().withMessage("Title must be a string").notEmpty().withMessage("Title is required"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("clientId").isInt().withMessage("Client ID must be an integer"),
    body("procurementManagerId").isInt().withMessage("Procurement Manager ID must be an integer"),
    body("inspectionManagerId").isInt().withMessage("Inspection Manager ID must be an integer"),
]