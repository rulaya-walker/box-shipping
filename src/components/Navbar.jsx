import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { RiCloseFill, RiMenuFill, RiUserLine, RiLogoutBoxLine, RiDashboardLine } from "react-icons/ri";
import logo from "../assets/logo.png"; // Assuming you have a logo image

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const isLoggedIn = !!user;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        // Show confirmation dialog
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
            setMenuOpen(false); // Close mobile menu if open
            navigate('/');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center w-full bg-white text-[#605F5E] md:mh-2 p-4 shadow-md">
        <div className="bg-primary p-2 rounded-lg">
            <Link to="/"><img src={logo} alt="Logo" className="h-8" /></Link>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:text-stone-400 transition-colors duration-300">
                Home
            </Link>
            {isLoggedIn ? (
                <>
                    {user?.role === 'admin' ? (
                        <Link to="/admin" className="hover:text-stone-400 transition-colors duration-300 flex items-center gap-1">
                            <RiDashboardLine className="w-4 h-4" />
                            Admin Dashboard
                        </Link>
                    ) : (
                        <Link to="/user/account" className="hover:text-stone-400 transition-colors duration-300 flex items-center gap-1">
                            <RiUserLine className="w-4 h-4" />
                            My Account
                        </Link>
                    )}
                    <span className="text-sm text-gray-600 hidden lg:block">
                        Welcome, {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="hover:text-stone-400 transition-colors duration-300 flex items-center gap-1"
                        title="Logout"
                    >
                        <RiLogoutBoxLine className="w-4 h-4" />
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <button 
                        onClick={handleLogin}
                        className="hover:text-stone-400 transition-colors duration-300"
                    >
                        Login
                    </button>
                    <Link 
                        to="/register" 
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </div>

        <div className="md:hidden">
            <button onClick={toggleMenu} className="text-[#605F5E] focus:outline-none" aria-label={menuOpen ? "Close menu" : "Open menu"}>
                {menuOpen ? (<RiCloseFill className="w-6 h-6 cursor-pointer" />) : (<RiMenuFill className="w-6 h-6 cursor-pointer" />)}
            </button>
        </div>

        </div>
        {menuOpen && (
            <div className="md:hidden bg-white shadow-lg p-4 flex flex-col space-y-4">
                <ul className="space-y-2">
                    <li>
                        <Link to="/" className="text-[#605F5E] hover:text-primary transition-colors duration-300 block">
                            Home
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li>
                                {user?.role === 'admin' ? (
                                    <Link to="/admin" className="text-[#605F5E] hover:text-primary transition-colors duration-300 flex items-center gap-1">
                                        <RiDashboardLine className="w-4 h-4" />
                                        Admin Dashboard 
                                    </Link>
                                ) : (
                                    <Link to="/user/account" className="text-[#605F5E] hover:text-primary transition-colors duration-300 flex items-center gap-1">
                                        <RiUserLine className="w-4 h-4" />
                                        My Account 
                                    </Link>
                                )}
                            </li>
                            <li className="text-sm text-gray-600 px-2">
                                Welcome, {user?.name?.split(' ')[0] || 'User'}
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="text-[#605F5E] hover:text-primary transition-colors duration-300 flex items-center gap-1 w-full text-left"
                                    title="Logout"
                                >
                                    <RiLogoutBoxLine className="w-4 h-4" />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button 
                                    onClick={handleLogin}
                                    className="text-[#605F5E] hover:text-primary transition-colors duration-300 block w-full text-left"
                                >
                                    Login
                                </button>
                            </li>
                            <li>
                                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300 block text-center">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        )}
    </nav>
  )
}

export default Navbar