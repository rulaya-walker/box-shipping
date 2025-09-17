import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/slices/categorySlice';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(state => state.categories);
  const [form, setForm] = useState({ name: '', image: null });
  const [currentImage, setCurrentImage] = useState(null);
  const imageInputRef = useRef(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    if (form.image) formData.append('image', form.image);
    if (editId) {
      dispatch(updateCategory({ id: editId, formData }));
    } else {
      dispatch(createCategory(formData));
    }
    setForm({ name: '', image: null });
    setEditId(null);
    // Clear file input value
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleEdit = category => {
    setForm({ name: category.name, image: null });
    setEditId(category._id);
    setCurrentImage(category.image || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleDelete = id => {
    dispatch(deleteCategory(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Category Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div className="flex-1">
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            ref={imageInputRef}
          />
          {editId && currentImage && (
            <div className="mt-2">
              <span className="block text-xs text-gray-500 mb-1">Current Image:</span>
              <img src={currentImage} alt="Current" className="h-16 w-16 object-cover rounded border" />
            </div>
          )}
        </div>
        <div className="flex items-end">
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 cursor-pointer">{editId ? 'Update' : 'Add'}</button>
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-4 text-left rounded-tl-lg">Name</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{category.name}</td>
                <td className="py-3 px-4 text-gray-700">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(category)} className="mr-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(category._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;