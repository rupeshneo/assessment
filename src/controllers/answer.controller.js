const { isNumber } = require("../helpers/helper");
const { Answer, Checklist, ChecklistQuestion, Order } = require("../models");
const logger = require("../utils/logger");

exports.submitAnswer = async (req, res) => {
  let t;
  try {
    const { orderId, responses, ...files } = req.body;
    console.log(files);
    const order = await Order.findOne({ where: { id: orderId } });
    const checklist = await Checklist.findOne({
      where: { orderId: orderId },
      include: [
        {
          model: ChecklistQuestion,
          as: "questions",
        },
      ],
    });
    let answer = await Answer.findOne({ where: { orderId: orderId } });

    if (order === null) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    const questions = checklist.questions;

    for (const question of questions) {
      const response = responses.find(
        (resp) => resp.questionId === question.id
      );

      if (question.required && !response?.answers) {
        throw new Error(`Answer required for question ID ${question.id}`);
      } else {
        continue;
      }
    }

    for (const response of responses) {
      const question = questions.find((q) => q.id === response.questionId);      
      let options = JSON.parse(question?.options);
      options = options.length ? options.map(opt => opt.trim()) : []
      const answers = response.answers.split(",");      
      if (!question) {
        throw new Error(
          `Question ID ${response.questionId} not found in checklist.`
        );
      }
      switch (question.type) {
        case "radio":
        case "dropdown":
        case "checkbox":
          for (const ans of answers) {
            if (!options.includes(ans.trim())) {
              throw new Error(
                `Invalid answer option for question ID ${question.id}`
              );
            }
          }
          break;
        case "number":
          if (!isNumber(answers[0])) {
            throw new Error(
              `Invalid answer type for question ID ${question.id}: expected number.`
            );
          }
          break;
        case "file":
          // File validation can be added here if needed
          break;
        case "date":
          if (answers[0] && isNaN(Date.parse(answers[0]))) {
            throw new Error(
              `Invalid answers[0]wer type for question ID ${question.id}: expected date string.`
            );
          }
          break;
        case "datetime":
          if (answers[0] && isNaN(Date.parse(answers[0]))) {
            throw new Error(
              `Invalid answer type for question ID ${question.id}: expected datetime string.`
            );
          }
          break;
        default:
          //
          break;
      }
    }

    if (answer !== null) {
      await Answer.update(
        {
          answers: responses,
          files,
        },
        {
          where: { orderId: orderId },
          returning: true,
          plain: true,
        }
      );
    } else {
      answer = await Answer.create({
        orderId,
        checklistId: checklist.id,
        inspectionManagerId: req.user.id,
        answers: responses,
        files,
      });
    }

    t = await Answer.sequelize.transaction();
    answer.answers = responses;
    await t.commit();
    res.status(201).json({ message: "Checklist answer submitted", answer });
  } catch (error) {
    if (t) await t.rollback();
    logger.error("submitAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAnswersByOrder = async (req, res) => {
  try {
    let answer = await Answer.findOne({
      where: { orderId: req.params.orderId },
    });
    answer.answers = JSON.parse(answer.answers)
    res.json(answer);
  } catch (error) {
    logger.error("getAnswersByOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};
