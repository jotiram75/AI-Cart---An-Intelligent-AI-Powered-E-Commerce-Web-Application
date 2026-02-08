import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../component/CartTotal';

function Cart() {
    const { products, currency, cartItem ,updateQuantity } = useContext(shopDataContext)
    const [cartData, setCartData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const tempData = [];
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItem[items][item],
                    });
                }
            }
        }
        setCartData(tempData);
    }, [cartItem]);

    return (
        <div className='border-t border-gray-200 pt-14 container mx-auto px-4 min-h-screen bg-white'>
            <div className='text-2xl mb-3'>
                <Title text1={'YOUR'} text2={'CART'} />
            </div>

            <div className=''>
                {cartData.map((item, index) => {
                    const productData = products.find((product) => product._id === item._id);
                    if (!productData) return null;

                    return (
                        <div key={index} className='py-4 border-t border-b border-gray-200 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                            <div className='flex items-start gap-6'>
                                <img className='w-16 sm:w-20' src={productData.image1} alt="" />
                                <div>
                                    <p className='text-xs sm:text-lg font-medium text-gray-800'>{productData.name}</p>
                                    <div className='flex items-center gap-5 mt-2'>
                                        <p className='text-gray-900'>{currency}{productData.price}</p>
                                        <p className='px-2 sm:px-3 sm:py-1 border border-gray-200 bg-gray-50'>{item.size}</p>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="number" 
                                min={1} 
                                defaultValue={item.quantity} 
                                className='border border-gray-200 max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                                onChange={(e) => (e.target.value === '' || e.target.value === '0') ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                            />
                            <RiDeleteBin6Line className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-gray-400 hover:text-red-500 transition-colors mr-4' onClick={() => updateQuantity(item._id, item.size, 0)} />
                        </div>
                    )
                })}
            </div>

            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button 
                            className='bg-primary text-white text-sm my-8 px-8 py-3 w-full sm:w-auto uppercase font-bold rounded-full shadow hover:shadow-lg transition-all'
                            onClick={() => cartData.length > 0 ? navigate("/placeorder") : null}
                        >
                            Proceed to checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
