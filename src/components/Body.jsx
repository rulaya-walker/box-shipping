import React, { useState } from 'react'

const Body = () => {
  const [activeTab, setActiveTab] = useState('shipping');

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-12 w-full bg-primary relative clip-path'>
        <div className='w-xl mx-auto flex flex-col justify-center'>
            <h2 className='text-white text-2xl lg:text-4xl font-semibold mb-4'>Moving made easy</h2>
            <p className='text-white text-xl lg:text-2xl mb-6'>
All your belongings sent across the globe with peace of mind. Get your free quote in minutes!
</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
            {/* Tab Navigation */}
            <div className='border-b border-gray-200 mb-6'>
                <nav className='-mb-px flex space-x-8'>
                    <button
                        onClick={() => setActiveTab('shipping')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'shipping'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        International Move
                    </button>
                    <button
                        onClick={() => setActiveTab('package')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'package'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Domestic Move
                    </button>
                    <button
                        onClick={() => setActiveTab('tracking')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'tracking'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Student Storage
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'shipping' && (
                <form className='space-y-4'>
                    <p className='text-md font-semibold'>From country and town:</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='mb-4'>
                            <input type='text' id='name' className='w-full p-2 border border-gray-300 rounded' placeholder='Country Name' />
                        </div>
                        <div className='mb-4'>
                            <input type='text' id='city' className='w-full p-2 border border-gray-300 rounded' placeholder='City,town or zip / postcode' />
                        </div>
                    </div>

                    <p className='text-md font-semibold'>To country and town:</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='mb-4'>
                            <input type='text' id='name' className='w-full p-2 border border-gray-300 rounded' placeholder='Country Name' />
                        </div>
                        <div className='mb-4'>
                            <input type='text' id='city' className='w-full p-2 border border-gray-300 rounded' placeholder='City,town or zip / postcode' />
                        </div>
                    </div>
                </form>
            )}

            {activeTab === 'package' && (
                <form>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='weight'>Weight (lbs)</label>
                            <input type='number' id='weight' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter package weight' />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='dimensions'>Dimensions (L x W x H)</label>
                            <input type='text' id='dimensions' className='w-full p-2 border border-gray-300 rounded' placeholder='e.g., 12 x 8 x 6 inches' />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='contents'>Package Contents</label>
                        <textarea id='contents' rows='3' className='w-full p-2 border border-gray-300 rounded' placeholder='Describe package contents'></textarea>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='value'>Declared Value ($)</label>
                        <input type='number' id='value' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter package value' />
                    </div>
                </form>
            )}

            {activeTab === 'tracking' && (
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
            )}
        </div>
    </div>
  )
}

export default Body