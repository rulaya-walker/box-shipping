import { useState } from 'react';
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaTimes, 
  FaShieldAlt,
  FaKey,
  FaHistory
} from 'react-icons/fa';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password requirements
  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters long', regex: /.{8,}/ },
    { id: 'uppercase', text: 'Contains uppercase letter', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'Contains lowercase letter', regex: /[a-z]/ },
    { id: 'number', text: 'Contains a number', regex: /\d/ },
    { id: 'special', text: 'Contains special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  // Recent password changes (mock data)
  const passwordHistory = [
    { date: '2025-06-15', success: true, ip: '192.168.1.100' },
    { date: '2025-03-22', success: true, ip: '192.168.1.105' },
    { date: '2024-12-10', success: false, ip: '192.168.1.200' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    } else {
      // Check password requirements
      const failedRequirements = passwordRequirements.filter(
        req => !req.regex.test(formData.newPassword)
      );
      if (failedRequirements.length > 0) {
        newErrors.newPassword = 'Password does not meet all requirements';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API response
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setSuccessMessage('Password updated successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    const requirements = passwordRequirements.filter(req => req.regex.test(password));
    const strength = requirements.length;
    
    if (strength < 2) return { level: 'weak', color: 'red', width: '25%' };
    if (strength < 4) return { level: 'fair', color: 'yellow', width: '50%' };
    if (strength < 5) return { level: 'good', color: 'blue', width: '75%' };
    return { level: 'strong', color: 'green', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="mt-2 text-gray-600">Update your password and manage security preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FaKey className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <FaTimes className="h-5 w-5 text-red-400 mr-3" />
                      <p className="text-sm font-medium text-red-800">{errors.general}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.currentPassword
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.current ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.newPassword
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.new ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                              style={{ width: passwordStrength.width }}
                            />
                          </div>
                          <span className={`text-xs font-medium text-${passwordStrength.color}-600 capitalize`}>
                            {passwordStrength.level}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.confirmPassword
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.confirm ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Password...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FaLock className="h-4 w-4 mr-2" />
                          Update Password
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Password Requirements */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FaShieldAlt className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Password Requirements</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {passwordRequirements.map((requirement) => {
                    const isMet = formData.newPassword && requirement.regex.test(formData.newPassword);
                    return (
                      <li key={requirement.id} className="flex items-center space-x-2">
                        {isMet ? (
                          <FaCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FaTimes className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={`text-sm ${isMet ? 'text-green-700' : 'text-gray-600'}`}>
                          {requirement.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security Tips</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use a unique password that you don't use anywhere else</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Consider using a password manager to generate and store strong passwords</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Enable two-factor authentication for additional security</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Update your password regularly, especially if you suspect it's been compromised</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Password History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FaHistory className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Changes</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {passwordHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 font-mono text-xs">{entry.ip}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {entry.success ? (
                          <FaCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FaTimes className="h-4 w-4 text-red-500" />
                        )}
                        <span className={entry.success ? 'text-green-600' : 'text-red-600'}>
                          {entry.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
