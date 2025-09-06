import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { 
  FaUser,
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaShippingFast,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Get the intended destination from location state (includes query params)
  const from = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const [showPasswords, setShowPasswords] = useState({
    password: false
  });

  const [errors, setErrors] = useState({});

  // Redirect if user is already logged in
  // Get redirect param from query string
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');

  useEffect(() => {
    if (user) {
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        // If user just registered, default to /checkout if coming from payment
        navigate('/checkout', { replace: true });
      }
    }
  }, [user, navigate, redirect, from]);

  // Password requirements
  const passwordRequirements = [
    { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'One lowercase letter', regex: /[a-z]/ },
    { id: 'number', text: 'One number', regex: /\d/ },
    { id: 'special', text: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = passwordRequirements.filter(
        req => !req.regex.test(formData.password)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        subscribeNewsletter: formData.subscribeNewsletter
      })).unwrap();
      
      // Success - user will be redirected by useEffect
      console.log('Registration successful:', result);
    } catch (error) {
      setErrors({ general: error || 'Registration failed. Please try again.' });
    }
  };

  const handleSocialRegister = (provider) => {
    alert(`${provider} registration coming soon!`);
  };

  const getPasswordStrength = (password) => {
    const requirements = passwordRequirements.filter(req => req.regex.test(password));
    const strength = requirements.length;
    
    if (strength < 2) return { level: 'weak', color: 'red', width: '25%' };
    if (strength < 4) return { level: 'fair', color: 'yellow', width: '50%' };
    if (strength < 5) return { level: 'good', color: 'blue', width: '75%' };
    return { level: 'strong', color: 'green', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
    <Navbar />
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <FaShippingFast className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">BoxShip</span>
          </div>
        </div> */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {(from && from.includes('/new-quote')) && (
          <div className="mt-3 text-center p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              🚀 Create an account to access the quote builder and start planning your shipment
            </p>
          </div>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">



          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error */}
            {(errors.general || error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{errors.general || error}</div>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPasswords.password ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPasswords.password ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
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
                  
                  {/* Password Requirements */}
                  <div className="grid grid-cols-1 gap-1">
                    {passwordRequirements.map((requirement) => {
                      const isMet = requirement.regex.test(formData.password);
                      return (
                        <div key={requirement.id} className="flex items-center space-x-1">
                          {isMet ? (
                            <FaCheck className="h-3 w-3 text-green-500" />
                          ) : (
                            <FaTimes className="h-3 w-3 text-gray-300" />
                          )}
                          <span className={`text-xs ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
                            {requirement.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-primary-dark">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary-dark">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
              )}


            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
};

export default Register;
