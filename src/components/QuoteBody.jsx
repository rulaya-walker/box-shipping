import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { picture,box,sb,imgTab,cycle,suitcase,backpacks } from '../constants';
import ShippingBoxes from './quotes/ShippingBoxes';
import Picture from './quotes/Picture';
import Sports from './quotes/Sports';
import Suitcase from './quotes/Suitcase';
import Backpacks from './quotes/Backpacks';
import Bedrooms from './quotes/Bedrooms';
import DiningRoom from './quotes/DiningRoom';
import Garden from './quotes/Garden';
import Kitchen from './quotes/Kitchen';
import LivingRoom from './quotes/LivingRoom';
import Musica from './quotes/Musica';
import Office from './quotes/Office';
import Other from './quotes/Other';
const QuoteBody = () => {
  const [activeTab, setActiveTab] = useState('origin');
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [formData, setFormData] = useState({
    itemName: '',
    width: '',
    height: '',
    depth: '',
    quantity: '',
    weight: '0-30'
  });

  const updateQuantity = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const getQuantity = (itemId) => {
    return quantities[itemId] || 0;
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const steps = [
    { id: 1, name: 'Build Order', status: 'current' },
    { id: 2, name: 'Service Option', status: 'service_option' },
    { id: 3, name: 'Destination Charges', status: 'destination_charges' },
    { id: 4, name: 'Quote', status: 'quote' }
  ];

  const tabs = [
    { id: 'origin', name: 'Shipping Boxes',icon:box },
    { id: 'picture', name: 'Pictures and Mirrors', icon:picture },
    { id: 'package', name: 'Sports and Outdoors', icon:box },
    { id: 'service', name: 'Suitcases', icon:suitcase },
    { id: 'additional', name: 'Backpacks', icon:backpacks },
    { id: 'bedrooms', name: 'Bedrooms', icon:box },
    { id: 'dining_room', name: 'Dining Room', icon:box },
    { id: 'garden', name: 'Garden', icon:box },
    { id: 'kitchen', name: 'Kitchen', icon:box },
    { id: 'living_room', name: 'Living Room', icon:box },
    { id: 'musical', name: 'Musical Instruments', icon:box },
    { id: 'office', name: 'Office', icon:box },
    { id: 'other', name: 'Other', icon:box }
  ];

  return (
    <>
    <div className='h-96 w-full bg-primary flex items-center justify-center quote-bg relative'>
        <div className='py-64'>
        <h2 className='text-2xl lg:text-4xl font-bold text-white mb-6 text-center'>Build Your Order</h2>
        <p className='text-sm text-white mb-6'>
Tell us what you want to ship. You can build your order up out of boxes, items and furniture.</p>
        <nav aria-label='Progress'>
          <ol className='flex items-center'>
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
                <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                  {stepIdx !== steps.length - 1 && (
                    <div className='h-0.5 w-full bg-gray-200' />
                  )}
                </div>
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`absolute bottom-5 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                    step.id <= currentStep
                      ? 'bg-white border-white'
                      : ' bg-gray-500 border-gray-500 hover:bg-gray-400'
                  }`}
                >
                  {step.id <= currentStep ? (
                    <span className='text-black text-sm font-medium'>{step.id}</span>
                  ) : (
                    <span className='text-white text-sm font-medium opacity-50'>{step.id}</span>
                  )}
                </button>
                <div className='mt-12'>
                  <span className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
    <div className='w-full max-w-7xl mx-auto p-6 mt-24'>
      {/* Progress Bar */}
      

      {/* Main Content with Vertical Tabs */}
      <div className='flex gap-6 relative'>
        {/* Vertical Tab Navigation - Only show for Step 1 */}
        {currentStep === 1 && (
          <div className='w-64 bg-white rounded-lg shadow-md p-4'>
            <nav className='space-y-2'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-primary border-l-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className='text-sm text-white mr-3 relative'><img src={tab.icon} className='w-8' alt={tab.name} /> <span className='absolute -bottom-2 -right-2 rounded-full flex items-center justify-center border-2 border-transparent w-6 h-6 bg-primary'>0</span></span>
                  <span className='font-medium'>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Content */}
        <div className={`${showAddBoxForm ? 'w-4/5' : 'flex-1'} bg-white rounded-lg shadow-md p-6 transition-all duration-300`}>
          <div>
            {/* Step 1: Build Order */}
            {currentStep === 1 && (
              <>
                {/* Small Boxes Tab */}
                {activeTab === 'origin' && (
                  <ShippingBoxes getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Medium Boxes Tab */}
            {activeTab === 'picture' && (
              <Picture getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Large Boxes Tab */}
            {activeTab === 'package' && (
              <Sports getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Packing Supplies Tab */}
            {activeTab === 'service' && (
              <Suitcase getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Specialty Items Tab */}
            {activeTab === 'additional' && (
              <Backpacks getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Bedrooms Items Tab */}
            {activeTab === 'bedrooms' && (
              <Bedrooms getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Bedrooms Items Tab */}
            {activeTab === 'dining_room' && (
              <DiningRoom getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Garden Items Tab */}
            {activeTab === 'garden' && (
              <Garden getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Kitchen Items Tab */}
            {activeTab === 'kitchen' && (
              <Kitchen getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Living Room Items Tab */}
            {activeTab === 'living_room' && (
              <LivingRoom getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Music Items Tab */}
            {activeTab === 'musical' && (
              <Musica getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Office Items Tab */}
            {activeTab === 'office' && (
              <Office getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}

            {/* Other Items Tab */}
            {activeTab === 'other' && (
              <Other getQuantity={getQuantity} updateQuantity={updateQuantity} setShowAddBoxForm={setShowAddBoxForm} />
            )}
              </>
            )}

            
            

            {/* Step 2: Service Option */}
            {currentStep === 2 && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Service Options</h3>
                <div className='space-y-6'>
                  <div className='border rounded-lg p-6 hover:shadow-lg transition-shadow'>
                    <h4 className='font-semibold mb-3'>Standard Shipping</h4>
                    <p className='text-gray-600 mb-4'>5-7 business days delivery with basic handling</p>
                    <div className='flex items-center justify-between'>
                      <span className='text-lg font-semibold text-primary'>$15.99</span>
                      <button className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'>
                        Select
                      </button>
                    </div>
                  </div>
                  
                  <div className='border rounded-lg p-6 hover:shadow-lg transition-shadow'>
                    <h4 className='font-semibold mb-3'>Express Shipping</h4>
                    <p className='text-gray-600 mb-4'>2-3 business days delivery with priority handling</p>
                    <div className='flex items-center justify-between'>
                      <span className='text-lg font-semibold text-primary'>$29.99</span>
                      <button className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'>
                        Select
                      </button>
                    </div>
                  </div>
                  
                  <div className='border rounded-lg p-6 hover:shadow-lg transition-shadow'>
                    <h4 className='font-semibold mb-3'>White Glove Service</h4>
                    <p className='text-gray-600 mb-4'>Premium service with careful handling and setup</p>
                    <div className='flex items-center justify-between'>
                      <span className='text-lg font-semibold text-primary'>$59.99</span>
                      <button className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'>
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Destination Charges */}
            {currentStep === 3 && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Destination Charges</h3>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='border rounded-lg p-6'>
                      <h4 className='font-semibold mb-3'>Pickup Address</h4>
                      <div className='space-y-3'>
                        <input 
                          type='text' 
                          placeholder='Street Address'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                        <div className='grid grid-cols-2 gap-3'>
                          <input 
                            type='text' 
                            placeholder='City'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                          />
                          <input 
                            type='text' 
                            placeholder='ZIP Code'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className='border rounded-lg p-6'>
                      <h4 className='font-semibold mb-3'>Delivery Address</h4>
                      <div className='space-y-3'>
                        <input 
                          type='text' 
                          placeholder='Street Address'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                        <div className='grid grid-cols-2 gap-3'>
                          <input 
                            type='text' 
                            placeholder='City'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                          />
                          <input 
                            type='text' 
                            placeholder='ZIP Code'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className='border rounded-lg p-6 bg-gray-50'>
                    <h4 className='font-semibold mb-3'>Additional Charges</h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Fuel Surcharge</span>
                        <span>$5.99</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Insurance</span>
                        <span>$12.99</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Handling Fee</span>
                        <span>$8.99</span>
                      </div>
                      <hr className='my-2' />
                      <div className='flex justify-between font-semibold'>
                        <span>Total Additional</span>
                        <span>$27.97</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Quote */}
            {currentStep === 4 && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Your Quote Summary</h3>
                <div className='space-y-6'>
                  <div className='border rounded-lg p-6 bg-blue-50'>
                    <h4 className='font-semibold mb-4 text-primary'>Order Summary</h4>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span>Selected Items</span>
                        <span>{Object.values(quantities).reduce((sum, qty) => sum + qty, 0)} items</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Service Type</span>
                        <span>Express Shipping</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Base Price</span>
                        <span>$29.99</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Additional Charges</span>
                        <span>$27.97</span>
                      </div>
                      <hr className='my-3' />
                      <div className='flex justify-between text-lg font-semibold text-primary'>
                        <span>Total Quote</span>
                        <span>$57.96</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <button className='px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors'>
                      Save Quote
                    </button>
                    <button className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'>
                      Book Shipment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='mt-8 flex justify-between'>
            <button 
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={`px-6 py-2 border border-gray-300 rounded-lg ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Previous
            </button>
            <button 
              onClick={() => currentStep < 4 && setCurrentStep(currentStep + 1)}
              disabled={currentStep === 4}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 4 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {currentStep === 4 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>

        {/* Add Box Form - Right Side Panel */}
        {showAddBoxForm && (
          <div className='w-1/5 bg-white rounded-lg shadow-lg p-6 h-full fixed right-6 top-0 bottom-0 overflow-y-auto z-50'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-semibold text-gray-800'>Add New Box</h3>
              <button 
                onClick={() => setShowAddBoxForm(false)}
                className='text-gray-500 hover:text-gray-700 text-xl font-bold'
              >
                ×
              </button>
            </div>

            <form className='space-y-6'>
              {/* Item Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Item Name
                </label>
                <input
                  type='text'
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Enter item name'
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Dimensions (cm)
                </label>
                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs text-gray-500 mb-1'>Width</label>
                    <input
                      type='number'
                      value={formData.width}
                      onChange={(e) => setFormData({...formData, width: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='Width'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-500 mb-1'>Height</label>
                    <input
                      type='number'
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='Height'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-500 mb-1'>Depth</label>
                    <input
                      type='number'
                      value={formData.depth}
                      onChange={(e) => setFormData({...formData, depth: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='Depth'
                    />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Quantity
                </label>
                <input
                  type='number'
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Enter quantity'
                  min='1'
                />
              </div>

              {/* Weight - Stylish Radio Buttons */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Weight Range
                </label>
                <div className='space-y-3'>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      name='weight'
                      value='0-30'
                      checked={formData.weight === '0-30'}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className='sr-only'
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      formData.weight === '0-30' 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {formData.weight === '0-30' && (
                        <div className='w-2 h-2 rounded-full bg-white'></div>
                      )}
                    </div>
                    <span className='text-sm text-gray-700'>0-30 Kg</span>
                  </label>
                  
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      name='weight'
                      value='30+'
                      checked={formData.weight === '30+'}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className='sr-only'
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      formData.weight === '30+' 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {formData.weight === '30+' && (
                        <div className='w-2 h-2 rounded-full bg-white'></div>
                      )}
                    </div>
                    <span className='text-sm text-gray-700'>30kg+</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddBoxForm(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
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
  )
}

export default QuoteBody