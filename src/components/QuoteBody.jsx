import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import {
  picture,
  box,
  sb,
  imgTab,
  cycle,
  suitcase,
  backpacks,
} from "../constants";
import ShippingBoxes from "./quotes/ShippingBoxes";
import Picture from "./quotes/Picture";
import Sports from "./quotes/Sports";
import Suitcase from "./quotes/Suitcase";
import Backpacks from "./quotes/Backpacks";
import Bedrooms from "./quotes/Bedrooms";
import DiningRoom from "./quotes/DiningRoom";
import Garden from "./quotes/Garden";
import Kitchen from "./quotes/Kitchen";
import LivingRoom from "./quotes/LivingRoom";
import Musica from "./quotes/Musica";
import Office from "./quotes/Office";
import Other from "./quotes/Other";
import StripePayment from "./StripePayment";
import { usePayment } from "../hooks/usePayment";
import { 
  addToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  fetchCart 
} from "../redux/slices/cartSlice";
const QuoteBody = () => {
  const dispatch = useDispatch();
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  //get params value
  const queryParams = new URLSearchParams(window.location.search);
  const countryParam = queryParams.get('toCountry');
  const toCountry = countryParam?.toLowerCase() || 'australia';
  // Helper function to calculate item price from various sources
  const calculateItemPrice = (cartItem) => {
    // First, try to get price from the cart item itself
    if (typeof cartItem.price === 'number' && cartItem.price > 0) {
      return cartItem.price;
    }
    
    if (typeof cartItem.price === 'object' && cartItem.price) {
      const objectPrice = parseFloat(cartItem.price[toCountry] || 
                                   cartItem.price.canada || 
                                   Object.values(cartItem.price)[0] || 
                                   0);
      if (objectPrice > 0) return objectPrice;
    }
    
    if (typeof cartItem.price === 'string') {
      const stringPrice = parseFloat(cartItem.price.replace(/[^0-9.]/g, '')) || 0;
      if (stringPrice > 0) return stringPrice;
    }
    
    // Fallback: get price from productDetailsMap using productId
    const productDetails = productDetailsMap[cartItem.productId] || {};
    if (productDetails.price) {
      if (typeof productDetails.price === 'object') {
        return parseFloat(productDetails.price[toCountry] || 
                         productDetails.price.canada || 
                         Object.values(productDetails.price)[0] || 
                         0);
      } else {
        return parseFloat(productDetails.price) || 0;
      }
    }
    
    // If no price found anywhere, return 0
    return 0;
  };

  // Helper function to calculate total cart value
  const calculateCartTotal = () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      return 0;
    }
    
    return cart.products.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };
  
  const [activeTab, setActiveTab] = useState("origin");
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [dynamicItemIds, setDynamicItemIds] = useState({});
  const [itemIdToProductMap, setItemIdToProductMap] = useState({}); // Maps itemId to productId
  const [productDetailsMap, setProductDetailsMap] = useState({}); // Maps productId to full product details
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    width: "",
    height: "",
    depth: "",
    quantity: "",
    weight: "0-30",
  });

  const { calculateOrderTotal } = usePayment();

  // Generate a unique guest ID for cart operations
  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  // Load cart on component mount (with error handling)
  useEffect(() => {
    try {
      const guestId = getGuestId();
      dispatch(fetchCart({ guestId }));
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, [dispatch]);

  // Initialize itemIdToProductMap from localStorage on mount
  useEffect(() => {
    try {
      const savedMapping = localStorage.getItem('itemIdToProductMap');
      if (savedMapping) {
        const parsedMapping = JSON.parse(savedMapping);
        setItemIdToProductMap(parsedMapping);
        console.log('Restored itemIdToProductMap from localStorage:', parsedMapping);
      }
    } catch (error) {
      console.error('Failed to restore itemIdToProductMap from localStorage:', error);
    }
  }, []);

  // Save itemIdToProductMap to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(itemIdToProductMap).length > 0) {
      try {
        localStorage.setItem('itemIdToProductMap', JSON.stringify(itemIdToProductMap));
        console.log('Saved itemIdToProductMap to localStorage:', itemIdToProductMap);
      } catch (error) {
        console.error('Failed to save itemIdToProductMap to localStorage:', error);
      }
    }
  }, [itemIdToProductMap]);

  // Sync quantities from cart when cart is loaded (with error handling)
  useEffect(() => {
    try {
      if (cart && cart.products && Array.isArray(cart.products)) {
        const cartQuantities = {};
        
        // Map cart products back to frontend itemIds
        cart.products.forEach(cartProduct => {
          if (cartProduct.productId && cartProduct.quantity) {
            // Find the frontend itemId that corresponds to this productId
            const itemId = Object.keys(itemIdToProductMap).find(
              key => itemIdToProductMap[key] === cartProduct.productId
            );
            
            if (itemId) {
              cartQuantities[itemId] = cartProduct.quantity;
              console.log(`Restored quantity: ${itemId} = ${cartProduct.quantity}`);
            } else {
              // If we can't find the itemId mapping, use productId as fallback
              cartQuantities[cartProduct.productId] = cartProduct.quantity;
              console.log(`Fallback quantity: ${cartProduct.productId} = ${cartProduct.quantity}`);
            }
          }
        });
        
        // Only update if we have cart quantities to restore
        if (Object.keys(cartQuantities).length > 0) {
          setQuantities(prevQuantities => ({
            ...prevQuantities,
            ...cartQuantities
          }));
          console.log('Cart quantities synced:', cartQuantities);
        }
      }
    } catch (error) {
      console.error('Failed to sync quantities from cart:', error);
    }
  }, [cart, itemIdToProductMap]); // Added itemIdToProductMap dependency

  // Log cart items whenever cart changes
  useEffect(() => {
    try {
      if (cart && cart.products) {
        console.log('Current cart items:', cart.products);
        console.log('Cart total price:', cart.totalPrice || 0);
        console.log('Number of items in cart:', cart.products.length);
      }
    } catch (error) {
      console.error('Error logging cart:', error);
    }
  }, [cart]);

  const updateQuantity = (itemId, change) => {
    const currentQuantity = quantities[itemId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    // Update local state immediately for UI responsiveness
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    // Log the quantity change for debugging
    console.log(`Quantity change: ${itemId} from ${currentQuantity} to ${newQuantity}`);

    // Handle cart operations in background without blocking UI
    const handleCartOperation = async () => {
      try {
        const guestId = getGuestId();
        
        // Get the actual product ID from the mapping, fallback to itemId if not found
        const productId = itemIdToProductMap[itemId] || itemId;
        
        // Get product details for price
        const productDetails = productDetailsMap[productId];
        const price = productDetails?.price?.[toCountry] || 25; // Default to australia price or fallback

        console.log(`Cart operation: itemId=${itemId}, productId=${productId}, quantity=${newQuantity}, price=${price}`);
        
        if (newQuantity === 0 && currentQuantity > 0) {
          // Remove from cart when quantity becomes 0
          console.log(`Removing ${itemId} from cart`);
          await dispatch(removeFromCart({ 
            productId, 
            guestId 
          })).unwrap();
          
        } else if (newQuantity === 1 && currentQuantity === 0) {
          // Add to cart when quantity becomes 1 (first time adding)
          console.log(`Adding ${itemId} to cart with quantity 1`);
          await dispatch(addToCart({ 
            productId, 
            quantity: 1, 
            price,
            guestId,
            country: toCountry
          })).unwrap();
          
        } else if (newQuantity > 1) {
          // Update cart quantity when quantity is greater than 1
          console.log(`Updating ${itemId} quantity to ${newQuantity} in cart`);
          await dispatch(updateCartItemQuantity({ 
            productId, 
            quantity: newQuantity, 
            guestId 
          })).unwrap();
        }
        console.log(`✅ Cart operation successful for ${itemId}`);
      } catch (error) {
        console.warn('⚠️ Cart operation failed, continuing with local quantities:', error.message);
        // Don't revert UI state - let user continue with local quantities
      }
    };

    // Execute cart operation asynchronously without blocking UI
    handleCartOperation();
  };

  const getQuantity = (itemId) => {
    return quantities[itemId] || 0;
  };

  // Handle dynamic item IDs from Redux components
  const onItemIdsChange = useCallback((tabId, itemIds, itemToProductMap = {}, productDetails = {}) => {
    setDynamicItemIds((prev) => {
      const newState = {
        ...prev,
        [tabId]: itemIds
      };
      return newState;
    });
    
    // Update the item ID to product ID mapping
    setItemIdToProductMap((prev) => ({
      ...prev,
      ...itemToProductMap
    }));
    
    // Update the product details mapping
    setProductDetailsMap((prev) => ({
      ...prev,
      ...productDetails
    }));
  }, []);

  // Map each tab to its related item categories
  const getTabQuantity = (tabId) => {
    // Use dynamic item IDs from Redux components
    const itemIds = dynamicItemIds[tabId] || [];
    
    return itemIds.reduce((total, itemId) => total + (quantities[itemId] || 0), 0);
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handlePaymentClick = () => {
    // Validate that user has items
    const totalItems = cart && cart.products ? 
      cart.products.reduce((sum, item) => sum + item.quantity, 0) : 0;
    
    if (totalItems === 0) {
      alert('Please add at least one item to your order before proceeding to payment.');
      return;
    }

    navigate('/checkout');
    return;
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setShowPayment(false);
    // You can add success handling logic here
    alert('Payment successful! Your shipment has been booked.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // You can add error handling logic here
  };

  const getOrderDetails = () => {
    // Calculate cart total using helper function
    const cartTotal = calculateCartTotal();

    // Calculate shipping cost
    const shippingCost = parseFloat(selectedService === 'standard' ? '15.99' :
                                   selectedService === 'express' ? '29.99' :
                                   selectedService === 'whiteglove' ? '59.99' :
                                   '29.99');
    
    const processingFee = 12.50;
    const totalAmount = cartTotal + shippingCost + processingFee;

    const orderDetails = {
      selectedService: selectedService || 'express',
      cartItems: cart?.products || [],
      cartTotal: cartTotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      processingFee: processingFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      destinationCharges: cartTotal.toFixed(2),
      currency: 'USD'
    };
    
    console.log('Order Details:', orderDetails);
    
    return orderDetails;
  };

  const steps = [
    { id: 1, name: "Build Order", status: "current" },
    { id: 2, name: "Service Option", status: "service_option" },
    { id: 3, name: "Quote", status: "quote" },
  ];

  const tabs = [
    { id: "origin", name: "Shipping Boxes", icon: box },
    { id: "picture", name: "Pictures and Mirrors", icon: picture },
    { id: "package", name: "Sports and Outdoors", icon: box },
    { id: "service", name: "Suitcases", icon: suitcase },
    { id: "additional", name: "Backpacks", icon: backpacks },
    { id: "bedrooms", name: "Bedrooms", icon: box },
    { id: "dining_room", name: "Dining Room", icon: box },
    { id: "garden", name: "Garden", icon: box },
    { id: "kitchen", name: "Kitchen", icon: box },
    { id: "living_room", name: "Living Room", icon: box },
    { id: "musical", name: "Musical Instruments", icon: box },
    { id: "office", name: "Office", icon: box },
    { id: "other", name: "Other", icon: box },
  ];

  return (
    <>
      {/* Show Stripe Payment if payment is triggered */}
      {showPayment && (
        <StripePayment
          orderDetails={getOrderDetails()}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      
      {/* Main Quote Interface */}
      {!showPayment && (
        <>
          <div className="w-full bg-[#f4f4f4] flex items-center justify-center quote-bg relative">
        <div className="py-4">
          <h2 className="text-2xl lg:text-4xl font-bold text-primary mb-6 text-center">
            Your shipment to {countryParam}
          </h2>
          <p className="text-sm text-primary mb-6">
            Tell us what you want to ship. You can build your order up out of
            boxes, items and furniture.
          </p>
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={`${
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
                  } relative`}
                >
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    {stepIdx !== steps.length - 1 && (
                      <div className="h-0.5 w-full bg-gray-200" />
                    )}
                  </div>
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`absolute bottom-5 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                      step.id <= currentStep
                        ? "bg-white border-white"
                        : " bg-gray-500 border-gray-500 hover:bg-gray-400"
                    }`}
                  >
                    {step.id <= currentStep ? (
                      <span className="text-black text-sm font-medium">
                        {step.id}
                      </span>
                    ) : (
                      <span className="text-white text-sm font-medium opacity-50">
                        {step.id}
                      </span>
                    )}
                  </button>
                  <div className="mt-12">
                    <span
                      className={`text-sm font-medium ${
                        step.id <= currentStep ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Progress Bar */}

        {/* Main Content with Vertical Tabs */}
        <div className="flex gap-6 relative">
          {/* Vertical Tab Navigation - Only show for Step 1 */}
          {currentStep === 1 && (
            <div className="w-64 bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-sm text-white mr-3 relative">
                      <img src={tab.icon} className="w-8" alt={tab.name} />{" "}
                      <span className="absolute -bottom-2 -right-2 rounded-full flex items-center justify-center border-2 border-transparent w-6 h-6 bg-primary">
                        {getTabQuantity(tab.id)}
                      </span>
                    </span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Tab Content */}
          <div
            className={`${
              showAddBoxForm ? "w-4/5" : "flex-1"
            } bg-white rounded-lg shadow-md p-6 transition-all duration-300`}
          >

            <div>
              {/* Step 1: Build Order */}
              {currentStep === 1 && (
                <>
                  {/* Small Boxes Tab */}
                  {activeTab === "origin" && (
                    <ShippingBoxes
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Medium Boxes Tab */}
                  {activeTab === "picture" && (
                    <Picture
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Large Boxes Tab */}
                  {activeTab === "package" && (
                    <Sports
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Packing Supplies Tab */}
                  {activeTab === "service" && (
                    <Suitcase
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Specialty Items Tab */}
                  {activeTab === "additional" && (
                    <Backpacks
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Bedrooms Items Tab */}
                  {activeTab === "bedrooms" && (
                    <Bedrooms
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Bedrooms Items Tab */}
                  {activeTab === "dining_room" && (
                    <DiningRoom
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Garden Items Tab */}
                  {activeTab === "garden" && (
                    <Garden
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Kitchen Items Tab */}
                  {activeTab === "kitchen" && (
                    <Kitchen
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Living Room Items Tab */}
                  {activeTab === "living_room" && (
                    <LivingRoom
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Music Items Tab */}
                  {activeTab === "musical" && (
                    <Musica
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Office Items Tab */}
                  {activeTab === "office" && (
                    <Office
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}

                  {/* Other Items Tab */}
                  {activeTab === "other" && (
                    <Other
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                      toCountry={toCountry}
                    />
                  )}
                </>
              )}

              {/* Step 2: Service Option */}
              {currentStep === 2 && (
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Left Column - Selected Items */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">
                        Selected Items
                      </h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart && cart.products && cart.products.length > 0 ? (
                          // Show actual cart items from database
                          cart.products.map((cartItem, index) => {
                            // Get product details from our mapping
                            const productDetails = productDetailsMap[cartItem.productId] || {};
                            
                            // Find the frontend itemId for this productId
                            const itemId = Object.keys(itemIdToProductMap).find(
                              key => itemIdToProductMap[key] === cartItem.productId
                            );
                            
                            return (
                              <div
                                key={`cart-item-${index}`}
                                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <img
                                    src={productDetails.image.url || box}
                                    alt={productDetails.name || 'Product'}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800">
                                    {cartItem.name}
                                  </h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-500">
                                      {productDetails.dimensions || 'Standard size'}
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {cartItem.quantity}
                                    </span>
                                  </div>
                                  {productDetails.price && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      ${typeof productDetails.price === 'object' ? 
                                        (productDetails.price[toCountry] || 
                                         productDetails.price.canada || 
                                         Object.values(productDetails.price)[0] || 
                                         'N/A') : 
                                        productDetails.price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          // Fallback to sample items when no cart items
                          <>

                           <p className="text-gray-600">No Products in the Cart. Click on Previous button and add some products.</p>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Items:
                          </span>
                          <span className="font-semibold text-primary">
                            {cart && cart.products ? 
                              cart.products.reduce((sum, item) => sum + item.quantity, 0) :
                              6
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Price:
                          </span>
                          <span className="font-semibold text-primary">
                            ${calculateCartTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Service options removed as requested */}
                    </div>
                  </div>
                </div>
              )}


              {/* Step 4: Quote */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Your Quote Summary
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column - Selected Items */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">
                        Selected Items
                      </h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart && cart.products && cart.products.length > 0 ? (
                          // Show actual cart items from database
                          cart.products.map((cartItem, index) => {
                            // Get product details from our mapping
                            const productDetails = productDetailsMap[cartItem.productId] || {};
                            
                            // Find the frontend itemId for this productId
                            const itemId = Object.keys(itemIdToProductMap).find(
                              key => itemIdToProductMap[key] === cartItem.productId
                            );
                            
                            return (
                              <div
                                key={`cart-item-${index}`}
                                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <img
                                    src={productDetails.image || box}
                                    alt={productDetails.name || 'Product'}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800">
                                    {cartItem.name}
                                  </h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-500">
                                      {productDetails.dimensions || 'Standard size'}
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {cartItem.quantity}
                                    </span>
                                  </div>
                                  {productDetails.price && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      ${typeof productDetails.price === 'object' ? 
                                        (productDetails.price[toCountry] || 
                                         productDetails.price.canada || 
                                         Object.values(productDetails.price)[0] || 
                                         'N/A') : 
                                        productDetails.price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          // Fallback to sample items when no cart items
                          <>
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <img
                                  src={box}
                                  alt="Large Box"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">
                                  Large Box
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm text-gray-500">
                                    24" x 20" x 16"
                                  </span>
                                  <span className="font-semibold text-primary">
                                    2
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <img
                                  src={picture}
                                  alt="Picture Frame"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">
                                  Picture Frame
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm text-gray-500">
                                    Medium size
                                  </span>
                                  <span className="font-semibold text-primary">
                                    1
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <img
                                  src={suitcase}
                                  alt="Suitcase"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">
                                  Travel Suitcase
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm text-gray-500">
                                    Large size
                                  </span>
                                  <span className="font-semibold text-primary">
                                    3
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Items:
                          </span>
                          <span className="font-semibold text-primary">
                            {cart && cart.products ? 
                              cart.products.reduce((sum, item) => sum + item.quantity, 0) :
                              6
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Price:
                          </span>
                          <span className="font-semibold text-primary">
                            ${calculateCartTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Total Price & Payment */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-6 text-gray-800">
                        Final Quote
                      </h4>
                      
                      {/* Price Breakdown */}
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-600">
                          <span>Service Type:</span>
                          <span className="font-medium">
                            {selectedService === 'standard' ? 'Standard Shipping' :
                             selectedService === 'express' ? 'Express Shipping' :
                             selectedService === 'whiteglove' ? 'White Glove Service' :
                             'Express Shipping'}
                          </span>
                        </div>
                        

                        
                        <div className="flex justify-between text-gray-600">
                          <span>Destination Charges:</span>
                          <span className="font-medium">
                            ${calculateCartTotal().toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-gray-600">
                          <span>Processing Fee:</span>
                          <span className="font-medium">$12.50</span>
                        </div>
                        
                        <hr className="border-gray-300" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total:</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${(() => {
                                const processingFee = 12.50;
                                const cartTotal = calculateCartTotal();
                                return (processingFee + cartTotal).toFixed(2);
                              })()}
                            </div>
                            <div className="text-sm text-gray-500">USD</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Button */}
                      <div className="space-y-4">
                        <button 
                          onClick={handlePaymentClick}
                          className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg cursor-pointer"
                        >
                          💳 Proceed to Payment
                        </button>
                        
                        <div className="text-center text-sm text-gray-500">
                          <p>🔒 Secure payment with 256-bit SSL encryption</p>
                          <p className="mt-1">💯 100% money-back guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() =>
                  currentStep > 1 && setCurrentStep(currentStep - 1)
                }
                disabled={currentStep === 1}
                className={`px-6 py-2 border border-gray-300 rounded-lg ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  currentStep === 2 ? setCurrentStep(4) : (currentStep < 4 && setCurrentStep(currentStep + 1))
                }
                disabled={currentStep === 4}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 4
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {currentStep === 4 ? "Complete" : "Next"}
              </button>
            </div>
          </div>

          {/* Add Box Form - Right Side Panel */}
          {showAddBoxForm && (
            <div className="w-1/5 bg-white rounded-lg shadow-lg p-6 h-full fixed right-6 top-0 bottom-0 overflow-y-auto z-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Add New Box
                </h3>
                <button
                  onClick={() => setShowAddBoxForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) =>
                          setFormData({ ...formData, width: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({ ...formData, height: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Height"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Depth
                      </label>
                      <input
                        type="number"
                        value={formData.depth}
                        onChange={(e) =>
                          setFormData({ ...formData, depth: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Depth"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>

                {/* Weight - Stylish Radio Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Weight Range
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="weight"
                        value="0-30"
                        checked={formData.weight === "0-30"}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.weight === "0-30"
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.weight === "0-30" && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">0-30 Kg</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="weight"
                        value="30+"
                        checked={formData.weight === "30+"}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.weight === "30+"
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.weight === "30+" && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">30kg+</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBoxForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add Box
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </>
  );
};

export default QuoteBody;
