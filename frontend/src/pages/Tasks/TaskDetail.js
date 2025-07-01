import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.data);
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/tasks/${id}/complete`);
      toast.success('Task marked as completed!');
      fetchTask();
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeleteLoading(true);
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted successfully!');
        navigate('/tasks');
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const onSubmitComment = async (data) => {
    setCommentLoading(true);
    try {
      await api.post(`/tasks/${id}/comments`, data);
      toast.success('Comment added successfully!');
      reset();
      fetchTask();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in-progress':
        return 'badge-info';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Task not found.</p>
        <Link to="/tasks" className="btn-primary mt-4">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/tasks" className="btn-secondary">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Tasks
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600">Task Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/tasks/${id}/edit`}
            className="btn-secondary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="btn-danger"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Task Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="mt-2 text-gray-600">{task.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <div className="mt-1">
                    <span className={`badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority</span>
                  <div className="mt-1">
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Due Date</span>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <div className="mt-1 text-sm text-gray-900">
                    {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              {task.category && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <div className="mt-1 text-sm text-gray-900">{task.category}</div>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Tags</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="badge badge-info">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Comments</h2>
            </div>
            <div className="card-body space-y-4">
              {/* Add Comment */}
              <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
                <div>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Add a comment..."
                    {...register('content', {
                      required: 'Comment content is required',
                      maxLength: {
                        value: 300,
                        message: 'Comment cannot exceed 300 characters',
                      },
                    })}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentLoading}
                    className="btn-primary"
                  >
                    {commentLoading ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {comment.user.firstName} {comment.user.lastName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </div>
            <div className="card-body space-y-3">
              {task.status !== 'completed' && (
                <button
                  onClick={handleComplete}
                  className="btn-success w-full"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Mark as Completed
                </button>
              )}
              <Link
                to={`/tasks/${id}/edit`}
                className="btn-secondary w-full"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Task
              </Link>
            </div>
          </div>

          {/* Assignment */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Assignment</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Assigned To</span>
                <div className="mt-1 flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Created By</span>
                <div className="mt-1 flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {task.createdBy.firstName} {task.createdBy.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          {(task.estimatedHours || task.actualHours) && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Time Tracking</h3>
              </div>
              <div className="card-body space-y-3">
                {task.estimatedHours && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estimated Hours</span>
                    <div className="mt-1 text-sm text-gray-900">{task.estimatedHours}h</div>
                  </div>
                )}
                {task.actualHours && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Actual Hours</span>
                    <div className="mt-1 text-sm text-gray-900">{task.actualHours}h</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 