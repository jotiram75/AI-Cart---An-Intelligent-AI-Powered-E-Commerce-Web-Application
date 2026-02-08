import React from 'react'
import LatestCollection from '../component/LatestCollection'
import BestSeller from '../component/BestSeller'

function Product() {
  return (
    <div className='container mx-auto px-4 py-10 min-h-screen bg-white'>
        <div className='mb-10'>
            <LatestCollection/>
        </div>
        <div className='mb-10'>
            <BestSeller/>
        </div>
    </div>
  )
}

export default Product
