// Auth debugging utility
export const debugAuthState = () => {
  const userInfo = localStorage.getItem('userInfo');
  const userToken = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  
  console.log('=== AUTH DEBUG ===');
  console.log('localStorage userInfo:', userInfo);
  console.log('localStorage userToken:', userToken);
  console.log('localStorage userRole:', userRole);
  
  if (userToken) {
    try {
      // Decode JWT token to check expiration (note: this is client-side only for debugging)
      const tokenParts = userToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);
        console.log('Token expires at:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Token expired?', payload.exp * 1000 < Date.now());
      }
    } catch (e) {
      console.log('Error decoding token:', e);
    }
  }
  
  console.log('==================');
  
  return {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    userToken,
    userRole,
    hasToken: !!userToken,
    hasUserInfo: !!userInfo
  };
};

// Test API call with current token
export const testApiCall = async () => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    console.log('No token found');
    return false;
  }
  
  try {
    const response = await fetch('http://localhost:9000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        checkoutItems: [],
        shippingAddress: { address: 'test', city: 'test', state: 'CA', zip: '12345', country: 'US' },
        paymentMethod: 'stripe',
        totalPrice: 100
      })
    });
    
    console.log('API Test Response Status:', response.status);
    const data = await response.json();
    console.log('API Test Response:', data);
    
    return response.ok;
  } catch (error) {
    console.log('API Test Error:', error);
    return false;
  }
};
