import { body, param, query } from 'express-validator';

export const createTodoValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .trim(),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO 8601 date string'),
];

export const updateTodoValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .trim(),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO 8601 date string'),
];

export const idParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required'),
];

export const getTodosQueryValidator = [
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('Query completed must be true or false'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Query priority must be low, medium, or high'),
  query('category')
    .optional()
    .trim(),
  query('search')
    .optional()
    .trim(),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'dueDate', 'priority', 'title'])
    .withMessage('sortBy must be one of: createdAt, dueDate, priority, title'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be asc or desc'),
];

