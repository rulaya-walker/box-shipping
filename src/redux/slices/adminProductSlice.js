import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTokenInstance } from "../../axios/axiosInstance";


export const fetchAdminProducts = createAsyncThunk(
  "adminProduct/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.get("/api/admin/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "adminProduct/uploadImage",
  async (imageData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData);
      
      const response = await axiosTokenInstance.post("/api/admin/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProduct/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      console.log('Creating product with FormData');
      
      // Set appropriate headers for FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axiosTokenInstance.post("/api/admin/products", productData, config);
      return response.data.product;
    } catch (error) {
      console.error('Create product error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProduct/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      console.log('Updating product with FormData');
      
      // Set appropriate headers for FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await axiosTokenInstance.put(`/api/admin/products/${id}`, productData, config);
      return response.data.product;
    } catch (error) {
      console.error('Update product error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProduct/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.delete(`/api/admin/products/${id}`);
      return id; // Return the product ID for deletion
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    adminProducts: [],
    loading: false,
    error: null,
    uploadingImage: false,
    uploadedImageUrl: null,
  },
  reducers: {
    clearUploadedImage: (state) => {
      state.uploadedImageUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object responses from API
        if (Array.isArray(action.payload)) {
          state.adminProducts = action.payload;
        } else if (action.payload?.products && Array.isArray(action.payload.products)) {
          state.adminProducts = action.payload.products;
        } else {
          state.adminProducts = [];
        }
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure adminProducts is an array before pushing
        if (!Array.isArray(state.adminProducts)) {
          state.adminProducts = [];
        }
        state.adminProducts.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure adminProducts is an array before finding index
        if (!Array.isArray(state.adminProducts)) {
          state.adminProducts = [];
        }
        const index = state.adminProducts.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.adminProducts[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure adminProducts is an array before filtering
        if (!Array.isArray(state.adminProducts)) {
          state.adminProducts = [];
        }
        state.adminProducts = state.adminProducts.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadingImage = false;
        state.uploadedImageUrl = action.payload.url;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload;
      });
  }
});

export const { clearUploadedImage } = adminProductSlice.actions;
export default adminProductSlice.reducer;