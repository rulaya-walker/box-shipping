import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosInstance,axiosTokenInstance} from '../../axios/axiosInstance';
// Async thunk for fetching products by collection and optional filsters
export const fetchProductsByCollection = createAsyncThunk(
  'products/fetchByFilters',
  async ({collection, size,color,gender,minPrice,maxPrice,sortBy,search,category,material,brand,limit}, {rejectWithValue}) => {
    const query = new URLSearchParams();
    if (collection) query.append('collection', collection);
    if (size) query.append('size', size);
    if (color) query.append('color', color);
    if (gender) query.append('gender', gender);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (sortBy) query.append('sortBy', sortBy);
    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (material) query.append('material', material);
    if (brand) query.append('brand', brand);
    if (limit) query.append('limit', limit);

    try {
      const response = await axiosInstance.get(`/api/products?${query.toString()}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch products');
      }

      return response.data.products;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      if (!error.response) {
        return rejectWithValue('Network error. Please check your connection and try again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred while fetching products');
    }
  }
);

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`/api/products/${productId}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch product details');
      }
      console.log(response.data, productId);
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      if (!error.response) {
        return rejectWithValue('Network error. Please check your connection and try again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred while fetching product details');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({productId, productData}, {rejectWithValue}) => {
    try {
      const response = await axiosTokenInstance.put(`/api/admin/products/${productId}`, productData);

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//Similar Products 
export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilar',
  async ({productId}, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(`/api/products/similar/${productId}`);
      
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      collection: "",
      size: "",
      color: "",
      gender: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      category: "",
      material: "",
      brand: "",
      limit: "",
  },
},
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filters = {
        collection: "",
        size: "",
        color: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        category: "",
        material: "",
        brand: "",
        limit: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched product:", action.payload);
        state.product = action.payload;

      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
          if (state.product && state.product._id === action.payload._id) {
            state.product = action.payload; // Update the current product if it matches
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;