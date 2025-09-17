import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, axiosTokenInstance } from '../../axios/axiosInstance';

// Get all categories
export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
	try {
		const res = await axiosInstance.get('/api/categories');
		return res.data.categories;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
	}
});

// Create category
export const createCategory = createAsyncThunk('categories/create', async (formData, thunkAPI) => {
	try {
		const res = await axiosTokenInstance.post('/api/categories', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return res.data.category;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
	}
});

// Update category
export const updateCategory = createAsyncThunk('categories/update', async ({ id, formData }, thunkAPI) => {
	try {
		const res = await axiosTokenInstance.put(`/api/categories/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return res.data.category;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
	}
});

// Delete category
export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
	try {
		await axiosTokenInstance.delete(`/api/categories/${id}`);
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
	}
});

const categorySlice = createSlice({
	name: 'categories',
	initialState: {
		categories: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.categories = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(createCategory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.loading = false;
				state.categories.push(action.payload);
			})
			.addCase(createCategory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(updateCategory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.loading = false;
				state.categories = state.categories.map(cat => cat._id === action.payload._id ? action.payload : cat);
			})
			.addCase(updateCategory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(deleteCategory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.loading = false;
				state.categories = state.categories.filter(cat => cat._id !== action.payload);
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default categorySlice.reducer;
