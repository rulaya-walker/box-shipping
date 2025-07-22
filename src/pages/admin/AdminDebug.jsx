import React from 'react';
import { useSelector } from 'react-redux';

const AdminDebug = () => {
  const auth = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);

  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Auth State:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(auth, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Admin State:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(admin, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">localStorage:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({
              userInfo: localStorage.getItem('userInfo'),
              userToken: localStorage.getItem('userToken'),
              userRole: localStorage.getItem('userRole')
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug;
