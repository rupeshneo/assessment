const { deleteFiles } = require("../helpers/helper");
const { Answer, Checklist, ChecklistQuestion, FileUpload, Order, sequelize } = require("../models");
const logger = require("../utils/logger");

exports.submitAnswer = async (req, res) => {
  let transaction;

  try {
    const { orderId, responses } = req.body;
    const parsedResponses = JSON.parse(responses || "[]");

    // Validate order
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    const checklist = await Checklist.findOne({
      where: { orderId },
      include: [{ model: ChecklistQuestion, as: "questions" }],
    });

    if (!checklist || !checklist.questions?.length) {
      return res.status(400).json({ message: "Checklist not found" });
    }

    const questionIds = checklist.questions.map((q) => q.id);
    const validResponses = parsedResponses.filter((r) =>
      questionIds.includes(r.questionId)
    );

    // ---------------- VALIDATION LOOP ----------------
    for (const question of checklist.questions) {
      const userResponse = validResponses.find(
        (resp) => resp.questionId === question.id
      );

      const options = JSON.parse(question.options || "[]").map((o) => o.trim());
      const answerArr = userResponse?.answers
        ? userResponse.answers.split(",").map((a) => a.trim())
        : [];

      // Required validations
      if (question.required) {
        if (!userResponse?.answers && question.type !== "file") {
          throw new Error(`Answer required for question ${question.id}`);
        }

        if (question.type === "file") {
          const filePresent = req.files?.some(
            (f) => f.fieldname === `question_${question.id}`
          );
          if (!filePresent) {
            throw new Error(`File required for question ${question.id}`);
          }
        }
      }

      // Type validatons
      switch (question.type) {
        case "radio":
        case "checkbox":
        case "dropdown":
          for (const ans of answerArr) {
            if (!options.includes(ans)) {
              throw new Error(
                `Invalid option "${ans}" for question ${question.id}`
              );
            }
          }
          break;

        case "number":
          if (answerArr[0] && isNaN(answerArr[0])) {
            throw new Error(`Expected number for question ${question.id}`);
          }
          break;

        case "date":
        case "datetime":
          if (answerArr[0] && isNaN(Date.parse(answerArr[0]))) {
            throw new Error(`Invalid date for question ${question.id}`);
          }
          break;

        default:
          break;
      }
    }

    // ---------------- TRANSACTION START ----------------
    transaction = await sequelize.transaction();

    let answer = await Answer.findOne({ where: { orderId } });

    // Save Answer
    if (answer) {
      await Answer.update(
        {
          answers: validResponses,
        },
        { where: { orderId }, transaction }
      );
    } else {
      answer = await Answer.create(
        {
          orderId,
          checklistId: checklist.id,
          inspectionManagerId: req.user.id,
          answers: validResponses,
        },
        { transaction }
      );
    }

    const answerId = answer.id || answer.dataValues.id;

    // ---------------- SAVE FILES IN fileUploads TABLE ----------------
    if (req.files && req.files.length > 0) {
      const fileRecords = req.files.map((file) => {
        const questionId = file.fieldname.split("_")[1];

        return {
          fileName: file.filename,
          filePath: file.path,
          questionId: Number(questionId),
          answerId: answerId,
        };
      });

      await FileUpload.bulkCreate(fileRecords, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Checklist answers & files submitted successfully",
      answer,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    deleteFiles(req, require("fs"), require("path"));

    logger.error("submitAnswer error:", error);
    return res.status(500).json({ message: error.message });
  }
};



exports.getAnswersByOrder = async (req, res) => {
  try {
    let answer = await Answer.findOne({
      where: { orderId: req.params.orderId },
    });
    answer.answers = JSON.parse(answer.answers);
    res.json(answer);
  } catch (error) {
    logger.error("getAnswersByOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};
