import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { 
  fetchAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadImage,
  clearUploadedImage
} from '../../redux/slices/adminProductSlice';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaImage, FaUpload } from 'react-icons/fa';

const ProductManagement = () => {
  // Handler for category filter
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handler for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
  if (currentPage < backendTotalPages) setCurrentPage(currentPage + 1);
  };
  const dispatch = useDispatch();
  const adminProductState = useSelector((state) => state.adminProducts);
  const authState = useSelector((state) => state.auth);
  const { 
    adminProducts = [], 
    loading = false, 
    error = null,
    uploadingImage = false,
    uploadedImageUrl = null
  } = adminProductState || {};
  const { user, token } = authState || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: { 
      australia: '', 
      bahrain: '', 
      canada: '', 
      dubai: '',
      hongkong: '',
      japan: '',
      malasia: '',
      newzealand: '',
      singapore: '',
      southafrica: ''
    },
    size: '',
    details: '',
    category: 'Shipping Boxes',
    status: 'active',
    image: null,
    createdAt: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
    const [backendTotalPages, setBackendTotalPages] = useState(1);
    const [backendTotal, setBackendTotal] = useState(0);

    // Fetch products with pagination and category
    useEffect(() => {
      const params = {
        page: currentPage,
        limit: productsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      };
      dispatch(fetchAdminProducts(params)).then((action) => {
        if (action.payload && action.payload.totalPages) {
          setBackendTotalPages(action.payload.totalPages);
          setBackendTotal(action.payload.total);
        }
      });
    }, [dispatch, currentPage, selectedCategory, productsPerPage]);

  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageFile, setOriginalImageFile] = useState(null); // Store the original file

  // Fetch products on component mount
  useEffect(() => {
    console.log('Dispatching fetchAdminProducts...');
    dispatch(fetchAdminProducts()).catch(err => {
      console.error('Error fetching admin products:', err);
    });
  }, [dispatch]);

  // Fetch categories from Redux
  const categoryState = useSelector(state => state.categories);
  const { categories: categoryList = [], loading: categoryLoading } = categoryState || {};

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Ensure adminProducts is always an array for filtering
  // Use backend paginated products only
  const productsArray = Array.isArray(adminProducts.products)
    ? adminProducts.products
    : Array.isArray(adminProducts)
      ? adminProducts
      : [];

  // Parse price strings from backend and add them to products
  const processedProducts = productsArray.map(product => {
    let priceObj = {};
    if (typeof product.price === 'string') {
      try {
        priceObj = JSON.parse(product.price);
      } catch (e) {
        priceObj = {
          australia: 0, bahrain: 0, canada: 0, dubai: 0,
          hongkong: 0, japan: 0, malasia: 0, newzealand: 0,
          singapore: 0, southafrica: 0
        };
      }
    } else if (typeof product.price === 'object' && product.price !== null) {
      priceObj = product.price;
    }
    return {
      ...product,
      price: priceObj
    };
  });

  // Filter by category and search, then sort
  const filteredProducts = processedProducts.filter(product =>
    (selectedCategory === 'all' || (product?.category && product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase())) &&
    (product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product?.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a.category || '').localeCompare(b.category || '');
    } else {
      return (b.category || '').localeCompare(a.category || '');
    }
  });


  // Add error boundary
  if (!adminProductState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redux State Error</h2>
          <p className="text-gray-600">adminProducts state is not available. Check your store configuration.</p>
        </div>
      </div>
    );
  }

  // Show loading spinner if still loading and no products yet
  if (loading && processedProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const handleAddProduct = () => {
    setFormData({
      name: '',
      price: { 
        australia: '', 
        bahrain: '', 
        canada: '', 
        dubai: '',
        hongkong: '',
        japan: '',
        malasia: '',
        newzealand: '',
        singapore: '',
        southafrica: ''
      },
      size: '',
      details: '',
      category: 'Shipping Boxes',
      status: 'active',
  image: null,
  createdAt: '',
    });
    setImagePreview(null);
    setOriginalImageFile(null);
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product) => {
    // Parse price data if it's a string from backend
    let priceObj = {};
    if (typeof product.price === 'string') {
      try {
        priceObj = JSON.parse(product.price);
      } catch (e) {
        console.error('Error parsing price for editing:', e);
        priceObj = {
          australia: 0, bahrain: 0, canada: 0, dubai: 0,
          hongkong: 0, japan: 0, malasia: 0, newzealand: 0,
          singapore: 0, southafrica: 0
        };
      }
    } else if (typeof product.price === 'object' && product.price !== null) {
      priceObj = product.price;
    }


    setFormData({
      name: product.name || '',
      price: { 
        australia: priceObj.australia || '', 
        bahrain: priceObj.bahrain || '', 
        canada: priceObj.canada || '',
        dubai: priceObj.dubai || '',
        hongkong: priceObj.hongkong || '',
        japan: priceObj.japan || '',
        malasia: priceObj.malasia || '',
        newzealand: priceObj.newzealand || '',
        singapore: priceObj.singapore || '',
        southafrica: priceObj.southafrica || ''
      },
      size: product.size || '',
      details: product.details || '',
      category: product.category || 'Shipping Boxes',
      status: product.status || 'active',
      image: product.image?.url || null, // Extract URL from image object
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : '',
    });
    setImagePreview(product.image?.url || null);
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price.australia || !formData.size) {
      alert('Please fill in all required fields (name, size, and at least Australia price)');
      return;
    }

    const priceData = {
      australia: parseFloat(formData.price.australia) || 0,
      bahrain: parseFloat(formData.price.bahrain) || 0,
      canada: parseFloat(formData.price.canada) || 0,
      dubai: parseFloat(formData.price.dubai) || 0,
      hongkong: parseFloat(formData.price.hongkong) || 0,
      japan: parseFloat(formData.price.japan) || 0,
      malasia: parseFloat(formData.price.malasia) || 0,
      newzealand: parseFloat(formData.price.newzealand) || 0,
      singapore: parseFloat(formData.price.singapore) || 0,
      southafrica: parseFloat(formData.price.southafrica) || 0
    };

    // Create FormData for multipart/form-data submission
    const formDataToSend = new FormData();
    
    // Add basic product data
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', JSON.stringify(priceData));
    formDataToSend.append('size', formData.size);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('createdAt', formData.createdAt);
   
    
    // Add image file if present
    if (originalImageFile) {
      console.log('Adding image file to FormData:', {
        filename: originalImageFile.name,
        size: `${(originalImageFile.size / 1024).toFixed(2)}KB`,
        type: originalImageFile.type
      });
      formDataToSend.append('image', originalImageFile);
      formDataToSend.append('altText', `${formData.name} product image`);
    }
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      if (editingProduct) {
        // Update existing product
        await dispatch(updateProduct({ id: editingProduct._id, productData: formDataToSend })).unwrap();
        alert('Product updated successfully!');
      } else {
        // Add new product
        await dispatch(createProduct(formDataToSend)).unwrap();
        alert('Product created successfully!');
      }

      // Clear uploaded image state
      dispatch(clearUploadedImage());
      
      setShowAddForm(false);
      setEditingProduct(null);
      // Reset form
      setFormData({
        name: '',
        price: { 
          australia: '', 
          bahrain: '', 
          canada: '', 
          dubai: '',
          hongkong: '',
          japan: '',
          malasia: '',
          newzealand: '',
          singapore: '',
          southafrica: ''
        },
        size: '',
        details: '',
        category: 'Shipping Boxes',
        status: 'active',
        image: null,
        createdAt: '',
      });
      setImagePreview(null);
      setOriginalImageFile(null);
    } catch (error) {
      console.error('Detailed error saving product:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      
      let errorMessage = 'Error saving product';
      
      if (error?.message) {
        errorMessage += `: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `: ${error}`;
      }
      
      // Check for authentication errors
      if (error?.message?.includes('Not authorized') || error?.message?.includes('token')) {
        errorMessage = 'Authentication error: Please log in again';
      }
      
      // Check for network errors
      if (error?.message?.includes('Network error') || error?.code === 'ECONNABORTED') {
        errorMessage = 'Network error: Unable to connect to server. Please check if you are logged in and try again.';
      }
      
      // Check for payload too large error (413)
      if (error?.response?.status === 413 || error?.message?.includes('413')) {
        errorMessage = 'File too large: The request is too large for the server. Try removing the image or using a smaller image file.';
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        alert('Product deleted successfully!');
      } catch (error) {
        alert(`Error deleting product: ${error}`);
      }
    }
  };

  const handlePriceChange = (country, value) => {
    setFormData({
      ...formData,
      price: {
        ...formData.price,
        [country]: value
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB for better handling)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB. Please compress your image or choose a smaller file.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      console.log('Original file:', {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)}KB`,
        type: file.type
      });

      // Store the original file for FormData submission
      setOriginalImageFile(file);
      
      // Create preview from the original file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Update form data to indicate we have an image
      setFormData({
        ...formData,
        image: file.name // Just store filename for reference
      });
    }
  };

  // Image compression function
  const compressImage = (file, callback) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 600px width/height for smaller files)
      const maxSize = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with higher compression (0.6 quality for smaller files)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      
      // Check final size and compress further if needed
      const sizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      
      if (sizeKB > 300) {
        // If still too large, compress even more
        const veryCompressedDataUrl = canvas.toDataURL('image/jpeg', 0.4);
        callback(veryCompressedDataUrl);
      } else {
        callback(compressedDataUrl);
      }
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setOriginalImageFile(null);
    setFormData({
      ...formData,
      image: null
    });
  };

  const getStatusBadge = (isPublished) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    const statusLabel = isPublished ? 'Published' : 'Draft';
    const styleClass = isPublished ? statusStyles.published : statusStyles.draft;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styleClass}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <div>
     

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your shipping products, prices, and inventory.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!user || !token ? (
              <div className="text-center">
                <p className="text-red-600 text-sm mb-2">Please log in to manage products</p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search, Category Filter, and Sorting */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Category Filter */}
        <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Categories</option>
              {categoryList.map(cat => (
                <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
        </div>
        {/* Category Sort */}
  {/* Sort dropdown removed as requested */}
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
  <div className="overflow-x-scroll scrollbar" style={{ WebkitOverflowScrolling: 'touch', overflowX: 'scroll', scrollbarWidth: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing (Countries)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Only <tr> elements allowed in <tbody> */}
              {loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && sortedProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
              {!loading && !error && sortedProducts.length > 0 &&
                sortedProducts.map((product) => (
                          <tr key={product._id || product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{product.name || 'Unnamed Product'}</div>
                              <div className="text-sm text-gray-500">
                                Created: {product.createdAt || product.dateCreated ? 
                                  new Date(product.createdAt || product.dateCreated).toLocaleDateString() : 
                                  'N/A'
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                                {product.image ? (
                                  <img 
                                    src={product.image.url} 
                                    alt={product.altText || 'Product'}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <FaImage className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                AUS: ${product.price?.australia || 0} / CAN: ${product.price?.canada || 0} / BHR: ${product.price?.bahrain || 0}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                NZ: ${product.price?.newzealand || 0} / SG: ${product.price?.singapore || 0} / JP: ${product.price?.japan || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate" title={product.size || ''}>
                                {product.size || 'No size specified'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.category || 'Uncategorized'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(product.isPublished)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                disabled={loading}
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id || product.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={loading}
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Pagination Controls and Results Summary (only once, at the bottom) */}
      {(backendTotalPages > 1 || backendTotal > 0) && (
        <div className="flex flex-col items-center w-full mt-4">
          {/* Results summary */}
          <div className="w-full text-center py-2 text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{(currentPage - 1) * productsPerPage + 1}</span>{' '}
            to{' '}
            <span className="font-medium">{Math.min(currentPage * productsPerPage, backendTotal)}</span>{' '}
            of{' '}
            <span className="font-medium">{backendTotal}</span> results
          </div>
          {/* Pagination controls */}
          {backendTotalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 w-full">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === backendTotalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: backendTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter product name"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3"></div>
                            <p className="text-sm text-gray-500">Uploading image...</p>
                          </>
                        ) : (
                          <>
                            <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB (uploaded as original file)</p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Prices */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prices by Country *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Australia *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.australia}
                      onChange={(e) => handlePriceChange('australia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bahrain</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.bahrain}
                      onChange={(e) => handlePriceChange('bahrain', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Canada</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.canada}
                      onChange={(e) => handlePriceChange('canada', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Dubai</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.dubai}
                      onChange={(e) => handlePriceChange('dubai', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hong Kong</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.hongkong}
                      onChange={(e) => handlePriceChange('hongkong', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Japan</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.japan}
                      onChange={(e) => handlePriceChange('japan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Malaysia</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.malasia}
                      onChange={(e) => handlePriceChange('malasia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Zealand</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.newzealand}
                      onChange={(e) => handlePriceChange('newzealand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Singapore</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.singapore}
                      onChange={(e) => handlePriceChange('singapore', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">South Africa</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price.southafrica}
                      onChange={(e) => handlePriceChange('southafrica', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size/Dimensions *
                </label>
                <textarea
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter size and dimensions (e.g., 61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max)"
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Details
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter detailed product description, features, specifications, etc."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {categoryLoading && <option>Loading...</option>}
                  {!categoryLoading && categoryList.length === 0 && <option>No categories found</option>}
                  {!categoryLoading && categoryList.map(cat => (
                    <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              {/* Created At Date Field */}
              {editingProduct && (
              <div className="mb-4">
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">Created At</label>
                <input
                  type="date"
                  id="createdAt"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={e => setFormData({ ...formData, createdAt: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 custom-date-input"
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    padding: '0.5rem 0.75rem',
                    fontSize: '1rem',
                    color: '#374151',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              {originalImageFile && (
                <button
                  onClick={() => {
                    setOriginalImageFile(null);
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                    alert('Image removed. You can now try saving the product without an image.');
                  }}
                  className="px-4 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Remove Image & Save
                </button>
              )}
              <button
                onClick={handleSaveProduct}
                disabled={uploadingImage || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="mr-2 h-4 w-4" />
                {uploadingImage ? 'Processing Image...' : loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
