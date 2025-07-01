const Project = require('../models/Project');
const User = require('../models/User');
const { catchAsync } = require('../utils/catchAsync');

// @desc    Get all projects for the authenticated user
// @route   GET /api/projects
// @access  Private
const getProjects = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;
  
  // Build filter object
  const filter = {
    $or: [
      { createdBy: req.user.id },
      { 'teamMembers.user': req.user.id }
    ]
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: [
      { path: 'createdBy', select: 'firstName lastName email avatar' },
      { path: 'teamMembers.user', select: 'firstName lastName email avatar' }
    ],
    sort: { createdAt: -1 }
  };

  const projects = await Project.paginate(filter, options);

  res.status(200).json({
    success: true,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'firstName lastName email avatar')
    .populate('teamMembers.user', 'firstName lastName email avatar')
    .populate('updatedBy', 'firstName lastName email');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has access to this project
  const hasAccess = project.createdBy._id.toString() === req.user.id ||
    project.teamMembers.some(member => member.user._id.toString() === req.user.id);

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = catchAsync(async (req, res) => {
  const projectData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  // Add creator as team member with owner role
  if (!projectData.teamMembers) {
    projectData.teamMembers = [];
  }
  
  const creatorMember = {
    user: req.user.id,
    role: 'owner',
    assignedAt: new Date()
  };
  
  projectData.teamMembers.push(creatorMember);

  const project = await Project.create(projectData);
  
  await project.populate([
    { path: 'createdBy', select: 'firstName lastName email avatar' },
    { path: 'teamMembers.user', select: 'firstName lastName email avatar' }
  ]);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to update
  const isOwner = project.createdBy.toString() === req.user.id;
  const isManager = project.teamMembers.some(member => 
    member.user.toString() === req.user.id && member.role === 'manager'
  );

  if (!isOwner && !isManager) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    { new: true, runValidators: true }
  ).populate([
    { path: 'createdBy', select: 'firstName lastName email avatar' },
    { path: 'teamMembers.user', select: 'firstName lastName email avatar' }
  ]);

  res.status(200).json({
    success: true,
    data: updatedProject
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Only project owner can delete
  if (project.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await project.remove();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});

// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private
const addTeamMember = catchAsync(async (req, res) => {
  const { userId, role = 'member' } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to add team members
  const isOwner = project.createdBy.toString() === req.user.id;
  const isManager = project.teamMembers.some(member => 
    member.user.toString() === req.user.id && member.role === 'manager'
  );

  if (!isOwner && !isManager) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if user is already a team member
  const existingMember = project.teamMembers.find(member => 
    member.user.toString() === userId
  );

  if (existingMember) {
    return res.status(400).json({
      success: false,
      message: 'User is already a team member'
    });
  }

  await project.addTeamMember(userId, role);

  await project.populate([
    { path: 'createdBy', select: 'firstName lastName email avatar' },
    { path: 'teamMembers.user', select: 'firstName lastName email avatar' }
  ]);

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
const removeTeamMember = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to remove team members
  const isOwner = project.createdBy.toString() === req.user.id;
  const isManager = project.teamMembers.some(member => 
    member.user.toString() === req.user.id && member.role === 'manager'
  );

  if (!isOwner && !isManager) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Cannot remove project owner
  if (project.createdBy.toString() === req.params.userId) {
    return res.status(400).json({
      success: false,
      message: 'Cannot remove project owner'
    });
  }

  await project.removeTeamMember(req.params.userId);

  await project.populate([
    { path: 'createdBy', select: 'firstName lastName email avatar' },
    { path: 'teamMembers.user', select: 'firstName lastName email avatar' }
  ]);

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
// @access  Private
const updateProgress = catchAsync(async (req, res) => {
  const { progress } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Check if user has permission to update progress
  const hasAccess = project.createdBy.toString() === req.user.id ||
    project.teamMembers.some(member => 
      member.user.toString() === req.user.id && 
      ['owner', 'manager', 'member'].includes(member.role)
    );

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  await project.updateProgress(progress);

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = catchAsync(async (req, res) => {
  const stats = await Project.getStats(req.user.id);

  // Get total projects count
  const totalProjects = await Project.countDocuments({
    $or: [
      { createdBy: req.user.id },
      { 'teamMembers.user': req.user.id }
    ]
  });

  // Get recent projects
  const recentProjects = await Project.find({
    $or: [
      { createdBy: req.user.id },
      { 'teamMembers.user': req.user.id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('createdBy', 'firstName lastName email avatar');

  res.status(200).json({
    success: true,
    data: {
      stats,
      totalProjects,
      recentProjects
    }
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  updateProgress,
  getProjectStats
}; 