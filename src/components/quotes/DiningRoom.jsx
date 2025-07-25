import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsByCategory } from '../../redux/slices/productSlice';
import { FaPlus } from "react-icons/fa";

const DiningRoom = ({ getQuantity, updateQuantity, setShowAddBoxForm, onItemIdsChange }) => {
  const dispatch = useDispatch();
  const { productsByCategory, loading, error } = useSelector((state) => state.products);

  // Generate unique item ID from product
  const generateItemId = (product) => {
    const cleanName = product.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `dining-room-${cleanName}`;
  };

  // Function to get all current item IDs
  const getCurrentItemIds = () => {
    if (!productsByCategory || productsByCategory.length === 0) return [];
    return productsByCategory.map(product => generateItemId(product));
  };

  useEffect(() => {
    dispatch(fetchProductsByCategory('Dining Room'));
  }, [dispatch]);

  // Notify parent component when item IDs change
  useEffect(() => {
    const itemIds = getCurrentItemIds();
    if (onItemIdsChange) {
      onItemIdsChange('dining_room', itemIds);
    }
  }, [productsByCategory, onItemIdsChange]);

  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading products: {error}</p>
          <button 
            onClick={() => dispatch(fetchProductsByCategory('Dining Room'))}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
      <div className="space-y-4">
        {productsByCategory && productsByCategory.length > 0 ? (
          productsByCategory.map((product) => {
            const itemId = generateItemId(product);
            return (
              <div key={product._id || product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">🍽️</div>
                      <div className="text-xs text-gray-600">Dining</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.details || 'Professional packaging solution for dining room furniture.'}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      ${parseFloat(product.price.australia || 0).toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {product.size || 'Custom dimensions available'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(itemId, -1)}
                        className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">
                        {getQuantity(itemId)}
                      </span>
                      <button
                        onClick={() => updateQuantity(itemId, 1)}
                        className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No dining room products available at the moment.</p>
          </div>
        )}

        {/* Add custom dining room option */}
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">🍽️</div>
                <div className="text-xs text-gray-600">Dining</div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Add dining room furniture</h4>
              <p className="text-gray-600 text-sm mb-4">
                Please add the dimensions of your dining room items here.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  className="px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full"
                >
                  <FaPlus /> Add dining item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiningRoom;