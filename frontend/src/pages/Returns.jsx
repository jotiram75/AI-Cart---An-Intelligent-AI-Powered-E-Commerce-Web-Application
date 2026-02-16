import React from 'react'

const Returns = () => {
    const steps = [
        { title: "Request a Return", desc: "Go to your orders page and select the item you wish to return." },
        { title: "Pack your Item", desc: "Place the item in the original packaging with tags attached." },
        { title: "Ship it Back", desc: "Use the prepaid label provided and drop it off at any carrier location." },
        { title: "Get Refunded", desc: "Once we receive your return, we'll process your refund within 5-7 days." }
    ];

  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
       <h1 className='text-3xl font-bold mb-8 text-center'>Returns & Exchanges</h1>
       
       <div className="max-w-4xl mx-auto">
           <div className="bg-gray-50 p-8 rounded-2xl mb-12">
               <h2 className="text-xl font-bold mb-4">Our Policy</h2>
               <p className="text-gray-700 leading-relaxed mb-4">
                   We want you to love your purchase. If you didn't, we'll happily accept returns for a full refund within 30 days of purchase. Items must be in original condition, unworn, and with tags attached.
               </p>
               <p className="text-gray-700 leading-relaxed">
                   Final sale items, intimates, and gift cards are not eligible for return.
               </p>
           </div>

           <h2 className="text-2xl font-bold mb-8 text-center">How to Return</h2>
           <div className="grid md:grid-cols-4 gap-6 text-center">
               {steps.map((step, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                       <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                           {idx + 1}
                       </div>
                       <h3 className="font-bold mb-2">{step.title}</h3>
                       <p className="text-sm text-gray-600">{step.desc}</p>
                   </div>
               ))}
           </div>
           
           <div className="mt-12 text-center">
               <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                   Start a Return
               </button>
           </div>
       </div>
    </div>
  )
}

export default Returns
