import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';
import { IoEyeOutline, IoEyeOffOutline, IoMailOutline } from "react-icons/io5";
import logo from '../assets/logo.png';

const SellerLogin = () => {
    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/api/vendor/login`, formData);
            if (response.data.success) {
                toast.success("Welcome back!");
                localStorage.setItem('token', response.data.token); // Admin context uses 'token'
                // Force reload or navigation to trigger AdminContext update
                window.location.href = '/'; 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            {/* Navbar */}
            <nav className="w-full h-[70px] bg-white shadow-md fixed top-0 left-0 z-50 border-b border-gray-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
                <div className="flex items-center gap-3">
                     <img src={logo} alt="AICart Logo" className="w-10 h-10" />
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tight">AICART</h1>
                        <p className="text-xs text-[#717fe0] font-bold uppercase tracking-wider">Seller Panel</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                   <button
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-[#717fe0] hover:text-[#717fe0] transition-colors text-sm active:bg-gray-100"
                    onClick={() => (window.location.href = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173')}
                  >
                    <span className="hidden sm:inline">Website</span>
                  </button>
                </div>
            </nav>

            <div className="max-w-md w-full space-y-8 mt-20">
                {/* Header Section */}
                <div className="text-center">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Sign In
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to manage your store
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoMailOutline className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#717fe0] focus:border-[#717fe0] sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="seller@aicart.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span> 
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#717fe0] focus:border-[#717fe0] sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <IoEyeOffOutline className="h-5 w-5 text-gray-400" /> : <IoEyeOutline className="h-5 w-5 text-gray-400" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                {/* Removed 'Create Account' link since registration is on frontend */}
                                <a href="http://localhost:5173/become-seller" className="font-semibold text-[#717fe0] hover:text-[#5b68c0]">
                                    New seller? Create account
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#1a1f36] hover:bg-[#2e3658] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1f36] transition-all disabled:opacity-70 transform active:scale-[0.98]"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <button
                            onClick={() => window.location.href = import.meta.env.VITE_FRONTEND_URL + '/super-admin' || 'http://localhost:5173/super-admin'}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        >
                            Super Admin Access
                        </button>
                    </div>
                </div>
                
                 <div className="text-center">
                    <p className="text-xs text-gray-400">
                        © 2026 AICart. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
