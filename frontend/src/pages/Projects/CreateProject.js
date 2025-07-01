import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Convert dates to ISO strings
      const projectData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        budget: parseFloat(data.budget) || 0,
        progress: parseInt(data.progress) || 0,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      const response = await api.post('/projects', projectData);
      
      toast.success('Project created successfully!');
      navigate(`/projects/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up a new project with all the details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="card-body space-y-4">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className="input mt-1"
                  placeholder="Enter project name"
                  {...register('name', {
                    required: 'Project name is required',
                    minLength: {
                      value: 3,
                      message: 'Project name must be at least 3 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Project name cannot exceed 100 characters'
                    }
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="input mt-1"
                  placeholder="Describe your project"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters'
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Description cannot exceed 1000 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  className="input mt-1"
                  placeholder="Enter tags separated by commas"
                  {...register('tags')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate tags with commas (e.g., web, design, development)
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
            </div>
            <div className="card-body space-y-4">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  className="input mt-1"
                  {...register('status', {
                    required: 'Status is required'
                  })}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority *
                </label>
                <select
                  id="priority"
                  className="input mt-1"
                  {...register('priority', {
                    required: 'Priority is required'
                  })}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="input mt-1"
                  {...register('startDate', {
                    required: 'Start date is required'
                  })}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="input mt-1"
                  min={startDate}
                  {...register('endDate', {
                    required: 'End date is required',
                    validate: (value) => {
                      if (startDate && value <= startDate) {
                        return 'End date must be after start date';
                      }
                      return true;
                    }
                  })}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="budget"
                    type="number"
                    step="0.01"
                    min="0"
                    className="input pl-7"
                    placeholder="0.00"
                    {...register('budget', {
                      min: {
                        value: 0,
                        message: 'Budget cannot be negative'
                      }
                    })}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                )}
              </div>

              {/* Initial Progress */}
              <div>
                <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                  Initial Progress (%)
                </label>
                <input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  className="input mt-1"
                  placeholder="0"
                  {...register('progress', {
                    min: {
                      value: 0,
                      message: 'Progress cannot be negative'
                    },
                    max: {
                      value: 100,
                      message: 'Progress cannot exceed 100%'
                    }
                  })}
                />
                {errors.progress && (
                  <p className="mt-1 text-sm text-red-600">{errors.progress.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject; 