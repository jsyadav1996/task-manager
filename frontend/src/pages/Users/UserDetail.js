import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}/stats`);
      setUserData(response.data.data);
    } catch (error) {
      toast.error('Failed to load user data');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-danger';
      case 'user':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'badge-success' : 'badge-danger';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found.</p>
        <Link to="/users" className="btn-primary mt-4">
          Back to Users
        </Link>
      </div>
    );
  }

  const { user, stats, recentTasks } = userData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/users" className="btn-secondary">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Users
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">User Details & Statistics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">User Information</h2>
            </div>
            <div className="card-body">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Full Name</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Username</span>
                      <div className="mt-1 text-sm text-gray-900">@{user.username}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <div className="mt-1 text-sm text-gray-900">{user.email}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Role</span>
                      <div className="mt-1">
                        <span className={`badge ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Account Status</span>
                      <div className="mt-1">
                        <span className={`badge ${getStatusColor(user.isActive)}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Member Since</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  {user.lastLogin && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Login</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Task Statistics */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Task Statistics</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-lg">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</div>
                    <div className="text-sm text-gray-500">Total Tasks</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-semibold text-gray-900">{stats.pendingTasks}</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-semibold text-gray-900">{stats.overdueTasks}</div>
                    <div className="text-sm text-gray-500">Overdue</div>
                  </div>
                </div>
              </div>
              
              {stats.totalTasks > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Completion Rate</span>
                    <span className="text-gray-900 font-medium">{stats.completionRate}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          {recentTasks && recentTasks.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          <Link to={`/tasks/${task._id}`} className="hover:text-primary-600">
                            {task.title}
                          </Link>
                        </h4>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`badge ${
                            task.status === 'completed' ? 'badge-success' :
                            task.status === 'in-progress' ? 'badge-info' :
                            task.status === 'pending' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {task.status}
                          </span>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <Link
                to="/tasks/create"
                className="btn-primary w-full"
              >
                Assign New Task
              </Link>
              <Link
                to="/tasks"
                className="btn-secondary w-full"
              >
                View All Tasks
              </Link>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Additional Statistics</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">In Progress Tasks</span>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.inProgressTasks}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Overdue Tasks</span>
                <div className="mt-1 text-2xl font-semibold text-red-600">{stats.overdueTasks}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Completion Rate</span>
                <div className="mt-1 text-2xl font-semibold text-green-600">{stats.completionRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 