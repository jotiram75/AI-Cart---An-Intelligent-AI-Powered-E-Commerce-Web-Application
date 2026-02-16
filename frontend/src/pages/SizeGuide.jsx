import React, { useState } from 'react'

const SizeGuide = () => {
    const [activeTab, setActiveTab] = useState('women');

    const tabs = ['women', 'men', 'kids'];

    const sizeData = {
        women: [
            { size: "XS", us: "0-2", bust: "31-32", waist: "24-25", hips: "33-34" },
            { size: "S", us: "4-6", bust: "33-35", waist: "26-27", hips: "35-37" },
            { size: "M", us: "8-10", bust: "36-37", waist: "28-29", hips: "38-40" },
            { size: "L", us: "12-14", bust: "38-40", waist: "30-32", hips: "41-43" },
            { size: "XL", us: "16", bust: "41-43", waist: "33-35", hips: "44-46" },
        ],
        men: [
            { size: "S", us: "34-36", chest: "34-36", waist: "28-30", neck: "14-14.5" },
            { size: "M", us: "38-40", chest: "38-40", waist: "32-34", neck: "15-15.5" },
            { size: "L", us: "42-44", chest: "42-44", waist: "36-38", neck: "16-16.5" },
            { size: "XL", us: "46-48", chest: "46-48", waist: "40-42", neck: "17-17.5" },
            { size: "XXL", us: "50-52", chest: "50-52", waist: "44-46", neck: "18-18.5" },
        ],
        kids: [
            { size: "S", age: "4-5", height: "40-44", weight: "35-45 lbs" },
            { size: "M", age: "6-7", height: "45-49", weight: "46-60 lbs" },
            { size: "L", age: "8-9", height: "50-55", weight: "61-75 lbs" },
            { size: "XL", age: "10-12", height: "56-60", weight: "76-95 lbs" },
        ]
    };

  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
       <h1 className='text-3xl font-bold mb-8 text-center'>Size Guide</h1>
       
       <div className="max-w-4xl mx-auto">
           {/* Tabs */}
           <div className="flex justify-center mb-8 border-b border-gray-200">
               {tabs.map(tab => (
                   <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 text-sm font-medium uppercase tracking-wide transition-all border-b-2 ${
                            activeTab === tab 
                            ? "border-black text-black" 
                            : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                   >
                       {tab}
                   </button>
               ))}
           </div>

           {/* Table */}
           <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
               <table className="w-full text-left border-collapse">
                   <thead>
                       <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
                           <th className="p-4 font-semibold">Size</th>
                           {activeTab === 'women' && (
                               <>
                                <th className="p-4 font-semibold">US Size</th>
                                <th className="p-4 font-semibold">Bust (in)</th>
                                <th className="p-4 font-semibold">Waist (in)</th>
                                <th className="p-4 font-semibold">Hips (in)</th>
                               </>
                           )}
                           {activeTab === 'men' && (
                               <>
                                <th className="p-4 font-semibold">US Size</th>
                                <th className="p-4 font-semibold">Chest (in)</th>
                                <th className="p-4 font-semibold">Waist (in)</th>
                                <th className="p-4 font-semibold">Neck (in)</th>
                               </>
                           )}
                           {activeTab === 'kids' && (
                               <>
                                <th className="p-4 font-semibold">Age (yrs)</th>
                                <th className="p-4 font-semibold">Height (in)</th>
                                <th className="p-4 font-semibold">Weight</th>
                               </>
                           )}
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {sizeData[activeTab].map((row, idx) => (
                           <tr key={idx} className="hover:bg-gray-50 transition-colors">
                               <td className="p-4 font-bold text-gray-900">{row.size}</td>
                               
                               {activeTab === 'women' && (
                                   <>
                                    <td className="p-4 text-gray-600">{row.us}</td>
                                    <td className="p-4 text-gray-600">{row.bust}</td>
                                    <td className="p-4 text-gray-600">{row.waist}</td>
                                    <td className="p-4 text-gray-600">{row.hips}</td>
                                   </>
                               )}
                               {activeTab === 'men' && (
                                   <>
                                    <td className="p-4 text-gray-600">{row.us}</td>
                                    <td className="p-4 text-gray-600">{row.chest}</td>
                                    <td className="p-4 text-gray-600">{row.waist}</td>
                                    <td className="p-4 text-gray-600">{row.neck}</td>
                                   </>
                               )}
                               {activeTab === 'kids' && (
                                   <>
                                    <td className="p-4 text-gray-600">{row.age}</td>
                                    <td className="p-4 text-gray-600">{row.height}</td>
                                    <td className="p-4 text-gray-600">{row.weight}</td>
                                   </>
                               )}
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>

           <div className="mt-12 bg-blue-50 p-6 rounded-xl flex gap-4 items-start">
               <div className="bg-white p-2 rounded-full shadow-sm text-xl">💡</div>
               <div>
                   <h3 className="font-bold text-lg mb-1">Not sure about your size?</h3>
                   <p className="text-gray-600 text-sm">
                       Try our AI-powered <strong>"Try On"</strong> feature on product pages to see how clothes look on you, or check the specific product description for fit advice (e.g., "Fits true to size").
                   </p>
               </div>
           </div>
       </div>
    </div>
  )
}

export default SizeGuide
