const sendResponse = (res, statusCode, success, message, data = {}, pagination = null) => {
  const response = {
    success,
    message,
    data
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

const successResponse = (res, data = {}, message = 'Success', pagination = null) => {
  return sendResponse(res, 200, true, message, data, pagination);
};

const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', data = {}) => {
  return sendResponse(res, statusCode, false, message, data);
};

module.exports = {
  successResponse,
  errorResponse
};
