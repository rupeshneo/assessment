const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

exports.isNumber = function(str) {
    console.log(str);
  return /^-?\d+(\.\d+)?$/.test(str);
}

exports.deleteFiles = function(req) {
    if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      const filePath = path.join(__dirname, "../../", "uploads", file.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // delete file
          console.log("Deleted:", filePath);
        }
      } catch (unlinkErr) {
        console.error("Failed to delete file:", unlinkErr);
      }
    });
  }
}

exports.deleteFilesByPaths = function(filePaths) {
    filePaths.forEach(filePath => {
      const fullPath = path.join(__dirname, "../../", filePath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath); // delete file
          console.log("Deleted:", fullPath);
        }
      } catch (unlinkErr) {
        console.error("Failed to delete file:", unlinkErr);
      }
    });
}

exports.sendMail = async function () {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false
  });

  // 2. Email options
  const mailOptions = {
    from: '"My App" <yourEmail@yopmail.com>',
    to: "receiver@yopmail.com",
    subject: "Test Email from Node.js",
    text: "Hello, this is a plain text email!",
    html: "<h2>Hello!</h2><p>This is a test email from <b>Node.js</b></p>"
  };

  // 3. Send email
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", result.messageId);
  } catch (error) {
    console.error("Error:", error);
  }
}