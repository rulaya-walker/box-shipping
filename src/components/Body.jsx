import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Body = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const navigate = useNavigate();

  // Form states for International Move
  const [shippingForm, setShippingForm] = useState({
    fromCountry: 'uk',
    fromCity: '',
    toCountry: '',
    toCity: ''
  });
  
  // Form states for Domestic Move  
  const [packageForm, setPackageForm] = useState({
    weight: '',
    dimensions: '',
    contents: '',
    value: ''
  });
  
  const countries = [
    'Australia',
    'Bahrain',
    'Canada',
    'USA',
    'Dubai',
    'Hong Kong',
    'Japan',
    'Malaysia',
    'New Zealand',
    'Singapore',
    'South Africa'
  ];

  // Handle form input changes
  const handleShippingFormChange = (field, value) => {
    setShippingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePackageFormChange = (field, value) => {
    setPackageForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle proceed button clicks
  const handleShippingProceed = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      type: 'international',
      fromCountry: shippingForm.fromCountry,
      fromCity: shippingForm.fromCity,
      toCountry: shippingForm.toCountry,
      toCity: shippingForm.toCity
    }).toString();
    
    navigate(`/new-quote?${queryParams}`);
  };

  const handlePackageProceed = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      type: 'domestic',
      weight: packageForm.weight,
      dimensions: packageForm.dimensions,
      contents: packageForm.contents,
      value: packageForm.value
    }).toString();
    
    navigate(`/new-quote?${queryParams}`);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-12 max-w-7xl mx-auto relative clip-path'>
        <div className='w-xl mx-auto flex flex-col justify-center'>
            <h2 className='text-black text-2xl lg:text-4xl font-semibold mb-4'>Moving made easy</h2>
            <p className='text-black text-xl lg:text-2xl mb-6'>
All your belongings sent across the globe with peace of mind. Get your free quote in minutes!
</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
            {/* Tab Navigation removed: Only International Move remains */}

            {/* Only International Move form remains */}
            <form className='space-y-4' onSubmit={handleShippingProceed}>
                <p className='text-md font-semibold'>From country and town:</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='mb-4'>
                        <select 
                            className='w-full p-2 border border-gray-300 rounded bg-white'
                            value={shippingForm.fromCountry}
                            onChange={(e) => handleShippingFormChange('fromCountry', e.target.value)}
                        >
                            <option value='uk'>UK</option>
                        </select>
                    </div>
                    <div className='mb-4'>
                        <input 
                            type='text' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            placeholder='City, town or zip / postcode'
                            value={shippingForm.fromCity}
                            onChange={(e) => handleShippingFormChange('fromCity', e.target.value)}
                        />
                    </div>
                </div>

                <p className='text-md font-semibold'>To country and town:</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='mb-4'>
                        <select 
                            className='w-full p-2 border border-gray-300 rounded bg-white'
                            value={shippingForm.toCountry}
                            onChange={(e) => handleShippingFormChange('toCountry', e.target.value)}
                        >
                            <option value=''>Select Country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <input 
                            type='text' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            placeholder='City, town or zip / postcode'
                            value={shippingForm.toCity}
                            onChange={(e) => handleShippingFormChange('toCity', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className='mt-6'>
                    <button 
                        type='submit'
                        className='w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold cursor-pointer'
                    >
                        Proceed
                    </button>
                </div>
            </form>

            {/* {activeTab === 'package' && (
                <form onSubmit={handlePackageProceed}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='weight'>Weight (lbs)</label>
                            <input 
                                type='number' 
                                id='weight' 
                                className='w-full p-2 border border-gray-300 rounded' 
                                placeholder='Enter package weight'
                                value={packageForm.weight}
                                onChange={(e) => handlePackageFormChange('weight', e.target.value)}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='dimensions'>Dimensions (L x W x H)</label>
                            <input 
                                type='text' 
                                id='dimensions' 
                                className='w-full p-2 border border-gray-300 rounded' 
                                placeholder='e.g., 12 x 8 x 6 inches'
                                value={packageForm.dimensions}
                                onChange={(e) => handlePackageFormChange('dimensions', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='contents'>Package Contents</label>
                        <textarea 
                            id='contents' 
                            rows='3' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            placeholder='Describe package contents'
                            value={packageForm.contents}
                            onChange={(e) => handlePackageFormChange('contents', e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='value'>Declared Value ($)</label>
                        <input 
                            type='number' 
                            id='value' 
                            className='w-full p-2 border border-gray-300 rounded' 
                            placeholder='Enter package value'
                            value={packageForm.value}
                            onChange={(e) => handlePackageFormChange('value', e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className='mt-6'>
                        <button 
                            type='submit'
                            className='w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold'
                        >
                            Proceed
                        </button>
                    </div>
                </form>
            )} */}

            {/* {activeTab === 'tracking' && (
                <div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='trackingNumber'>Tracking Number</label>
                        <input type='text' id='trackingNumber' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter tracking number' />
                    </div>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4'>
                        Track Package
                    </button>
                    <div className='bg-gray-50 p-4 rounded'>
                        <h3 className='font-semibold mb-2'>Tracking Status</h3>
                        <p className='text-gray-600'>Enter a tracking number to see package status</p>
                    </div>
                </div>
            )} */}
        </div>
    </div>
  )
}

export default Body