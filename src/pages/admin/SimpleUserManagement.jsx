import React from 'react';

const SimpleUserManagement = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Simple User Management Test</h1>
      <p className="mt-2 text-gray-600">This is a simple test component to verify routing works.</p>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Test Information:</h2>
        <ul className="space-y-2">
          <li>✅ Route is working</li>
          <li>✅ Component is loading</li>
          <li>✅ CSS classes are applying</li>
        </ul>
      </div>
      
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default SimpleUserManagement;
