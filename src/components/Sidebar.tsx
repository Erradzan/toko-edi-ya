import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/Darkmode';
import { FaHome, FaShoppingCart, FaMoon, FaSun, FaUser, FaList, FaDollarSign, FaInstagram, FaTwitter, FaFacebook} from 'react-icons/fa';
import Logo from '../support/Logo.png';
import { useCart } from '../context/CartContext';

const Sidebar: React.FC = () => {
  const { logout, userRole} = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useCart();
  const navigate = useNavigate();
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleCartIconClick = () => {
    navigate('/cart');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 p-0 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className={`top-4 left-0 z-50 flex space-x-2 bg-white`}>
            <img src={Logo} alt="Logo" className="w-15 h-5 sm:h-8 sm:w-45 md:h-10 md:w-50 lg:h-10 lg:w-50 xl:h-10 xl:w-50" />
          </div>
          <div className="fixed top-4 right-4 z-50 flex space-x-2">
            {userRole === 'seller' ? (
              <>
                <button 
                  onClick={logout}
                  className={`p-2 focus:outline-none  bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-8 w-24 sm:h-8 sm:w-24 md:h-10 md:w-50 lg:h-10 lg:w-50 xl:h-10 xl:w-50`}>
                  <span>Sign Out</span>
                </button>
              </>
            ) : userRole === 'customer' ? (
              <>
                <div className="relative">
                  <FaShoppingCart
                    size={36}
                    className={`transition-colors duration-200 cursor-pointer ${cartItemCount > 0 ? 'text-[#f03846]' : 'text-gray-500'}`}
                    onClick={handleCartIconClick}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <button 
                  onClick={logout}
                  className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-10 w-30`}>
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-8 w-30`}>
                  <Link to="/signin">
                    <span>Sign In</span>
                  </Link>
                </button>
                <button className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-8 w-30`}>
                  <Link to="/signup">
                    <span>Sign Up</span>
                  </Link>
                </button>
              </>
            )}
            <button 
              onClick={toggleSidebar} 
              className={`p-2 focus:outline-none bg-gray-200 dark:bg-[#40b446] text-gray-800 dark:text-gray-200 rounded-md flex flex-col justify-center items-center h-18 w-10 ${isSidebarOpen ? 'z-30' : 'z-50'}`}>
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
          <li>
            <button onClick={() => { toggleTheme(); toggleSidebar(); }} className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500">
              {isDarkMode ? <FaSun /> : <FaMoon />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </li>
          {userRole === 'customer' && (
            <>
              <li>
                <Link to="/profile" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/order" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                  <FaList />
                  <span>Orders</span>
                </Link>
              </li>
            </>
          )}

          {userRole === 'seller' && (
            <>
              <li>
                <Link to="/profile" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/order" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                  <FaList />
                  <span>Orders</span>
                </Link>
              </li>
              <li>
                <Link to="/revenue" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-blue-500" onClick={toggleSidebar}>
                  <FaDollarSign />
                  <span>Revenue</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="absolute bottom-4 w-full text-center text-gray-800 dark:text-gray-200">
          <div className="flex justify-center space-x-4">
            <a href="https://instagram.com/TokoEdiYa" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram size={24} />
              <span className="sr-only">@TokoEdiYa</span>
            </a>
            <a href="https://twitter.com/TokoEdiYa" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTwitter size={24} />
              <span className="sr-only">@TokoEdiYa</span>
            </a>
            <a href="https://facebook.com/TokoEdiYa" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebook size={24} />
              <span className="sr-only">Toko Edi Ya</span>
            </a>
          </div>
          <div className="mt-2 text-sm">+6221-2233-3444</div>
          <div className="mt-1 text-xs">Jl. Kebenaran Nomor VI RT 6 RW 6 Jakarta Barat Daya</div>
        </div>
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