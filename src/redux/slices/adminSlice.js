// Thunk to fetch dashboard data
export const fetchDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.get("/api/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTokenInstance } from "../../axios/axiosInstance";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.get("/api/admin/users");
      return response.data;
    } catch (error) {
      // If API fails, return mock data for development
      console.warn('API failed, using mock data:', error.message);
      
      // Return mock data structure that matches expected backend response
      return {
        users: [
          {
            _id: "1",
            name: 'Sarah Mitchell',
            email: 'sarah.mitchell@boxshipping.com',
            role: 'admin',
            status: 'active',
            phone: '+1-555-0101',
            address: '1247 Executive Blvd, Suite 500, San Francisco, CA 94105',
            joinDate: '2022-01-15',
            lastLogin: '2024-01-11'
          },
          {
            _id: "2",
            name: 'Michael Chen',
            email: 'm.chen@boxshipping.com',
            role: 'admin',
            status: 'active',
            phone: '+1-555-0102',
            address: '891 Innovation Drive, Austin, TX 78701',
            joinDate: '2022-03-08',
            lastLogin: '2024-01-11'
          },
          {
            _id: "3",
            name: 'David Thompson',
            email: 'david.thompson@boxshipping.com',
            role: 'moderator',
            status: 'active',
            phone: '+1-555-0201',
            address: '567 Business Park Way, Seattle, WA 98101',
            joinDate: '2022-08-12',
            lastLogin: '2024-01-09'
          },
          {
            _id: "4",
            name: 'Robert Johnson',
            email: 'robert.johnson@email.com',
            role: 'customer',
            status: 'active',
            phone: '+1-555-1001',
            address: '1423 Maple Street, Springfield, IL 62701',
            joinDate: '2023-01-10',
            lastLogin: '2024-01-11'
          },
          {
            _id: "5",
            name: 'Amanda Williams',
            email: 'amanda.williams@gmail.com',
            role: 'customer',
            status: 'active',
            phone: '+1-555-1002',
            address: '789 Oak Avenue, Nashville, TN 37201',
            joinDate: '2023-02-15',
            lastLogin: '2024-01-10'
          },
          {
            _id: "6",
            name: 'Michelle Lee',
            email: 'michelle.lee@gmail.com',
            role: 'customer',
            status: 'inactive',
            phone: '+1-555-1010',
            address: '654 Valley Stream Way, Sacramento, CA 95814',
            joinDate: '2023-10-03',
            lastLogin: '2023-11-15'
          }
        ]
      };
    }
  }
);  

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post("/api/admin/users", userData);
      return response.data;
    } catch (error) {
      // Mock response for development
      console.warn('API failed, using mock response for addUser:', error.message);
      return {
        user: {
          _id: Date.now().toString(),
          ...userData,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: null
        }
      };
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      // Mock response for development
      console.warn('API failed, using mock response for updateUser:', error.message);
      return {
        _id: userId,
        ...userData
      };
    }
  }
);


export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.delete(`/api/admin/users/${userId}`);
      return userId; // Return userId to remove from state
    } catch (error) {
      // Mock response for development - still return userId to remove from state
      console.warn('API failed, using mock response for deleteUser:', error.message);
      return userId;
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "admin/toggleUserStatus",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const response = await axiosTokenInstance.patch(`/api/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      // Mock response for development
      console.warn('API failed, using mock response for toggleUserStatus:', error.message);
      
      // Find current user in state to toggle status
      const currentUser = getState().admin.users.find(user => user._id === userId);
      if (currentUser) {
        return {
          ...currentUser,
          status: currentUser.status === 'active' ? 'inactive' : 'active'
        };
      }
      return rejectWithValue('User not found');
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
    dashboard: {
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      totalProducts: 0,
      latestOrders: [],
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both API response format and mock data format
        state.users = action.payload.users || action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch users";
        console.error('fetchUsers rejected:', action);
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        // Find the index of the user to update
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          // Update the user in the array
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the user from the array
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user";
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        // Find the index of the user to update
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          // Update the user status in the array
          state.users[index] = updatedUser;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to toggle user status";
      })
      // Dashboard API
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = {
          totalOrders: action.payload.totalOrders || 0,
          totalUsers: action.payload.totalUsers || 0,
          totalRevenue: action.payload.totalRevenue || 0,
          totalProducts: action.payload.totalProducts || 0,
          latestOrders: action.payload.latestOrders || [],
        };
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export default adminSlice.reducer;