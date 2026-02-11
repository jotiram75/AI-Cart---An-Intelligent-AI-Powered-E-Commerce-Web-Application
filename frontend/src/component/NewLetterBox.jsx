import React, { useState } from 'react'
import { IoMailOutline } from 'react-icons/io5'

function NewLetterBox() {
    const [email, setEmail] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle newsletter subscription
        console.log('Newsletter subscription:', email)
        setEmail('')
    }
    
  return (
    <div className='bg-gradient-to-r from-primary to-purple-600 py-16 md:py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold font-heading mb-4'>
            Subscribe & Get 20% Off
          </h2>
          <p className='text-base md:text-lg mb-8 text-white/90'>
            Subscribe now and enjoy exclusive savings, special deals, and early access to new collections.
          </p>
          
          <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 max-w-xl mx-auto'>
            <div className='flex-1 relative'>
              <IoMailOutline className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10' />
              <input 
                type="email" 
                placeholder='Enter your email address' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-12 md:h-14 pl-12 pr-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg border-none'
                required 
              />
            </div>
            <button 
              type='submit' 
              className='h-12 md:h-14 px-8 md:px-10 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full transition-colors shadow-lg uppercase tracking-wide text-sm'
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewLetterBox
