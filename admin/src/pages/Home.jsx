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
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              Welcome, {adminData?.name || "Vendor"}
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              Manage {adminData?.storeName || "your store"}'s products and orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => window.location.href = '/add'}
                className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <IoGridOutline className="w-8 h-8 text-gray-600 group-hover:text-primary" />
                <span className="font-semibold text-gray-700 group-hover:text-primary">
                  Add New Product
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/lists'}
                className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <IoGridOutline className="w-8 h-8 text-gray-600 group-hover:text-primary" />
                <span className="font-semibold text-gray-700 group-hover:text-primary">
                  View All Products
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/orders'}
                className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <IoReceiptOutline className="w-8 h-8 text-gray-600 group-hover:text-primary" />
                <span className="font-semibold text-gray-700 group-hover:text-primary">
                  Manage Orders
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
