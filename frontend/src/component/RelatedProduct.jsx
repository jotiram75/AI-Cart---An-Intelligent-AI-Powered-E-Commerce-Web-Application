import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'
import Card from './Card'

function RelatedProduct({ category, subCategory, currentProductId }) {

    const { products } = useContext(shopDataContext)
    const [related, setRelated] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item) => category === item.category)
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
            productsCopy = productsCopy.filter((item) => currentProductId !== item._id)
            setRelated(productsCopy.slice(0, 5))
        }
    }, [products, category, subCategory, currentProductId])

    if (related.length === 0) return null;

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'>
            <div className='text-center mb-10'>
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>
            
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                {
                    related.map((item, index) => (
                        <Card key={index} id={item._id} name={item.name} price={item.price} image={item.image1} />
                    ))
                }
            </div>
        </div>
    )
}

export default RelatedProduct

