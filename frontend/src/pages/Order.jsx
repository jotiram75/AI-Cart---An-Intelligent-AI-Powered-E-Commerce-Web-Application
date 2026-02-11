import React, { useContext, useEffect, useState } from "react";
import Title from "../component/Title";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

function Order() {
  const [orderData, setOrderData] = useState([]);
  const { currency } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

  const loadOrderData = async () => {
    try {
      const result = await axios.post(
        serverUrl + "/api/order/userorder",
        {},
        { withCredentials: true },
      );
      if (result.data) {
        let allOrdersItem = [];
        result.data.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-2xl mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        <div className="flex flex-col gap-6">
          {orderData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img className="w-full h-full object-cover object-center" src={item.image1} alt={item.name} />
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                    <p className="font-medium text-gray-900">{currency}{item.price}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <p>Size: <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{item.size}</span></p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                    <p>Date: <span className="text-gray-900 font-medium">{new Date(item.date).toDateString()}</span></p>
                    <p>Payment: <span className="text-gray-900 font-medium uppercase">{item.paymentMethod}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-sm font-medium text-green-700">{item.status}</p>
                </div>
                
                <button 
                  onClick={loadOrderData} 
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-primary hover:border-gray-400 transition-all focus:ring-2 focus:ring-gray-200"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
          
          {orderData.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
