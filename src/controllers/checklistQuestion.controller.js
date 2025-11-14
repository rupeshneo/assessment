const { ChecklistQuestion } = require("../models");

exports.createQuestion = async (req, res) => {
  try {
    const question = await ChecklistQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    logger.error("createQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await ChecklistQuestion.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    await question.update(req.body);
    res.json({ message: "Question updated", question });
  } catch (error) {
    logger.error("updateQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await ChecklistQuestion.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    await question.destroy();
    res.json({ message: "Question deleted" });
  } catch (error) {
    logger.error("deleteQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};
