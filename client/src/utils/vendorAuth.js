// client/src/utils/vendorAuth.js
// ✅ SIMPLIFIED Vendor Authentication Utility

/**
 * Store vendor session
 */
export const loginVendor = (vendorData, token) => {
  try {
    // Store token and vendor data
    localStorage.setItem('vendorToken', token);
    localStorage.setItem('vendorData', JSON.stringify(vendorData));
    
    console.log('✅ Vendor logged in successfully');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Clear vendor session
 */
export const logoutVendor = () => {
  try {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    
    console.log('✅ Vendor logged out');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Get current vendor data
 */
export const getCurrentVendor = () => {
  try {
    const vendorDataString = localStorage.getItem('vendorData');
    
    if (!vendorDataString) {
      return null;
    }
    
    return JSON.parse(vendorDataString);
  } catch (error) {
    console.error('Get vendor error:', error);
    return null;
  }
};

/**
 * Get current vendor token
 */
export const getCurrentVendorToken = () => {
  try {
    return localStorage.getItem('vendorToken');
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

/**
 * Check if vendor is logged in
 */
export const isVendorLoggedIn = () => {
  const token = getCurrentVendorToken();
  const vendor = getCurrentVendor();
  
  return !!(token && vendor);
};

export default {
  loginVendor,
  logoutVendor,
  getCurrentVendor,
  getCurrentVendorToken,
  isVendorLoggedIn
};