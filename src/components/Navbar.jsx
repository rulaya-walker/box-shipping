import { useState } from "react";
import { RiCloseFill, RiMenuFill } from "react-icons/ri";
import logo from "../assets/logo.png"; // Assuming you have a logo image

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center w-full bg-white text-[#605F5E] md:mh-2 p-4 shadow-md">
        <div className="bg-primary p-2 rounded-lg">
            <a href="#"><img src={logo} alt="Logo" className="h-8" /></a>
        </div>
        <div className="hidden md:flex space-x-4">
            <a href="#" className= "hover:text-stone-400 transition-colors duration-300">
                My Account
            </a>
            <a href="#" className="hover:text-stone-400 transition-colors duration-300">
                Home
            </a>
        </div>

        <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none" aria-label={menuOpen ? "Close menu" : "Open menu"}>
                {menuOpen ? (<RiCloseFill className="w-6 h-6 cursor-pointer" />) : (<RiMenuFill className="w-6 h-6 cursor-pointer" />)}
            </button>
        </div>

        </div>
        {menuOpen && (
            <div className="md:hidden backdrop-blur-lg p-4 rounded-xl flex flex-col space-y-4 max-w-6xl mx-auto">
                <ul className="space-y-2">
                        <li>
                            <a href="#" className="text-white hover:text-primary transition-colors duration-300 block">
                                My Account 
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-white hover:text-primary transition-colors duration-300 block">
                                Home
                            </a>
                        </li>
                </ul>
            </div>
        )}
    </nav>
  )
}

export default Navbar