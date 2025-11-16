const { Order, User } = require("../models");
const logger = require("../utils/logger");
exports.createOrder = async (req, res) => {
  try {
    const {
      title,
      description,
      clientId,
      procurementManagerId,
      inspectionManagerId,
    } = req.body;

    if (
      (await User.findOne({ where: { id: clientId, role: "client" } })) == null
    ) {
      return res.status(400).json({ message: "Invalid client ID" });
    }
    if (
      (await User.findOne({
        where: { id: procurementManagerId, role: "procurement" },
      })) == null
    ) {
      return res
        .status(400)
        .json({ message: "Invalid procurement manager ID" });
    }
    if (
      (await User.findOne({
        where: { id: inspectionManagerId, role: "inspection" },
      })) == null
    ) {
      return res.status(400).json({ message: "Invalid inspection manager ID" });
    }

    const order = await Order.create({
      title,
      description,
      clientId,
      procurementManagerId,
      inspectionManagerId,
      status: "created",
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    logger.error("createOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ["id", "title", "description", "status"], // Order table ke selected columns
      include: [
        {
          association: "client",
          attributes: ["id", "name", "email"], // Client table ke columns
        },
        {
          association: "procurementManager",
          attributes: ["id", "name"],
        },
        {
          association: "inspectionManager",
          attributes: ["id", "name"],
        },
        {
          association: "checklist",
          attributes: ["id", "name", "description"], // Checklist table columns
          include: [
            {
              association: "questions",
              attributes: ["id", "questionText", "type", "options", "required"], // jo columns chahiye wo likho
              as: "questions"
            },
          ],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    logger.error("getAllOrders error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        "client",
        "procurementManager",
        "inspectionManager",
        "checklist",
      ],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    logger.error("getOrderById error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.update({ status });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    logger.error("updateOrderStatus error:", error);
    res.status(500).json({ message: error.message });
  }
};
