import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login user
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { data } = response.data;
          
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      // Register user
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          const { data } = response.data;
          
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Remove token from API headers
        delete api.defaults.headers.common['Authorization'];
      },

      // Get current user profile
      getProfile: async () => {
        try {
          const response = await api.get('/auth/me');
          const { data } = response.data;
          
          set({
            user: data,
            isAuthenticated: true,
          });
          
          return { success: true };
        } catch (error) {
          get().logout();
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to get profile' 
          };
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/auth/profile', profileData);
          const { data } = response.data;
          
          set({
            user: data,
          });
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to update profile' 
          };
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        try {
          await api.put('/auth/change-password', {
            currentPassword,
            newPassword,
          });
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to change password' 
          };
        }
      },

      // Initialize auth state
      initialize: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          get().getProfile();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore; 