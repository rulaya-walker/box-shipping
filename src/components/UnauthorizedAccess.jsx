import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSignInAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';

const UnauthorizedAccess = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <FaExclamationTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                {user 
                  ? "Your current account doesn't have the required permissions to access this area."
                  : "Please sign in with an account that has the appropriate permissions."
                }
              </p>
              
              <div className="space-y-3">
                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/user/account'}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaHome className="mr-2" />
                      Go to Dashboard
                    </Link>
                    <Link
                      to="/"
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Back to Home
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaSignInAlt className="mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/"
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Back to Home
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UnauthorizedAccess;
