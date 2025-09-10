import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPrices, addPrice, updatePrice, deletePrice } from '../../redux/slices/priceSlice';

const PriceManagement = () => {
  const dispatch = useDispatch();
  const { prices, loading, error } = useSelector(state => state.prices);
  const [form, setForm] = useState({ country: '', price: '' });
  const countryOptions = [
    'Australia',
    'Bahrain',
    'Canada',
    'China',
    'Hong Kong',
    'Japan',
    'Malaysia',
    'New Zealand',
    'Singapore',
    'South Africa',
  ];
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getPrices());
  }, [dispatch]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      dispatch(updatePrice({ id: editId, priceData: form }));
    } else {
      dispatch(addPrice(form));
    }
    setForm({ country: '', price: '' });
    setEditId(null);
  };

  const handleEdit = price => {
  setForm({ country: price.country, price: price.price });
  setEditId(price._id);
  };

  const handleDelete = id => {
    dispatch(deletePrice(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Price Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <select name="country" value={form.country} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required>
            <option value="" disabled>Select Country</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <input name="price" value={form.price} onChange={handleChange} placeholder="Enter price" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required type="number" min="0" />
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
              <th className="py-3 px-4 text-left rounded-tl-lg">Country</th>
              <th className="py-3 px-4 text-left">Price (USD)</th>
              <th className="py-3 px-4 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(price => (
              <tr key={price._id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{price.country}</td>
                <td className="py-3 px-4 text-gray-700">${price.price}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(price)} className="mr-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(price._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceManagement;
