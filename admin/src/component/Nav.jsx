import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { adminDataContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import {
  IoLogOutOutline,
  IoGlobeOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";

function Nav() {
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let { getAdmin } = useContext(adminDataContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(result.data);
      toast.success("LogOut Successfully");
      getAdmin();
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("LogOut Failed");
    }
  };

  return (
    <nav className="w-full h-[70px] bg-white shadow-md fixed top-0 left-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {showMobileMenu ? (
              <IoCloseOutline className="w-6 h-6" />
            ) : (
              <IoMenuOutline className="w-6 h-6" />
            )}
          </button>

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="AICart Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                AICART
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors text-sm active:bg-gray-100"
            onClick={() =>
              (window.location.href = import.meta.env.VITE_FRONTEND_URL)
            }
          >
            <IoGlobeOutline className="w-5 h-5" />
            <span className="hidden sm:inline">Website</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md text-sm active:bg-gray-700"
            onClick={logOut}
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 top-[70px] bg-black/50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </nav>
  );
}

export default Nav;
