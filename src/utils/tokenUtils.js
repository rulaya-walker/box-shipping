// Token utility functions - Pure JavaScript only (no JSX)

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    
    if (!payload.exp) {
      return true;
    }
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration date
 * @param {string} token - The JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) {
    return null;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    
    if (!payload.exp) {
      return null;
    }
    
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Get time until token expires
 * @param {string} token - The JWT token
 * @returns {number} - Milliseconds until expiration, or 0 if expired
 */
export const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return 0;
  }
  
  const timeLeft = expiration.getTime() - Date.now();
  return Math.max(0, timeLeft);
};

/**
 * Check if token will expire soon (within next 5 minutes)
 * @param {string} token - The JWT token
 * @returns {boolean} - True if token expires within 5 minutes
 */
export const isTokenExpiringSoon = (token) => {
  const timeLeft = getTimeUntilExpiration(token);
  return timeLeft < 5 * 60 * 1000; // 5 minutes in milliseconds
};

/**
 * Extract user information from token payload
 * @param {string} token - The JWT token
 * @returns {object|null} - User payload or null if invalid
 */
export const getTokenPayload = (token) => {
  if (!token) {
    return null;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }
    
    return JSON.parse(atob(tokenParts[1]));
  } catch (error) {
    console.error('Error extracting token payload:', error);
    return null;
  }
};
