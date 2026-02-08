import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await axios.post(
        serverUrl + '/api/auth/admin',
        { email, password },
        { withCredentials: true }
      )
      
      if (result.data.success) {
        toast.success('Login Successful!')
        navigate('/')
      } else {
        toast.error(result.data.message || 'Login Failed')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Login Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
      {/* Login Card */}
      <div className='w-full max-w-md'>
        {/* Logo and Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <img src={logo} alt="AICart Logo" className="w-16 h-16" />
            <h1 className='text-4xl font-bold text-gray-900 font-heading'>AICART</h1>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Admin Panel</h2>
          <p className='text-gray-600'>Sign in to manage your store</p>
        </div>

        {/* Login Form Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
          <form onSubmit={handleLogin} className='space-y-6'>
            {/* Email Input */}
            <div>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <IoMailOutline className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  placeholder='admin@aicart.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-semibold text-gray-900 mb-2'>
                Password
              </label>
              <div className='relative'>
                <IoLockClosedOutline className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <IoEyeOffOutline className='w-5 h-5' />
                  ) : (
                    <IoEyeOutline className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className='text-center text-sm text-gray-600 mt-6'>
          © 2026 AICart. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
