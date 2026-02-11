import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    const { products } = useContext(shopDataContext)
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
        const filterProduct = products.filter((item) => item.bestseller)
        setBestSeller(filterProduct.slice(0, 5));
    }, [products])

    if (bestSeller.length === 0) return null;

    return (
        <div className='py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-12'>
                    <Title text1={"BEST"} text2={"SELLERS"} />
                    <p className='mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
                        Tried, Tested, Loved – Discover Our All-Time Best Sellers
                    </p>
                </div>
                
                <div className='flex flex-wrap justify-center gap-4 md:gap-6'>
                    {
                        bestSeller.map((item, index) => (
                            <div key={index} className='w-[46%] sm:w-52 md:w-56 lg:w-60 flex-shrink-0'>
                                <Card name={item.name} id={item._id} price={item.price} image={item.image1} />
                            </div>
                        ))
                    }
                </div>

                {/* View All Button */}
                <div className='text-center mt-12'>
                    <button 
                        onClick={() => window.location.href = '/collection'}
                        className='px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-gray-900 transition-colors shadow-lg uppercase tracking-wide text-sm'
                    >
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BestSeller
