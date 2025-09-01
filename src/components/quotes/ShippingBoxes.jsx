import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsByCategory } from '../../redux/slices/productSlice';
import { box } from "../../constants";
import { FaPlus } from "react-icons/fa";

const ShippingBoxes = ({ getQuantity, updateQuantity, setShowAddBoxForm, onItemIdsChange, toCountry }) => {
  const dispatch = useDispatch();
  const { productsByCategory, loading, error } = useSelector((state) => state.products);

  // Generate unique item ID from product - keep it consistent for quantity tracking
  const generateItemId = (product) => {
    // Create a more predictable ID based on product name
    const cleanName = product.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    const itemId = `origin-${cleanName}`;
    return itemId;
  };

  // Function to get all current item IDs for parent component use
  const getCurrentItemIds = () => {
    if (!productsByCategory || productsByCategory.length === 0) return [];
    const itemIds = productsByCategory.map(product => generateItemId(product));
    return itemIds;
  };

  useEffect(() => {
    dispatch(fetchProductsByCategory('Shipping Boxes'));
  }, [dispatch]);

  // Notify parent component when item IDs change
  useEffect(() => {
    const itemIds = getCurrentItemIds();
    
    // Create mapping between itemIds and product._id
    const itemToProductMap = {};
    const productDetails = {};
    if (productsByCategory && productsByCategory.length > 0) {
      productsByCategory.forEach(product => {
        const itemId = generateItemId(product);
        itemToProductMap[itemId] = product._id;
        productDetails[product._id] = product; // Store full product details
      });
    }
    
    if (onItemIdsChange) {
      onItemIdsChange('origin', itemIds, itemToProductMap, productDetails);
    }
  }, [productsByCategory, onItemIdsChange]);

  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
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
        <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading products: {error}</p>
          <button 
            onClick={() => dispatch(fetchProductsByCategory('Shipping Boxes'))}
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
      <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
      <div className="space-y-4">
        {productsByCategory && productsByCategory.length > 0 ? (
          productsByCategory.map((product) => {
            const itemId = generateItemId(product);
            return (
              <div key={product._id || product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={product.image?.url || box}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = box; // Fallback to default box image
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.details || 'Our chemically hardened, double-walled cardboard box is best for bulky items like bedding and blankets.'}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      ${parseFloat(product.price[toCountry] || 0).toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {product.size || '61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max'}
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
            <p className="text-gray-600">No shipping boxes available at the moment.</p>
          </div>
        )}

        {/* Add your own box option */}
        {/* <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={box}
                alt="Add Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Add your own box</h4>
              <p className="text-gray-600 text-sm mb-4">
                Already have some sturdy boxes you can use? Add them here.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  className="px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full"
                >
                  <FaPlus /> Add Box
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ShippingBoxes;
