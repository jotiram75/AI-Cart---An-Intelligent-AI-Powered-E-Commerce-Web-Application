import React from 'react'

const Faq = () => {
  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Frequently Asked Questions</h1>
      <div className='max-w-2xl mx-auto space-y-4'>
          <div>
              <h2 className='font-semibold text-lg'>What is your return policy?</h2>
              <p className='text-gray-600'>We offer a 30-day return policy on all items.</p>
          </div>
           <div>
              <h2 className='font-semibold text-lg'>How do I track my order?</h2>
              <p className='text-gray-600'>You will receive an email with tracking details once your order ships.</p>
          </div>
      </div>
    </div>
  )
}

export default Faq
