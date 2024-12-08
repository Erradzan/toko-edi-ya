import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/Darkmode';
import { FaHome, FaProductHunt, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaMoon, FaSun, FaUser } from 'react-icons/fa';
import Logo from '../support/Logo.png';

const Sidebar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className={`top-4 left-0 z-50 flex space-x-2 bg-white`}>
            <img src={Logo} alt="Logo" className="w-50 h-14" />
          </div>
          <div className="fixed top-4 right-4 z-50 flex space-x-2">
            <button className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-10 w-50`}>
              <Link to="/signin">
                <span>Sign In</span>
              </Link>
            </button>
            <button className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-10 w-30`}>
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </button>
            <button 
              onClick={toggleSidebar} 
              className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-10 w-10 ${isSidebarOpen ? 'z-30' : 'z-50'}`}>
              <span className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-current my-1 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 w-64 h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex items-center ${isSidebarOpen ? '-translate-x-0' : 'translate-x-full'} ${
          isDarkMode ? 'bg-gray-800' : 'bg-[#40b446]'}`}>
        <ul className="space-y-6 w-full">
          <li>
            <Link to="/" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
              <FaHome />
              <span>Homepage</span>
            </Link>
          </li>
          {isAuthenticated && (
          <>
            <li>
              <Link to="/products" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                <FaProductHunt />
                <span>Product</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                <FaShoppingCart />
                <span>Cart</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                <FaUser />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <button onClick={() => { logout(); toggleSidebar(); }} className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500">
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </li>
          </>
          )}
          {!isAuthenticated && (
          <>
            <li>
              <Link to="/signin" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            </li>
            <li>
              <Link to="/signup" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                <FaUserPlus />
                <span>Sign Up</span>
              </Link>
            </li>
          </>
          )}
            <li>
              <button onClick={() => { toggleTheme(); toggleSidebar(); }} className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500">
                {isDarkMode ? <FaSun /> : <FaMoon />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </li>
          </ul>
        </div>

        {isSidebarOpen && (
          <div 
            onClick={toggleSidebar} 
            className="fixed inset-0 bg-black opacity-50 z-30"
          ></div>
        )}
    </>
  );
};

export default Sidebar;