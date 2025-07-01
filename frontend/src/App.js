import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import TaskDetail from './pages/Tasks/TaskDetail';
import CreateTask from './pages/Tasks/CreateTask';
import EditTask from './pages/Tasks/EditTask';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';
import UserDetail from './pages/Users/UserDetail';
import Projects from './pages/Projects/Projects';
import CreateProject from './pages/Projects/CreateProject';
import ProjectDetail from './pages/Projects/ProjectDetail';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Protected Route component
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:projectId/tasks" element={<Tasks />} />
          <Route path="projects/:projectId/tasks/create" element={<CreateTask />} />
          <Route path="projects/:projectId/tasks/:id" element={<TaskDetail />} />
          <Route path="projects/:projectId/tasks/:id/edit" element={<EditTask />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route path="users" element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="users/:id" element={
            <ProtectedRoute adminOnly>
              <UserDetail />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App; 