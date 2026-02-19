import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';
import { IoGridOutline, IoLogOutOutline, IoPersonOutline, IoLockClosedOutline, IoBagHandleOutline, IoCartOutline, IoPeopleOutline } from "react-icons/io5";

const SuperAdmin = () => {
    const { serverUrl } = useContext(authDataContext);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('superAdminAuth') === 'true');
    const [authData, setAuthData] = useState({ email: '', password: '' });

    // Active Tab
    const [activeTab, setActiveTab] = useState('vendors'); // 'vendors', 'products', 'orders'

    // Fetch Data Functions
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/vendor/all`); 
            if (response.data.success) {
                setVendors(response.data.vendors);
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error("Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            if (activeTab === 'vendors') fetchVendors();
            if (activeTab === 'products') fetchProducts();
        }
    }, [isLoggedIn, activeTab]);

    const handleLoginChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const envPass = import.meta.env.VITE_ADMIN_PASSWORD;

        if (authData.email === envEmail && authData.password === envPass) {
            sessionStorage.setItem('superAdminAuth', 'true');
            setIsLoggedIn(true);
            toast.success("Welcome, Super Admin");
        } else {
            toast.error("Invalid Credentials");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('superAdminAuth');
        setIsLoggedIn(false);
        toast.info("Logged out");
    };

    const handleStatusChange = async (vendorId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'rejected' : 'active'; 
        try {
            const response = await axios.post(`${serverUrl}/api/vendor/update-status`, { vendorId, status: newStatus });
            if (response.data.success) {
                toast.success(`Vendor updated to ${newStatus}`);
                fetchVendors(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };

    // Render Login Form if not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <IoLockClosedOutline className="text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Super Admin Access</h2>
                        <p className="text-sm text-gray-500">Restricted Area</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                onChange={handleLoginChange} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                onChange={handleLoginChange} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-md">
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Sidebar Overlay */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
                ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col
            `}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-800">AICart Admin</h1>
                    </div>
                    <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500">
                        <IoLogOutOutline className="w-6 h-6 rotate-180" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => { setActiveTab('vendors'); setShowSidebar(false); }}
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'vendors' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <IoPeopleOutline /> Vendors
                    </button>
                    <button 
                        onClick={() => { setActiveTab('products'); setShowSidebar(false); }}
                        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <IoBagHandleOutline /> All Products
                    </button>
                </nav>
                 <div className="p-4 border-t border-gray-100">
                     <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <IoLogOutOutline /> Logout
                    </button>
                 </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full overflow-hidden">
                {/* Header */}
                <header className="bg-white px-4 md:px-8 py-4 border-b border-gray-200 flex justify-between items-center text-sm md:text-base">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="md:hidden text-gray-600"
                        >
                            <IoGridOutline className="w-6 h-6" />
                        </button>
                        <h2 className="font-semibold text-gray-700">Super Admin Dashboard</h2>
                    </div>
                    <div className="text-gray-500 hidden sm:block">Welcome, Super Admin</div>
                </header>

                {/* Content */}
                <div className="p-4 md:p-8 h-[calc(100vh-70px)] overflow-auto">
                    
                    {/* Vendors Tab */}
                    {activeTab === 'vendors' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Vendor Applications</h3>
                                <div className="text-sm text-gray-500">Total: {vendors.length}</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Seller Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Store Name</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                                        ) : vendors.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-8">No vendors found.</td></tr>
                                        ) : (
                                            vendors.map((vendor) => (
                                                <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                                                    <td className="px-6 py-4">{vendor.email}</td>
                                                    <td className="px-6 py-4">{vendor.storeName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                            vendor.status === 'active' ? 'bg-green-100 text-green-700' : 
                                                            vendor.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {vendor.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleStatusChange(vendor._id, vendor.status)}
                                                            className={`text-xs font-bold px-3 py-1 rounded border transition-colors ${
                                                                vendor.status === 'active' 
                                                                    ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                                                    : 'border-green-200 text-green-600 hover:bg-green-50'
                                                            }`}
                                                        >
                                                            {vendor.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">All Products</h3>
                                <div className="text-sm text-gray-500">Total: {products.length}</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Image</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Vendor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                         {loading ? (
                                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                                        ) : products.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-8">No products found.</td></tr>
                                        ) : (
                                            products.map((item) => (
                                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <img src={item.image[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-6 py-4">{item.category}</td>
                                                    <td className="px-6 py-4">₹{item.price}</td>
                                                     <td className="px-6 py-4">
                                                        {item.vendorId ? <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Vendor Item</span> : <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Admin Item</span>}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;
