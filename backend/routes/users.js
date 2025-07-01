const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAssignableUsers,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const userValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role value'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Apply authentication to all routes
router.use(protect);

// Routes accessible to all authenticated users
router.get('/assignable', getAssignableUsers);

// Routes requiring admin access
router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), userValidation, updateUser)
  .delete(authorize('admin'), deleteUser);

router.route('/:id/stats')
  .get(authorize('admin'), getUserStats);

module.exports = router; 