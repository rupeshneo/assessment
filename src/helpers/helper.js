exports.isNumber = function(str) {
    console.log(str);
  return /^-?\d+(\.\d+)?$/.test(str);
}

exports.deleteFiles = function(req, fs, path) {
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