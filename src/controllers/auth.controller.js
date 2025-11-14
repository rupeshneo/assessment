const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }

    const { name, phone, email, password, role } = req.body;

    let exists = await User.findOne({ where: [{ email }] });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    exists = await User.findOne({ where: [{ phone }] });

    if (exists)
      return res.status(400).json({ message: "phone number already exists" });

    if (req.user.role === "procurement" && role === "inspection") {
      const user = await User.findOne({
        where: { role: "inspection", createdBy: req.user.id },
      });
      if (user)
        return res
          .status(403)
          .json({
            message: "Already present.Please Contact admin for the same",
          });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      createdBy: req.user.id,
      assign: req.user.id,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    logger.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

exports.assignInspectionManager = async (req, res) => {
  try {
    const { procurementManagerId, inspectionManagerId } = req.body;

    const procurementManager = await User.findOne({
      where: { id: procurementManagerId, role: "procurement" },
    });
    if (!procurementManager) {
      return res.status(404).json({ message: "Procurement Manager not found" });
    }

    const inspectionManager = await User.findOne({
      where: { id: inspectionManagerId, role: "inspection", assign: req.user.id },
    });
    if (!inspectionManager) {
      return res.status(404).json({ message: "Inspection Manager not found" });
    }

    inspectionManager.assign = procurementManagerId;
    await inspectionManager.save();

    res.json({
      message: "Inspection Manager assigned successfully",
      inspectionManager,
    });
  } catch (error) {
    logger.error("assignInspectionManager error:", error);
    res.status(500).json({ message: error.message });
  }
};
