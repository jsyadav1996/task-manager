import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import api from '../../services/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      member: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch project details');
      console.error('Error fetching project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  const handleProgressUpdate = async (newProgress) => {
    try {
      setUpdatingProgress(true);
      await api.put(`/projects/${id}/progress`, { progress: newProgress });
      setProject(prev => ({ ...prev, progress: newProgress }));
      toast.success('Progress updated successfully');
    } catch (error) {
      toast.error('Failed to update progress');
      console.error('Error updating progress:', error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const canEdit = project && (
    project.createdBy._id === user?.id ||
    project.teamMembers.some(member => 
      member.user._id === user?.id && ['owner', 'manager'].includes(member.role)
    )
  );

  const canDelete = project && project.createdBy._id === user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Link to="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created by {project.createdBy.firstName} {project.createdBy.lastName} on{' '}
            {format(new Date(project.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {canEdit && (
            <Link
              to={`/projects/${id}/edit`}
              className="btn-secondary inline-flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="btn-danger inline-flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 mb-4">{project.description}</p>
              
              {/* Status and Priority */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`badge ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                {canEdit && (
                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={project.progress}
                      onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                      disabled={updatingProgress}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-12">
                      {updatingProgress ? '...' : `${project.progress}%`}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Start Date</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(project.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">End Date</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(project.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              {project.budget > 0 && (
                <div className="flex items-center mt-4">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Budget</p>
                    <p className="text-sm text-gray-500">
                      ${project.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                {canEdit && (
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    <UserPlusIcon className="h-4 w-4 inline mr-1" />
                    Add Member
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {project.teamMembers.map((member) => (
                  <div key={member.user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      {member.user._id === project.createdBy._id && (
                        <span className="text-xs text-gray-500">Owner</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Project Stats</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">
                  {Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days Remaining</span>
                <span className="text-sm font-medium">
                  {Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Size</span>
                <span className="text-sm font-medium">{project.teamMembers.length} members</span>
              </div>
              {project.attachments && project.attachments.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Attachments</span>
                  <span className="text-sm font-medium">{project.attachments.length} files</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <Link
                to={`/projects/${id}/tasks`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                View Project Tasks
              </Link>
              <Link
                to={`/projects/${id}/tasks/create`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Create New Task
              </Link>
              <Link
                to={`/projects/${id}/edit`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Edit Project
              </Link>
              {canEdit && (
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Manage Team
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 