import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IoTrashOutline, IoSearchOutline, IoPencilOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'

function Lists() {
  let [list ,setList] = useState([])
  let [searchTerm, setSearchTerm] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { token } = useContext(adminDataContext)
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/product/vendor-list", {
          headers: { token }
      })
      if (result.data.success) {
          setList(result.data.products)
      }
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const removeList = async (id) => {
    try {
      let result = await axios.post(`${serverUrl}/api/product/remove`, { id }, {
          headers: { token }
      })
      if(result.data){
        toast.success("Product removed successfully")
        fetchList()
      } else {
        toast.error("Failed to remove product")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove product")
    }
  }

  useEffect(()=>{
   fetchList()
  },[])

  const filteredList = list.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Nav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />

      <div className='md:ml-64 pt-[70px]'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 font-heading mb-2'>All Products</h1>
            <p className='text-gray-600'>Manage your product inventory</p>
          </div>

          {/* Search Bar */}
          <div className='mb-6'>
            <div className='relative max-w-md'>
              <IoSearchOutline className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search products...'
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Products List */}
          <div className='space-y-4'>
            {filteredList?.length > 0 ? (
              filteredList.map((item,index)=>(
                <div 
                  key={index}
                  className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6'
                >
                  <div className='flex items-center gap-4'>
                    {/* Product Image */}
                    <img 
                      src={item.image1} 
                      className='w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0' 
                      alt={item.name} 
                    />
                    
                    {/* Product Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-1 truncate'>
                        {item.name}
                      </h3>
                      <div className='flex flex-wrap items-center gap-3 text-sm text-gray-600'>
                        <span className='px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium'>
                          {item.category}
                        </span>
                        <span className='px-3 py-1 bg-green-50 text-green-600 rounded-full font-medium'>
                          ₹{item.price}
                        </span>
                        {item.bestseller && (
                          <span className='px-3 py-1 bg-purple-50 text-purple-600 rounded-full font-medium'>
                            Best Seller
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => navigate(`/edit/${item._id}`)}
                        className='p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0'
                        title='Edit product'
                      >
                        <IoPencilOutline className='w-5 h-5' />
                      </button>
                      
                      <button
                        onClick={() => removeList(item._id)}
                        className='p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0'
                        title='Delete product'
                      >
                        <IoTrashOutline className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                <p className='text-gray-500 text-lg'>
                  {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lists
