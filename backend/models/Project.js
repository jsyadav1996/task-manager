const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Project description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    type: Number,
    min: 0,
    default: 0
  },
  teamMembers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'member', 'viewer'],
      default: 'member'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ status: 1, createdBy: 1 });
projectSchema.index({ teamMembers: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  if (this.endDate) {
    const today = new Date();
    const remaining = Math.ceil((this.endDate - today) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return 0;
});

// Virtual for project status color
projectSchema.virtual('statusColor').get(function() {
  const statusColors = {
    planning: 'blue',
    active: 'green',
    'on-hold': 'yellow',
    completed: 'gray',
    cancelled: 'red'
  };
  return statusColors[this.status] || 'gray';
});

// Pre-save middleware to validate dates
projectSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'member') {
  const existingMember = this.teamMembers.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    existingMember.role = role;
  } else {
    this.teamMembers.push({ user: userId, role });
  }
  
  return this.save();
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.teamMembers = this.teamMembers.filter(member => 
    member.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to update progress
projectSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  return this.save();
};

// Static method to get projects by user
projectSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { 'teamMembers.user': userId }
    ]
  }).populate('createdBy', 'firstName lastName email')
    .populate('teamMembers.user', 'firstName lastName email avatar')
    .sort({ createdAt: -1 });
};

// Static method to get project statistics
projectSchema.statics.getStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { createdBy: mongoose.Types.ObjectId(userId) },
          { 'teamMembers.user': mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Add pagination plugin
projectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Project', projectSchema); 