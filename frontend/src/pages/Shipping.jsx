import React from 'react'

const Shipping = () => {
  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Shipping & Delivery</h1>

        <div className="max-w-4xl mx-auto space-y-12">
            
            <section>
                <h2 className="text-xl font-bold mb-6 border-b pb-2">Shipping Options</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 border border-gray-200 rounded-xl hover:border-primary transition-colors">
                        <h3 className="font-bold text-lg mb-2">Standard</h3>
                        <p className="text-2xl font-bold mb-2">Free</p>
                        <p className="text-sm text-gray-500">5-7 Business Days</p>
                        <p className="text-xs text-gray-400 mt-2">On orders over $50</p>
                    </div>
                    <div className="p-6 border border-gray-200 rounded-xl hover:border-primary transition-colors">
                        <h3 className="font-bold text-lg mb-2">Express</h3>
                        <p className="text-2xl font-bold mb-2">$15.00</p>
                        <p className="text-sm text-gray-500">2-3 Business Days</p>
                    </div>
                     <div className="p-6 border border-gray-200 rounded-xl hover:border-primary transition-colors">
                        <h3 className="font-bold text-lg mb-2">Next Day</h3>
                        <p className="text-2xl font-bold mb-2">$25.00</p>
                        <p className="text-sm text-gray-500">1 Business Day</p>
                        <p className="text-xs text-gray-400 mt-2">Order by 2PM EST</p>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl">
                <h2 className="text-xl font-bold mb-4">International Shipping</h2>
                <p className="text-gray-700 mb-4">
                    We currently ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on your location and the weight of your order.
                </p>
                <p className="text-gray-700 text-sm">
                    <strong>Please Note:</strong> International orders may be subject to import duties and taxes, which are the responsibility of the recipient.
                </p>
            </section>

             <section>
                <h2 className="text-xl font-bold mb-4">Order Tracking</h2>
                <p className="text-gray-700 mb-6">
                    Once your order has shipped, you will receive an email with a tracking number. You can also track your order status in your account.
                </p>
                 <button className="text-primary font-semibold hover:underline">Track Order →</button>
            </section>

        </div>
    </div>
  )
}

export default Shipping
