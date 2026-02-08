import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {
    const { products } = useContext(shopDataContext)
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products])

    return (
        <div className='py-16 md:py-20 bg-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-12'>
                    <Title text1={"LATEST"} text2={"COLLECTIONS"} />
                    <p className='mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
                        Step Into Style – New Collection Dropping This Season!
                    </p>
                </div>
                
                {/* Rendering Products */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                    {
                        latestProducts.map((item, index) => (
                            <Card key={index} name={item.name} image={item.image1} id={item._id} price={item.price} />
                        ))
                    }
                </div>

                {/* View All Button */}
                <div className='text-center mt-12'>
                    <button 
                        onClick={() => window.location.href = '/collection'}
                        className='px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all shadow-md uppercase tracking-wide text-sm'
                    >
                        Explore More
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LatestCollection
