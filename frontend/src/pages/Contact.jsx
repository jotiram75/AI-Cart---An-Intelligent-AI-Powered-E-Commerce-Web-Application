import React, { useState } from 'react'
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5'
import Title from '../component/Title'
import Footer from '../component/Footer'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='min-h-screen bg-white pt-20 md:pt-24'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'>
        
        {/* Header */}
        <div className='text-center mb-12'>
          <Title text1={'GET IN'} text2={'TOUCH'} />
          <p className='mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto'>
          
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6 font-heading'>Contact Information</h2>
              <p className='text-gray-600 mb-8'>
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className='space-y-6'>
              {/* Email */}
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IoMailOutline className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                  <a href='mailto:support@aicart.com' className='text-gray-600 hover:text-primary transition-colors'>
                    support@aicart.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IoCallOutline className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Phone</h3>
                  <a href='tel:+1234567890' className='text-gray-600 hover:text-primary transition-colors'>
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                  <IoLocationOutline className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Office</h3>
                  <p className='text-gray-600'>
                    123 Fashion Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>Business Hours</h3>
              <div className='space-y-2 text-sm text-gray-600'>
                <div className='flex justify-between'>
                  <span>Monday - Friday</span>
                  <span className='font-medium'>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Saturday</span>
                  <span className='font-medium'>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Sunday</span>
                  <span className='font-medium'>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-sm'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Name */}
              <div>
                <label htmlFor='name' className='block text-sm font-semibold text-gray-900 mb-2'>
                  Your Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  placeholder='John Doe'
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor='email' className='block text-sm font-semibold text-gray-900 mb-2'>
                  Email Address *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  placeholder='john@example.com'
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor='subject' className='block text-sm font-semibold text-gray-900 mb-2'>
                  Subject *
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  placeholder='How can we help?'
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor='message' className='block text-sm font-semibold text-gray-900 mb-2'>
                  Message *
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  rows='5'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none'
                  placeholder='Tell us more about your inquiry...'
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg uppercase tracking-wide text-sm'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact

