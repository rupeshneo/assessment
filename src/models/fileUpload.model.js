"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FileUpload extends Model {
    static associate(models) {
      FileUpload.belongsTo(models.Answer, {
        foreignKey: "answerId",
        as: "answer",
      });
    }
  }

  FileUpload.init(
    {
      fileName: { type: DataTypes.STRING },
      filePath: {
        type: DataTypes.STRING,
      },
      fileUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${process.env.BASE_URL}/${this.getDataValue("filePath")}`;
        },
      },
      answerId: { type: DataTypes.INTEGER },
      questionId: { type: DataTypes.INTEGER },
    },
    { sequelize, tableName: "fileUploads", modelName: "FileUpload" }
  );

  return FileUpload;
};
