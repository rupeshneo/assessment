const { validationResult } = require("express-validator");
const { deleteFiles, deleteFilesByPaths } = require("../helpers/helper");
const {
  Answer,
  Checklist,
  ChecklistQuestion,
  FileUpload,
  Order,
  sequelize,
} = require("../models");
const logger = require("../utils/logger");
const { validationError } = require("../utils/response");

exports.submitAnswer = async (req, res) => {
  let transaction;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array()[0].msg)
    }

    const { orderId, responses } = req.body;
    const parsedResponses = JSON.parse(responses || "[]");
    const order = await Order.findOne({ where: { id: orderId } });
    const checklist = await Checklist.findOne({
      where: { orderId },
      include: [{ model: ChecklistQuestion, as: "questions" }],
    });
    const questionIds = checklist.questions.map((q) => q.id);
    const validResponses = parsedResponses.filter((r) =>
      questionIds.includes(r.questionId)
    );
    let answer = await Answer.findOne({ where: { orderId } });
    let answerExist = 0;
    if (answer) answerExist = 1;
    let fileUploads = [];
    if (answer) {
      fileUploads = await FileUpload.findAll({
        where: { answerId: answer.id },
      });
    }
    if (!order) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    if (!checklist || !checklist.questions?.length) {
      return res.status(400).json({ message: "Checklist not found" });
    }

    validaton(checklist, validResponses, fileUploads, req);

    // TRANSACTION START
    transaction = await sequelize.transaction();

    // Save Answer
    answer = await saveAnswer(
      answer,
      validResponses,
      transaction,
      checklist,
      req,
      orderId
    );

    // SAVE FILES IN fileUploads TABLE
    await saveFiles(answer.id, req, transaction, fileUploads, checklist);

    // UPDATE ORDER STATUS TO in_progress
    await order.update({ status: "inspection_pending" }, { transaction });

    if (answerExist) {
      answer.answers = JSON.parse(answer.answers);
    }

    // COMMIT TRANSACTION
    await transaction.commit();

    return res.status(201).json({
      message: "Checklist answers & files submitted successfully",
      answer,
      files: await FileUpload.findAll({ where: { answerId: answer.id } }),
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    deleteFiles(req);
    logger.error(`submitAnswer error: ${error.stack}`, error);
    return res.status(500).json({ message: error.message, error: error.stack });
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
    logger.error(`getAnswersByOrder error: ${error.stack}`, error);
    res.status(500).json({ message: error.message });
  }
};

const validaton = (checklist, validResponses, fileUploads, req) => {
  // VALIDATION LOOP
  for (const question of checklist.questions) {
    const userResponse = validResponses.find(
      (resp) => resp.questionId === question.id
    );

    const options = question.options
      ? question.options.map((o) => o.trim())
      : [];
    const answerArr = userResponse?.answers
      ? userResponse.answers.split(",").map((a) => a.trim())
      : [];

    // Required validations
    if (question.required) {
      if (!userResponse?.answers && question.type !== "file") {
        throw new Error(`Answer required for question ${question.id}`);
      }

      if (question.type === "file") {
        if (!fileUploads.find((f) => f.questionId === question.id)) {
          const filePresent = req.files?.some(
            (f) => f.fieldname === `question_${question.id}`
          );
          if (!filePresent) {
            throw new Error(`File required for question ${question.id}`);
          }
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
};

const saveAnswer = async (
  answer,
  validResponses,
  transaction,
  checklist,
  req,
  orderId
) => {
  if (answer) {
    await Answer.update(
      {
        answers: validResponses,
      },
      { where: { orderId }, transaction }
    );
    answer = await Answer.findOne({
      where: { id: answer.id },
      transaction,
    });
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
  return answer;
};

const saveFiles = async (
  answerId,
  req,
  transaction,
  fileUploads,
  checklist
) => {
  if (req.files && req.files.length > 0) {
    let filesToUpload = [];
    let filesToUpdate = [];
    let deletFilePaths = [];
    req.files.forEach((file) => {
      const questionId = file.fieldname.split("_")[1];

      const fileExists = fileUploads.find(
        (f) => questionId == Number(questionId) && answerId == Number(answerId)
      );

      if (fileExists) {
        deletFilePaths.push(fileExists.filePath);
        filesToUpdate.push({
          id: fileExists.id,
          filePath: file.path,
        });
        return;
      }
      if (
        checklist.questions.find(
          (q) => q.id === Number(questionId) && q.type === "file"
        )
      ) {
        filesToUpload.push({
          fileName: file.filename,
          filePath: file.path,
          questionId: Number(questionId),
          answerId: answerId,
        });
      }
    });

    await FileUpload.bulkCreate(filesToUpload, { transaction });
    for (const fileData of filesToUpdate) {
      await FileUpload.update(
        { filePath: fileData.filePath },
        { where: { id: fileData.id }, transaction }
      );
    }
    deleteFilesByPaths(deletFilePaths);
  }
};
