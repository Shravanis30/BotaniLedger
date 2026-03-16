const { errorResponse } = require('../utils/response.util');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return errorResponse(res, 400, 'Validation Error', { errors: err.errors });
  }
};

module.exports = { validate };
