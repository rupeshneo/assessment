require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swagger.config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/checklists", require("./routes/checklist.routes"));
app.use("/api/questions", require("./routes/checklistQuestion.routes"));
app.use("/api/answers", require("./routes/answer.routes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
  console.log(`🚀 Server running on port ${PORT}`);
});
