exports.success = (res, message, data) => {
  return response(res, 200, message, data);
};

exports.error = (res, message) => {
  return response(res, 400, message);
};

exports.notFound = (res, message) => {
  return response(res, 404, message);
};

exports.internalServerError = (res, message) => {
  return response(res, 500, message);
};

exports.validationError = (res,message) => {
  return response(res, 422, message);
};

const response = (res, status, message, data) => {
  let response = {
    status: status,
    message,
  };
  if (data) response.data = data;
  if (message) {
    response.message = message;
  } else {
    response.message = "internal server error";
    response.status = 500;
  }
  return res.status(status).json(response, message);
};
