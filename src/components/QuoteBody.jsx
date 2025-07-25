import { useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";

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
const QuoteBody = () => {
  const [activeTab, setActiveTab] = useState("origin");
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [dynamicItemIds, setDynamicItemIds] = useState({});
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

  const updateQuantity = (itemId, change) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, (prev[itemId] || 0) + change);
      const newState = {
        ...prev,
        [itemId]: newQuantity,
      };
      return newState;
    });
  };

  const getQuantity = (itemId) => {
    return quantities[itemId] || 0;
  };

  // Handle dynamic item IDs from Redux components
  const onItemIdsChange = useCallback((tabId, itemIds) => {
    setDynamicItemIds((prev) => {
      const newState = {
        ...prev,
        [tabId]: itemIds
      };
      return newState;
    });
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
    // Validate that user has selected a service and has items
    if (!selectedService) {
      alert('Please select a shipping service before proceeding to payment.');
      return;
    }
    
    const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      alert('Please add at least one item to your order before proceeding to payment.');
      return;
    }
    
    console.log('Proceeding to payment with:', { selectedService, quantities, totalItems });
    setShowPayment(true);
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
    // Provide default values to ensure we always have valid data
    const defaultService = selectedService || 'express';
    const defaultQuantities = Object.keys(quantities).length > 0 ? quantities : { 'default-item': 1 };
    
    const orderDetails = calculateOrderTotal({
      selectedService: defaultService,
      quantities: defaultQuantities,
      destinationCharges: 1329.73,
      processingFee: 12.50
    });
    
    console.log('Order Details Debug:', {
      selectedService,
      defaultService,
      quantities,
      defaultQuantities,
      orderDetails
    });
    
    return orderDetails;
  };

  const steps = [
    { id: 1, name: "Build Order", status: "current" },
    { id: 2, name: "Service Option", status: "service_option" },
    { id: 3, name: "Destination Charges", status: "destination_charges" },
    { id: 4, name: "Quote", status: "quote" },
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
          <div className="h-96 w-full bg-primary flex items-center justify-center quote-bg relative">
        <div className="py-64">
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 text-center">
            Build Your Order
          </h2>
          <p className="text-sm text-white mb-6">
            Tell us what you want to ship. You can build your order up out of
            boxes, items and furniture.
          </p>
          <nav aria-label="Progress">
            <ol className="flex items-center">
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
                        step.id <= currentStep ? "text-white" : "text-gray-500"
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
      <div className="w-full max-w-7xl mx-auto p-6 mt-24">
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
                    />
                  )}

                  {/* Medium Boxes Tab */}
                  {activeTab === "picture" && (
                    <Picture
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Large Boxes Tab */}
                  {activeTab === "package" && (
                    <Sports
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Packing Supplies Tab */}
                  {activeTab === "service" && (
                    <Suitcase
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Specialty Items Tab */}
                  {activeTab === "additional" && (
                    <Backpacks
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Bedrooms Items Tab */}
                  {activeTab === "bedrooms" && (
                    <Bedrooms
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Bedrooms Items Tab */}
                  {activeTab === "dining_room" && (
                    <DiningRoom
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Garden Items Tab */}
                  {activeTab === "garden" && (
                    <Garden
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Kitchen Items Tab */}
                  {activeTab === "kitchen" && (
                    <Kitchen
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Living Room Items Tab */}
                  {activeTab === "living_room" && (
                    <LivingRoom
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Music Items Tab */}
                  {activeTab === "musical" && (
                    <Musica
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Office Items Tab */}
                  {activeTab === "office" && (
                    <Office
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}

                  {/* Other Items Tab */}
                  {activeTab === "other" && (
                    <Other
                      getQuantity={getQuantity}
                      updateQuantity={updateQuantity}
                      setShowAddBoxForm={setShowAddBoxForm}
                      onItemIdsChange={onItemIdsChange}
                    />
                  )}
                </>
              )}

              {/* Step 2: Service Option */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Service Options
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Selected Items */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">
                        Selected Items
                      </h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {Object.entries(quantities).filter(
                          ([_, qty]) => qty > 0
                        ).length === 0 ? (
                          // Sample items when no real selections
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
                        ) : (
                          Object.entries(quantities)
                            .filter(([_, qty]) => qty > 0)
                            .map(([itemId, qty]) => (
                              <div
                                key={itemId}
                                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <img
                                    src={box}
                                    alt={itemId}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800 capitalize">
                                    {itemId.replace("-", " ")}
                                  </h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-500">
                                      Standard size
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {qty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Items:
                          </span>
                          <span className="font-semibold text-primary">
                            {Object.values(quantities).reduce(
                              (sum, qty) => sum + qty,
                              0
                            ) || 6}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Service Options */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">
                        Choose Your Service
                      </h4>
                      <div className="space-y-4">
                        {/* Standard Shipping */}
                        <label className="block cursor-pointer">
                          <input
                            type="radio"
                            name="serviceOption"
                            value="standard"
                            checked={selectedService === "standard"}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="sr-only"
                          />
                          <div
                            className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
                              selectedService === "standard"
                                ? "border-primary bg-blue-50"
                                : "border-gray-200 hover:border-primary"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                                  selectedService === "standard"
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedService === "standard" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-2">
                                  Standard Shipping
                                </h5>
                                <p className="text-gray-600 text-sm mb-3">
                                  5-7 business days delivery with basic handling
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    $15.99
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Most Popular
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>

                        {/* Express Shipping */}
                        <label className="block cursor-pointer">
                          <input
                            type="radio"
                            name="serviceOption"
                            value="express"
                            checked={selectedService === "express"}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="sr-only"
                          />
                          <div
                            className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
                              selectedService === "express"
                                ? "border-primary bg-blue-50"
                                : "border-gray-200 hover:border-primary"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                                  selectedService === "express"
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedService === "express" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-2">
                                  Express Shipping
                                </h5>
                                <p className="text-gray-600 text-sm mb-3">
                                  2-3 business days delivery with priority
                                  handling
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    $29.99
                                  </span>
                                  <span className="text-xs text-white bg-primary px-2 py-1 rounded">
                                    Fast
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>

                        {/* White Glove Service */}
                        <label className="block cursor-pointer">
                          <input
                            type="radio"
                            name="serviceOption"
                            value="whiteglove"
                            checked={selectedService === "whiteglove"}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="sr-only"
                          />
                          <div
                            className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
                              selectedService === "whiteglove"
                                ? "border-primary bg-blue-50"
                                : "border-gray-200 hover:border-primary"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                                  selectedService === "whiteglove"
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedService === "whiteglove" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-2">
                                  White Glove Service
                                </h5>
                                <p className="text-gray-600 text-sm mb-3">
                                  Premium service with careful handling and
                                  setup
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    $59.99
                                  </span>
                                  <span className="text-xs text-white bg-amber-500 px-2 py-1 rounded">
                                    Premium
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Destination Charges */}
              {currentStep === 3 && (
                <div>
                  <div className="max-w-2xl mx-auto">
                    {/* Main Destination Charges Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">
                          Destination Charges
                        </h4>
                        <p className="text-gray-600">Shipping to Australia</p>
                      </div>

                      <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="text-lg font-semibold text-gray-800">
                              Total Destination Fees
                            </h5>
                            <p className="text-sm text-gray-500">
                              All applicable charges for Australian delivery
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">
                              AUD
                            </div>
                            <div className="text-3xl font-bold text-primary">
                              1,329.73
                            </div>
                          </div>
                        </div>

                        <div className="border-t-2 border-gray-200 pt-4 pb-4 space-y-3">
                          <div className="flex flex-col text-center justify-center text-sm">
                            <h2 className="text-2xl text-red-500 font-semibold">100% transparency.</h2>
                            <h2 className="text-2xl text-primary font-semibold mb-4">Destination charges explained.</h2>
                            <p className="text-left">
                              Unlike most shipping and removal companies, our
                              services are end-to-end, this means we can explain
                              any charges in your destination country before you
                              book. All countries impose these charges on
                              international shipments. No matter who you ship
                              with, these fees are unavoidable. But many
                              shipping or removal companies either:
                            </p>
                            <ul className="list-disc list-inside text-left mt-2 space-y-1">
                              <li>
                                don't know the cost of destination charges, or
                              </li>
                              <li>
                                exclude them from their quotes, leading to
                                surprise costs.
                              </li>
                            </ul>
                            <p className="mt-2 text-left">
                                However, we at Seven Seas Worldwide are committed to 100% transparency, and because our service is end-to-end, we can tell you what these charges are before you book.
                            </p>
                          </div>

                          
                        </div>

                        <div className="border-t-2 border-gray-200 pt-4 pb-4 space-y-3">
                          <div className="flex flex-col text-center justify-center text-sm">
                            <h2 className="text-2xl text-primary font-semibold mb-4">Destination charges include:</h2>
                            <ul className="list-disc list-inside text-left mt-2 space-y-1">
                              <li>
                                Transport, including tolls, gate fees and demurrage.
                              </li>
                              <li>
                                Port charges, including hub/depot handling and container cleaning, including an x-ray and fumigation.
                              </li>
                              <li>Customs and quarantine inspection and clearance.</li>
                            </ul>
                          </div>

                          
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          * Charges calculated based on current rates as of{" "}
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
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
                        {Object.entries(quantities).filter(
                          ([_, qty]) => qty > 0
                        ).length === 0 ? (
                          // Sample items when no real selections
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
                        ) : (
                          Object.entries(quantities)
                            .filter(([_, qty]) => qty > 0)
                            .map(([itemId, qty]) => (
                              <div
                                key={itemId}
                                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <img
                                    src={box}
                                    alt={itemId}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800 capitalize">
                                    {itemId.replace("-", " ")}
                                  </h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-500">
                                      Standard size
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {qty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            Total Items:
                          </span>
                          <span className="font-semibold text-primary">
                            {Object.values(quantities).reduce(
                              (sum, qty) => sum + qty,
                              0
                            ) || 6}
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
                          <span>Shipping Cost:</span>
                          <span className="font-medium">
                            ${selectedService === 'standard' ? '15.99' :
                              selectedService === 'express' ? '29.99' :
                              selectedService === 'whiteglove' ? '59.99' :
                              '29.99'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-gray-600">
                          <span>Destination Charges:</span>
                          <span className="font-medium">AUD 1,329.73</span>
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
                              ${(parseFloat(selectedService === 'standard' ? '15.99' :
                                         selectedService === 'express' ? '29.99' :
                                         selectedService === 'whiteglove' ? '59.99' :
                                         '29.99') + 1329.73 + 12.50).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">USD + AUD</div>
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
                  currentStep < 4 && setCurrentStep(currentStep + 1)
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
