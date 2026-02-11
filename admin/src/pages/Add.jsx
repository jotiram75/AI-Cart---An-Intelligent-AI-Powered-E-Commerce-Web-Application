import React, { useContext, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import upload from '../assets/upload image.jpg'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { IoCloudUploadOutline } from 'react-icons/io5'

function Add() {
  let [image1,setImage1] = useState(false)
  let [image2,setImage2] = useState(false)
  let [image3,setImage3] = useState(false)
  let [image4,setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Men")
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState("TopWear")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes,setSizes] = useState([])
  const [loading,setLoading] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  let {serverUrl} = useContext(authDataContext)

  const handleAddProduct = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      let formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append("image1",image1)
      formData.append("image2",image2)
      formData.append("image3",image3)
      formData.append("image4",image4)

      let {token} = useContext(adminDataContext)
      let result = await axios.post(serverUrl + "/api/product/addproduct" , formData, {
          headers: { token }
      } )

      console.log(result.data)
      toast.success("Product Added Successfully")
      setLoading(false)

      if(result.data){
        setName("")
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice("")
        setBestSeller(false)
        setCategory("Men")
        setSubCategory("TopWear")
        setSizes([])
      }
    } catch (error) {
       console.log(error)
       setLoading(false)
       toast.error("Add Product Failed")
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Nav showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />

      <div className='md:ml-64 pt-[70px]'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 font-heading mb-2'>Add New Product</h1>
            <p className='text-gray-600'>Fill in the details to add a new product to your inventory</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddProduct} className='bg-white rounded-xl shadow-md p-6 md:p-8'>
            
            {/* Upload Images */}
            <div className='mb-8'>
              <label className='block text-lg font-semibold text-gray-900 mb-4'>
                Product Images
              </label>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                  {state: image1, setState: setImage1, id: 'image1'},
                  {state: image2, setState: setImage2, id: 'image2'},
                  {state: image3, setState: setImage3, id: 'image3'},
                  {state: image4, setState: setImage4, id: 'image4'}
                ].map((img, index) => (
                  <label key={index} htmlFor={img.id} className='cursor-pointer group'>
                    <div className='aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-primary transition-colors relative'>
                      {!img.state ? (
                        <div className='w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100'>
                          <IoCloudUploadOutline className='w-8 h-8 text-gray-400 mb-2' />
                          <span className='text-xs text-gray-500'>Upload</span>
                        </div>
                      ) : (
                        <img src={URL.createObjectURL(img.state)} alt="" className='w-full h-full object-cover' />
                      )}
                    </div>
                    <input type="file" id={img.id} hidden onChange={(e)=>img.setState(e.target.files[0])} required />
                  </label>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Product Name *
              </label>
              <input 
                type="text" 
                placeholder='Enter product name'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                onChange={(e)=>setName(e.target.value)} 
                value={name} 
                required
              />
            </div>

            {/* Product Description */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Product Description *
              </label>
              <textarea 
                placeholder='Enter product description'
                rows='4'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                onChange={(e)=>setDescription(e.target.value)} 
                value={description} 
                required 
              />
            </div>

            {/* Category and Sub-Category */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Product Category *
                </label>
                <select 
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  onChange={(e)=>setCategory(e.target.value)}
                  value={category}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  Sub-Category *
                </label>
                <select 
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  onChange={(e)=>setSubCategory(e.target.value)}
                  value={subCategory}
                >
                  <option value="TopWear">TopWear</option>
                  <option value="BottomWear">BottomWear</option>
                  <option value="WinterWear">WinterWear</option>
                </select>
              </div>
            </div>

            {/* Product Price */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Product Price *
              </label>
              <input 
                type="number" 
                placeholder='₹ 2000'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                onChange={(e)=>setPrice(e.target.value)} 
                value={price} 
                required
              />
            </div>

            {/* Product Sizes */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-900 mb-3'>
                Available Sizes *
              </label>
              <div className='flex flex-wrap gap-3'>
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type='button'
                    className={`px-6 py-2 rounded-lg border-2 font-medium transition-all ${
                      sizes.includes(size) 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                    onClick={()=>setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Bestseller Checkbox */}
            <div className='mb-8'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input 
                  type="checkbox" 
                  className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer'
                  onChange={()=>setBestSeller(prev => !prev)}
                  checked={bestseller}
                />
                <span className='text-sm font-semibold text-gray-900'>
                  Add to Best Sellers
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type='submit'
              className='w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2'
              disabled={loading}
            >
              {loading ? <Loading/> : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Add
