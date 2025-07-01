import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTaskAndUsers();
  }, [id]);

  const fetchTaskAndUsers = async () => {
    try {
      setLoading(true);
      const [taskResponse, usersResponse] = await Promise.all([
        api.get(`/tasks/${id}`),
        api.get('/users/assignable')
      ]);
      
      setTask(taskResponse.data.data);
      setUsers(usersResponse.data.data);
      
      // Pre-fill form with task data
      const taskData = taskResponse.data.data;
      setValue('title', taskData.title);
      setValue('description', taskData.description);
      setValue('status', taskData.status);
      setValue('priority', taskData.priority);
      setValue('dueDate', formatDateForInput(taskData.dueDate));
      setValue('assignedTo', taskData.assignedTo._id);
      setValue('category', taskData.category || '');
      setValue('estimatedHours', taskData.estimatedHours || '');
    } catch (error) {
      toast.error('Failed to load task data');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.put(`/tasks/${id}`, data);
      toast.success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
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
        <button
          onClick={() => navigate('/tasks')}
          className="btn-primary mt-4"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/tasks/${id}`)}
            className="btn-secondary"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Task
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
            <p className="text-gray-600">Update task information</p>
          </div>
        </div>
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
            onClick={() => navigate(`/tasks/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask; 