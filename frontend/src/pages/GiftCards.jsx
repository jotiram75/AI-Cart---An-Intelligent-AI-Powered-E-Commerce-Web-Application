import React from 'react'

const GiftCards = () => {
  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
        <div className="text-center max-w-2xl mx-auto mb-12">
             <h1 className='text-3xl font-bold mb-4'>AICart Gift Cards</h1>
             <p className='text-gray-600'>Give the gift of style and choice. Perfect for any occasion.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[50, 100, 200, 500].map((amount) => (
                <div key={amount} className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl p-8 aspect-video flex flex-col justify-between shadow-xl hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="flex justify-between items-start">
                        <span className="font-bold text-xl tracking-widest">AICART</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">GIFT CARD</span>
                    </div>
                    
                    <div>
                        <span className="text-4xl font-bold">${amount}</span>
                    </div>

                    <div className="text-sm opacity-75 font-mono">
                        **** **** **** 1234
                    </div>
                </div>
            ))}
             <div className="bg-gray-50 rounded-2xl p-8 aspect-video flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-300 hover:border-primary hover:bg-white transition-all cursor-pointer">
                <h3 className="font-bold text-xl mb-2">Custom Amount</h3>
                <p className="text-gray-500 text-sm">Enter a specific value between $10 - $1000</p>
             </div>
        </div>

        <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-2">How it works</h2>
            <p className="text-gray-600">Gift cards are delivered by email and contain instructions to redeem them at checkout. Our gift cards have no additional processing fees.</p>
            <button className="mt-6 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Purchase Gift Card
            </button>
        </div>
    </div>
  )
}

export default GiftCards
