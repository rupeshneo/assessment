require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swagger.config");
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
const { sendMail } = require("./helpers/helper");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

if (process.env.NODE_ENV === 'development') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  console.log(path.join(__dirname, 'access.log'));
    
  app.use(morgan('combined', { stream: accessLogStream }));
}

app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/test',require("./routes/test.routes"))
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/checklists", require("./routes/checklist.routes"));
app.use("/api/checklist-questions", require("./routes/checklistQuestion.routes"));
app.use("/api/answers", require("./routes/answer.routes"));

app.post('/mail', function (req,res) {
  sendMail();
  return res.json({
    done: true
  })
})
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
  console.log(`Server running on port ${PORT}`);
});
