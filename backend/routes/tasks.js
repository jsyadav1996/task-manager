const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  addComment,
  getOverdueTasks
} = require('../controllers/taskController');

const router = express.Router();

// Validation middleware
const taskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 100 })
    .withMessage('Task title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Task description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned user is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Tag cannot exceed 20 characters'),
  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated hours must be a positive number'),
  body('project')
    .notEmpty()
    .withMessage('Project is required')
    .isMongoId()
    .withMessage('Invalid project ID')
];

const commentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 300 })
    .withMessage('Comment cannot exceed 300 characters')
];

// Apply authentication to all routes
router.use(protect);

// Routes
router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/overdue')
  .get(getOverdueTasks);

router.route('/:id')
  .get(getTask)
  .put(taskValidation, updateTask)
  .delete(deleteTask);

router.route('/:id/complete')
  .put(completeTask);

router.route('/:id/comments')
  .post(commentValidation, addComment);

module.exports = router; 