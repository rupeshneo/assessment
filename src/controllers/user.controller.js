const { User } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error(`getAllUsers error: ${error.stack}`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    logger.error(`getUserById error: ${error.stack}`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, phone, role, isActive });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    logger.error(`updateUser error: ${error.stack}`, error);
    res.status(500).json({ message: error.message });
  }
};
