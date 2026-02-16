import React, { useState } from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Orders & Shipping",
            items: [
                { q: "How do I track my order?", a: "Once your order ships, you will receive an email with a tracking number and a link to track your package." },
                { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location." },
                { q: "How long will delivery take?", a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days." }
            ]
        },
        {
            category: "Returns & Exchanges",
            items: [
                { q: "What is your return policy?", a: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and with original tags." },
                { q: "How do I start a return?", a: "Visit our Returns page, enter your order number, and follow the instructions to generate a return label." },
                { q: "When will I get my refund?", a: "Refunds are processed within 5-7 business days after we receive your return." }
            ]
        },
        {
            category: "Product & Sizing",
            items: [
                { q: "How do I find my size?", a: "Check our Size Guide page for detailed measurements. We also offer AI-powered size recommendations on product pages." },
                { q: "Are your products sustainable?", a: "We are committed to sustainability. Look for our 'Eco-Friendly' tag on product pages." }
            ]
        }
    ];

  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
      <h1 className='text-3xl font-bold mb-4 text-center'>Frequently Asked Questions</h1>
      <p className="text-center text-gray-600 mb-12">Find answers to common questions about your shopping experience.</p>
      
      <div className='max-w-3xl mx-auto space-y-8'>
          {faqs.map((section, sIdx) => (
              <div key={sIdx}>
                  <h2 className="font-bold text-xl mb-4 text-primary">{section.category}</h2>
                  <div className="space-y-4">
                      {section.items.map((item, iIdx) => {
                          const key = `${sIdx}-${iIdx}`;
                          const isOpen = openIndex === key;
                          
                          return (
                            <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => setOpenIndex(isOpen ? null : key)}
                                    className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{item.q}</span>
                                    {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                                </button>
                                {isOpen && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                          )
                      })}
                  </div>
              </div>
          ))}
      </div>
      
      <div className="text-center mt-12">
          <p className="text-gray-600">Still have questions?</p>
          <a href="/contact" className="text-primary font-semibold hover:underline">Contact Support</a>
      </div>
    </div>
  )
}

export default Faq
