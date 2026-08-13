import { validationResult } from 'express-validator';

/**
 * Middleware to check validation results from express-validator chains.
 * If errors are present, returns a 400 Bad Request response formatted cleanly.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};
