import React, { useState } from "react";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { adminDataContext } from "../context/AdminContext";
import { IoGridOutline, IoReceiptOutline, IoTrendingUpOutline } from "react-icons/io5";

function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { token, adminData } = useContext(adminDataContext);

  const fetchCounts = async () => {
    try {
      const products = await axios.get(
        `${serverUrl}/api/product/vendor-list`,
        { headers: { token } }
      );
      setTotalProducts(products.data.products?.length || 0);

      const orders = await axios.post(
        `${serverUrl}/api/order/vendor-orders`,
        {},
        { headers: { token } }
      );
      setTotalOrders(orders.data.length || 0);
    } catch (err) {
      console.error("Failed to fetch counts", err);
    }
  };

  useEffect(() => {
    if (token) {
        fetchCounts();
    }
  }, [token]);

  const stats = [
    {
      icon: IoGridOutline,
      label: 'Total Products',
      value: totalProducts,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: IoReceiptOutline,
      label: 'Total Orders',
      value: totalOrders,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: IoTrendingUpOutline,
      label: 'Revenue',
      value: '₹' + (totalOrders * 1500).toLocaleString(),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />

      {/* Main Content */}
      <div className="md:ml-64 pt-[70px]">
        {/* Header Section */}
        <div className="bg-blue-600 text-white py-16 md:py-20 relative overflow-hidden">
          {/* Subtle patterns/glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white font-heading mb-4 tracking-tight">
              Welcome, <span className="">{adminData?.name || "Vendor"}</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl font-medium">
              Manage <span className="text-white font-bold">{adminData?.storeName || "your store"}'s</span> products and orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8 font-heading">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: IoGridOutline, label: 'Add New Product', path: '/add' },
                { icon: IoGridOutline, label: 'View All Products', path: '/lists' },
                { icon: IoReceiptOutline, label: 'Manage Orders', path: '/orders' }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = action.path}
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-center group-hover:border-primary transition-colors">
                    <action.icon className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
