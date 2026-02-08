import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'
import { IoReceiptOutline, IoCheckmarkCircle, IoCashOutline, IoCalendarOutline } from "react-icons/io5";
import { toast } from 'react-toastify'

function Orders() {
  let [orders,setOrders] = useState([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  let {serverUrl} = useContext(authDataContext)

  const fetchAllOrders =async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/list' , {} ,{withCredentials:true})
      setOrders(result.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  const statusHandler = async (e , orderId) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/status' , {orderId,status:e.target.value},{withCredentials:true})
      if(result.data){
        toast.success("Order status updated")
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update status")
    }
  }

  useEffect(()=>{
    fetchAllOrders()
  },[])

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-50 text-blue-600 border-blue-200',
      'Packing': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Shipped': 'bg-purple-50 text-purple-600 border-purple-200',
      'Out for delivery': 'bg-orange-50 text-orange-600 border-orange-200',
      'Delivered': 'bg-green-50 text-green-600 border-green-200'
    }
    return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Nav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />

      <div className='md:ml-64 pt-[70px]'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 font-heading mb-2'>All Orders</h1>
            <p className='text-gray-600'>Manage and track customer orders</p>
          </div>

          {/* Orders List */}
          <div className='space-y-6'>
            {orders.length > 0 ? (
              orders.map((order,index)=>(
                <div 
                  key={index} 
                  className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6'
                >
                  <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Order Icon */}
                    <div className='lg:col-span-1 flex justify-center lg:justify-start'>
                      <div className='w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center'>
                        <IoReceiptOutline className='w-8 h-8 text-primary' />
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className='lg:col-span-4'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-2'>Order Items</h3>
                      <div className='space-y-1'>
                        {order.items.map((item,idx)=>(
                          <p key={idx} className='text-sm text-gray-600'>
                            {item.name} × {item.quantity} <span className='text-gray-400'>({item.size})</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className='lg:col-span-3'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-2'>Customer Details</h3>
                      <div className='text-sm text-gray-600 space-y-1'>
                        <p className='font-medium text-gray-900'>
                          {order.address.firstName} {order.address.lastName}
                        </p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.country} - {order.address.pinCode}</p>
                        <p className='text-primary'>{order.address.phone}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className='lg:col-span-2'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-2'>Order Info</h3>
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <IoReceiptOutline className='w-4 h-4' />
                          <span>{order.items.length} items</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <IoCashOutline className='w-4 h-4' />
                          <span>{order.paymentMethod}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <IoCheckmarkCircle className='w-4 h-4' />
                          <span className={order.payment ? 'text-green-600' : 'text-orange-600'}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <IoCalendarOutline className='w-4 h-4' />
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <p className='text-lg font-bold text-gray-900 mt-2'>₹ {order.amount}</p>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className='lg:col-span-2'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-2'>Order Status</h3>
                      <select  
                        value={order.status} 
                        className={`w-full px-4 py-2 rounded-lg border-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(order.status)}`}
                        onChange={(e)=>statusHandler(e,order._id)}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                <IoReceiptOutline className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <p className='text-gray-500 text-lg'>No orders available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
