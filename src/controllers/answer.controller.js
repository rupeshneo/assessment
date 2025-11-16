const { submitAnswer, getAnswersByOrder } = require("../services/answer.services");

exports.submitAnswer = async (req, res) => {
  return submitAnswer(req, res);
};

exports.getAnswersByOrder = async (req, res) => {
  return getAnswersByOrder(req, res);
};
