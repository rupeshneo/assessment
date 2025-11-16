const { register, login } = require("../services/auth.service");

exports.register = async (req, res) => {
  return register(req, res);
};

exports.login = async (req, res) => {
  return login(req, res);
};

exports.assignInspectionManager = async (req, res) => {
  return assignInspectionManager(req, res);
};