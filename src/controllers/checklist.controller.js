const { Checklist, ChecklistQuestion, Order } = require("../models");
const logger = require("../utils/logger");

exports.createChecklist = async (req, res) => {
  let t; // Move outside try
  
  try {
    const { name, description, questions, orderId } = req.body;
    
    const checklistCheck = await Checklist.findOne({ where: { orderId, orderId } });
    
    if (checklistCheck) {
      return res.status(400).json({ message: "Checklist already exists.You can update it" });
    }

    t = await Checklist.sequelize.transaction();
    // 1. Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid orderId. Order does not exist." });
    }

    // 2. Create checklist
    const checklist = await Checklist.create(
      { name, description, createdById: req.user.id, orderId, isDefault: 1 },
      { transaction: t }
    );

    // 3. Create questions
    if (Array.isArray(questions)) {
      for (const q of questions) {        
        let options = q.options || [];
        
        if (!Array.isArray(options)) {
          await t.rollback();
          return res.status(400).json({ message: "Options must be an array" });
        }

        // Properly validate using a normal loop (NOT forEach)
        for (const option of options) {
          if (typeof option !== "string") {
            await t.rollback();
            return res.status(400).json({ message: "Options must be strings" });
          }
        }
        
        await ChecklistQuestion.create(
          {
            questionText: q.questionText,
            type: (q.type).trim(),
            options: options ? options.map(opt => opt.trim()) : [],
            required: q.required || false,
            checklistId: checklist.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return res.status(201).json({ message: "Checklist created", checklist });

  } catch (error) {
    if (t) await t.rollback();
    logger.error("createChecklist error:", error);
    return res.status(500).json({ message: error.message });
  }
};


exports.getChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findByPk(req.params.id, {
      include: { model: ChecklistQuestion, as: "questions" },
    });
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });
    res.json(checklist);
  } catch (error) {
    logger.error("getChecklist error:", error);
    res.status(500).json({ message: error.message });
  }
};
