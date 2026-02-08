import React from 'react'

function Title({ text1, text2 }) {
  return (
    <div className='inline-flex items-center gap-2 mb-3'>
      <p className='text-gray-600 font-medium text-base md:text-lg'>
        {text1} 
        <span className='text-gray-900 font-bold ml-2'>{text2}</span>
      </p>
      <div className='w-8 sm:w-12 h-[2px] bg-primary'></div>
    </div>
  )
}

export default Title
