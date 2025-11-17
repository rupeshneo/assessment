const { Order } = require("../models");

exports.updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) return { error: "Order not found" };
    await order.update({ status: status });
    return { message: "Order status updated", order };
  } catch (error) {
    logger.error("updateOrderStatus error:", error.stack);
    return { error: error.message };
  }
};
