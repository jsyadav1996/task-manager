const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  updateProgress,
  getProjectStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Project routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/stats')
  .get(getProjectStats);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Team management routes
router.route('/:id/team')
  .post(addTeamMember);

router.route('/:id/team/:userId')
  .delete(removeTeamMember);

// Progress update route
router.route('/:id/progress')
  .put(updateProgress);

module.exports = router; 