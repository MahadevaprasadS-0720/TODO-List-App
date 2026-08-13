import express from 'express';
import {
  createTodo,
  getTodos,
  getTodoStats,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from '../controllers/todoController.js';
import {
  createTodoValidator,
  updateTodoValidator,
  idParamValidator,
  getTodosQueryValidator,
} from '../validators/todoValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Root /api/todos routes
router
  .route('/')
  .post(createTodoValidator, validate, createTodo)
  .get(getTodosQueryValidator, validate, getTodos);

// Analytics statistics route (Must be defined before /:id)
router
  .route('/stats')
  .get(getTodoStats);

// Toggle complete status route
router
  .route('/:id/toggle')
  .patch(idParamValidator, validate, toggleTodoComplete);

// Single todo by ID routes
router
  .route('/:id')
  .get(idParamValidator, validate, getTodoById)
  .put(updateTodoValidator, validate, updateTodo)
  .delete(idParamValidator, validate, deleteTodo);

export default router;
