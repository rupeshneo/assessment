"use strict";

module.exports = (sequelize, DataTypes) => {
  const FileUpload = sequelize.define(
    "FileUpload",
    {
      fileName: {
        type: DataTypes.STRING,
      },

      filePath: {
        type: DataTypes.STRING,
      },

      fileUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${process.env.BASE_URL}/${this.getDataValue("filePath")}`;
        },
      },

      answerId: {
        type: DataTypes.INTEGER,
      },

      questionId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "fileUploads",
      paranoid: true,
    }
  );

  // Associations
  FileUpload.associate = (models) => {
    FileUpload.belongsTo(models.Answer, {
      foreignKey: "answerId",
      as: "answer",
    });
  };

  return FileUpload;
};
