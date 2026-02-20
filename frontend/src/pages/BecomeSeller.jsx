import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';

const BecomeSeller = () => {
    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        storeName: '',
        mobile: '',
        gstin: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/api/vendor/register`, formData);
            if (response.data.success) {
                toast.success("Application Submitted! Status: Pending Approval.");
                // Redirect to Admin Panel Login
                const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';
                window.location.href = `${adminUrl}/seller-login`; 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
             <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                
                {/* Left Side - Visuals */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-[#717fe0] to-[#8d99e8] text-white p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">
                     {/* Decorative Circles */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                     <div className="absolute bottom-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>

                    <div className="z-10">
                        <h2 className="text-3xl font-extrabold mb-4">Grow Your Business with AICart</h2>
                        <p className="text-blue-100 text-sm leading-relaxed mb-8">
                            Join thousands of sellers who trust AICart to reach millions of customers. Simple registration, powerful tools, and dedicated support.
                        </p>
                    </div>

                    <div className="z-10">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🚀</div>
                            <div>
                                <h4 className="font-bold">Fast Onboarding</h4>
                                <p className="text-xs text-blue-100">Start selling in minutes</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">💰</div>
                            <div>
                                <h4 className="font-bold">No Fees</h4>
                                <p className="text-xs text-blue-100">Maximize your profits</p>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-6 md:p-10 bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Seller Registration</h2>
                        <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">Free to Join</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                                <input type="text" name="name" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Store Name</label>
                                <input type="text" name="storeName" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="John's Shop" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                            <input type="email" name="email" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="john@example.com" />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mobile</label>
                                <input type="tel" name="mobile" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="9876543210" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">GSTIN</label>
                                <input type="text" name="gstin" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="GSTIN12345" />
                            </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                            <input type="password" name="password" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all" placeholder="••••••••" />
                        </div>
                        
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Address</label>
                             <textarea name="address" required onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:bg-white focus:border-[#717fe0] focus:ring-1 focus:ring-[#717fe0] outline-none transition-all resize-none" placeholder="Business address..." rows="2"></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full bg-[#717fe0] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#5b68c0] transition-transform transform active:scale-[0.99] disabled:opacity-70">
                                {loading ? "Creating Account..." : "Register Now"}
                            </button>
                        </div>
                    </form>
                     <p className="text-center text-sm text-gray-500 mt-6">
                        Already a seller? <span onClick={() => window.location.href = (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174') + '/seller-login'} className="text-[#717fe0] font-bold cursor-pointer hover:underline">Log in here</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BecomeSeller;
