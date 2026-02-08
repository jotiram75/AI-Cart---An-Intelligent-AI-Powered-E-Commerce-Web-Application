import React from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../component/Title'

function NotFound() {
    let navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
      <div className='text-6xl font-heading font-bold text-gray-800'>404</div>
      <p className='text-xl text-gray-600'>Page Not Found</p>
      <button className='bg-primary text-white px-8 py-3 rounded-full text-sm font-bold uppercase shadow hover:bg-black transition-colors mt-4' onClick={()=>navigate("/login")}>Login</button>
    </div>
  )
}

export default NotFound
