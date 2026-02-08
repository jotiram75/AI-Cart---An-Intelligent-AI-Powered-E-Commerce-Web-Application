import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { IoHeartOutline } from 'react-icons/io5'

function Card({name , image , id , price}) {
    const {currency} = useContext(shopDataContext)
    const navigate = useNavigate()
    
  return (
    <div 
      className='group relative w-full cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300' 
      onClick={()=>navigate(`/productdetail/${id}`)}
    >
        {/* Image Container */}
        <div className='relative w-full aspect-[3/4] overflow-hidden bg-gray-50'>
             <img 
                src={image} 
                alt={name} 
                className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
                loading="lazy"
             />
             
             {/* Gradient Overlay on Hover */}
             <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
             
             {/* Wishlist Button */}
             <button 
                className='absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white z-10'
                onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist logic
                }}
             >
                <IoHeartOutline className='w-5 h-5' />
             </button>
             
             {/* Quick View Button - Desktop Only */}
             <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block'>
                 <button 
                    className='w-full bg-white text-gray-900 py-3 rounded-full font-bold shadow-lg hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-wide'
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productdetail/${id}`);
                    }}
                 >
                     Quick View
                 </button>
             </div>
        </div>
        
        {/* Product Info */}
        <div className='p-4 space-y-2'>
            <h3 className='text-gray-700 text-sm md:text-base hover:text-primary transition-colors line-clamp-2 font-medium leading-snug min-h-[2.5rem]'>
                {name}
            </h3>
            <div className='flex items-center justify-between'>
                <span className='text-gray-900 text-lg md:text-xl font-bold'>
                    {currency}{price}.00
                </span>
                {/* Rating Stars - Optional */}
                <div className='flex items-center gap-1 text-yellow-400 text-xs'>
                    ★★★★★
                </div>
            </div>
        </div>

        {/* Sale Badge - Optional */}
        {/* <div className='absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
            SALE
        </div> */}
    </div>
  )
}

export default Card
