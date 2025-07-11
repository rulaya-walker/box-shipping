import { useState } from 'react';
import box  from  '../assets/box.png';
import { FaPlus } from 'react-icons/fa';
import sb  from '../assets/Shipping-Boxes-inactive.png';

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
    { id: 'origin', name: 'Shipping Boxes', icon: '📦' },
    { id: 'destination', name: 'Pictures and Mirrors', icon: '📦' },
    { id: 'package', name: 'Sports and Outdoors', icon: '📦' },
    { id: 'service', name: 'Suitcases', icon: '📋' },
    { id: 'additional', name: 'Backpacks', icon: '🎯' },
    { id: 'bedrooms', name: 'Bedrooms', icon: '🪑' },
    { id: 'dining_room', name: 'Dining Room', icon: '🛋️' },
    { id: 'garden', name: 'Garden', icon: '🛋️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
    { id: 'living_room', name: 'Living Room', icon: '🛋️' },
    { id: 'musical', name: 'Musical Instruments', icon: '🎸' },
    { id: 'office', name: 'Office', icon: '💻' },
    { id: 'other', name: 'Other', icon: '🔌' }
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
                  <span className='text-sm text-white mr-3 relative'><img src={sb} alt={tab.name} /> <span className='absolute inset-0 rounded-full flex items-center justify-center border-2 border-transparent w-6 h-6 bg-primary'>0</span></span>
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
                  <div>
                    <h3 className='text-xl font-semibold mb-4'>Shipping Boxes</h3>
                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 '>
                        <img src={box} alt='Small Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Large Boxes</h4>
                        <p className='text-gray-600 text-sm mb-4'>Our chemically hardened, double-walled cardboard box is best for bulky items like bedding and blankets.</p>
                        <p className='text-gray-600 text-xs'>61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('large-box', -1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('large-box')}</span>
                          <button 
                            onClick={() => updateQuantity('large-box', 1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Small Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Standard Box</h4>
                        <p className='text-gray-600 text-sm mb-4'>Our chemically hardened, double-walled cardboard box is best for bulky items like bedding and blankets.</p>
                        <p className='text-gray-600 text-xs'>61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('standard-box', -1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('standard-box')}</span>
                          <button 
                            onClick={() => updateQuantity('standard-box', 1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Small Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Clothes Box</h4>
                        <p className='text-gray-600 text-sm mb-4'>Our chemically hardened, double-walled cardboard box is best for bulky items like bedding and blankets.</p>
                        <p className='text-gray-600 text-xs'>61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('clothes-box', -1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('clothes-box')}</span>
                          <button 
                            onClick={() => updateQuantity('clothes-box', 1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Small Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Book Box</h4>
                        <p className='text-gray-600 text-sm mb-4'>Our chemically hardened, double-walled cardboard box is best for bulky items like bedding and blankets.</p>
                        <p className='text-gray-600 text-xs'>61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('book-box', -1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('book-box')}</span>
                          <button 
                            onClick={() => updateQuantity('book-box', 1)}
                            className='px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Small Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Add your own box</h4>
                        <p className='text-gray-600 text-sm mb-4'>Already have some sturdy boxes you can use? Add them here.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center'>
                          <button 
                            onClick={() => setShowAddBoxForm(true)}
                            className='px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full'
                          >
                            <FaPlus /> Add Box
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  
                </div>
              </div>
            )}

            {/* Medium Boxes Tab */}
            {activeTab === 'destination' && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Medium Boxes</h3>
                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='TV Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>TV Box (32" x 20" x 6")</h4>
                        <p className='text-gray-600 text-sm'>Specially designed for flat screen TVs up to 32 inches. Includes protective padding.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('tv-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('tv-box')}</span>
                          <button 
                            onClick={() => updateQuantity('tv-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Wardrobe Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Wardrobe Box (24" x 20" x 48")</h4>
                        <p className='text-gray-600 text-sm'>Perfect for hanging clothes during transport. Includes hanging bar.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('wardrobe-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('wardrobe-box')}</span>
                          <button 
                            onClick={() => updateQuantity('wardrobe-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Dish Pack Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Dish Pack Box (18" x 18" x 16")</h4>
                        <p className='text-gray-600 text-sm'>Heavy-duty box with dividers for fragile dishes and glassware.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('dish-pack-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('dish-pack-box')}</span>
                          <button 
                            onClick={() => updateQuantity('dish-pack-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Large Boxes Tab */}
            {activeTab === 'package' && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Large Boxes</h3>
                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Extra Large Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Extra Large Box (24" x 20" x 16")</h4>
                        <p className='text-gray-600 text-sm'>Our biggest standard box for large items and bulk packing. Maximum weight: 50 lbs.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('extra-large-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('extra-large-box')}</span>
                          <button 
                            onClick={() => updateQuantity('extra-large-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Moving Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Heavy Duty Moving Box (18" x 18" x 24")</h4>
                        <p className='text-gray-600 text-sm'>Reinforced box for heavy items like books, tools, and appliances.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('heavy-duty-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('heavy-duty-box')}</span>
                          <button 
                            onClick={() => updateQuantity('heavy-duty-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Banker Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Banker Box (15" x 12" x 10")</h4>
                        <p className='text-gray-600 text-sm'>Professional storage box with handles, perfect for documents and files.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('banker-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('banker-box')}</span>
                          <button 
                            onClick={() => updateQuantity('banker-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Packing Supplies Tab */}
            {activeTab === 'service' && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Packing Supplies</h3>
                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Bubble Wrap' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Bubble Wrap Roll (12" x 25ft)</h4>
                        <p className='text-gray-600 text-sm'>Premium bubble wrap for protecting fragile items during shipping.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('bubble-wrap', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('bubble-wrap')}</span>
                          <button 
                            onClick={() => updateQuantity('bubble-wrap', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Packing Tape' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Heavy Duty Packing Tape (6-Pack)</h4>
                        <p className='text-gray-600 text-sm'>Strong adhesive tape for securing boxes and packages.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('packing-tape', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('packing-tape')}</span>
                          <button 
                            onClick={() => updateQuantity('packing-tape', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Packing Paper' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Newsprint Packing Paper (25 lbs)</h4>
                        <p className='text-gray-600 text-sm'>Clean newsprint paper for wrapping and cushioning items.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('packing-paper', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('packing-paper')}</span>
                          <button 
                            onClick={() => updateQuantity('packing-paper', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specialty Items Tab */}
            {activeTab === 'additional' && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>Specialty Items</h3>
                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Art Shipping Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Artwork Shipping Box</h4>
                        <p className='text-gray-600 text-sm'>Custom-sized protective box for paintings, prints, and artwork with foam padding.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('artwork-box', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('artwork-box')}</span>
                          <button 
                            onClick={() => updateQuantity('artwork-box', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src={box} alt='Wine Shipping Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Wine Shipping Kit (6-bottle)</h4>
                        <p className='text-gray-600 text-sm'>Specialized box with molded inserts for safe wine bottle transportation.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('wine-kit', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('wine-kit')}</span>
                          <button 
                            onClick={() => updateQuantity('wine-kit', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-lg p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center gap-6'>
                      <div className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <img src='https://via.placeholder.com/96x96/f0f0f0/999?text=Golf+Club+Box' alt='Golf Club Box' className='w-full h-full object-cover rounded-lg' />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold mb-2'>Golf Club Shipping Tube</h4>
                        <p className='text-gray-600 text-sm'>Durable tube for shipping golf clubs and other long sporting equipment.</p>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex items-center border rounded-lg'>
                          <button 
                            onClick={() => updateQuantity('golf-tube', -1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            -
                          </button>
                          <span className='px-4 py-1 border-x'>{getQuantity('golf-tube')}</span>
                          <button 
                            onClick={() => updateQuantity('golf-tube', 1)}
                            className='px-3 py-1 hover:bg-gray-100 text-gray-600'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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