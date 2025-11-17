const fs = require("fs");
const path = require("path");

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