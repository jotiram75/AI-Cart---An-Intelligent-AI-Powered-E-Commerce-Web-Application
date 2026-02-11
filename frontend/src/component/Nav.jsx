import React, { useContext, useState, useEffect } from "react";
import { IoSearchOutline, IoCartOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Nav() {
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      setUserData(null);
      setShowProfile(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const isHome = location.pathname === "/";

  return (
    <>
      {/* Main Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled || !isHome ? "bg-white shadow-md" : "bg-white md:bg-transparent"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer z-50" onClick={() => navigate("/")}>
              <img src="/logo.png" alt="AICart Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className={`text-xl md:text-2xl font-bold tracking-wide font-heading transition-colors ${
                isScrolled || !isHome ? "text-gray-900" : "text-gray-900 md:text-white"
              }`}>
                AICART
              </h1>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/collection' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((item) => (
                <li
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    location.pathname === item.path 
                      ? 'text-primary' 
                      : isScrolled || !isHome 
                        ? 'text-gray-700 hover:text-primary' 
                        : 'text-gray-900 md:text-white hover:text-primary'
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search Icon */}
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  navigate("/collection");
                }}
                className={`p-2 transition-colors ${
                  isScrolled || !isHome ? "text-gray-700 hover:text-primary" : "text-gray-900 md:text-white hover:text-primary"
                }`}
                aria-label="Search"
              >
                <IoSearchOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => navigate("/cart")}
                className={`relative p-2 transition-colors ${
                  isScrolled || !isHome ? "text-gray-700 hover:text-primary" : "text-gray-900 md:text-white hover:text-primary"
                }`}
                aria-label="Cart"
              >
                <IoCartOutline className="w-5 h-5 md:w-6 md:h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* User Profile Icon */}
              <div className="relative">
                {userData ? (
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold hover:bg-gray-800 transition-colors"
                    aria-label="User menu"
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className={`p-2 transition-colors ${
                      isScrolled || !isHome ? "text-gray-700 hover:text-primary" : "text-gray-900 md:text-white hover:text-primary"
                    }`}
                    aria-label="Login"
                  >
                    <IoPersonOutline className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}

                {/* Profile Dropdown */}
                {showProfile && userData && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 animate-fade-in">
                    <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                      Hello, <span className="font-semibold text-gray-900">{userData.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/order");
                        setShowProfile(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = import.meta.env.VITE_ADMIN_URL;
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden p-2 transition-colors ${
                  isScrolled || !isHome ? "text-gray-700" : "text-gray-900 md:text-white"
                }`}
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <IoCloseOutline className="w-6 h-6" />
                ) : (
                  <IoMenuOutline className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <nav className="flex flex-col py-6">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/collection' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-left px-6 py-4 text-base font-semibold uppercase tracking-wider transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary bg-gray-50'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar Overlay */}
      {showSearch && (
        <div className="fixed top-16 md:top-20 left-0 w-full bg-white z-40 shadow-md animate-slide-down py-3">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-2 mx-auto max-w-3xl border border-gray-100 shadow-inner">
              <IoSearchOutline className="text-xl text-gray-500 flex-shrink-0" />
              <input
                type="text"
                className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-400 hover:text-red-500 text-xl flex-shrink-0 transition-colors"
                aria-label="Close search"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
