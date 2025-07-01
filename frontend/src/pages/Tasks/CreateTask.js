import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const { projectId } = useParams();
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchUsers();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      setProject(response.data.data);
    } catch (error) {
      toast.error('Failed to load project details');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/assignable');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const taskData = {
        ...data,
        project: projectId
      };
      
      await api.post('/tasks', taskData);
      toast.success('Task created successfully!');
      navigate(`/projects/${projectId}/tasks`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {project ? `Create Task for ${project.name}` : 'Create New Task'}
        </h1>
        <p className="text-gray-600">
          {project ? `Add a new task to ${project.name}` : 'Add a new task to your project'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Task Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                className="input mt-1"
                placeholder="Enter task title"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters',
                  },
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                className="input mt-1"
                placeholder="Enter task description"
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description cannot exceed 500 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="input mt-1"
                  {...register('status')}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  className="input mt-1"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  className="input mt-1"
                  {...register('dueDate', {
                    required: 'Due date is required',
                  })}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned To *
                </label>
                <select
                  className="input mt-1"
                  {...register('assignedTo', {
                    required: 'Please assign the task to someone',
                  })}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                className="input mt-1"
                placeholder="Enter category"
                {...register('category', {
                  maxLength: {
                    value: 50,
                    message: 'Category cannot exceed 50 characters',
                  },
                })}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="input mt-1"
                placeholder="Enter estimated hours"
                {...register('estimatedHours', {
                  min: {
                    value: 0,
                    message: 'Estimated hours cannot be negative',
                  },
                })}
              />
              {errors.estimatedHours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask; 