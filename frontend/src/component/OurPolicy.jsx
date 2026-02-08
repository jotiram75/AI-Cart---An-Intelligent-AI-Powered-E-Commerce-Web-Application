import React from 'react'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import Title from './Title';

function OurPolicy() {
  const policies = [
    {
      icon: RiExchangeFundsLine,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy"
    },
    {
      icon: TbRosetteDiscountCheckFilled,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy"
    },
    {
      icon: BiSupport,
      title: "Best Customer Support",
      description: "We provide 24/7 customer support"
    }
  ];

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'>
      <div className='text-center mb-12'>
        <Title text1={"OUR"} text2={"POLICY"} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12'>
        {policies.map((policy, index) => (
          <div key={index} className='flex flex-col items-center text-center gap-4 p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg'>
            <policy.icon className='w-14 h-14 md:w-16 md:h-16 text-primary' />
            <h3 className='font-bold font-heading text-base md:text-lg text-gray-900'>
              {policy.title}
            </h3>
            <p className='text-sm md:text-base text-gray-600 leading-relaxed'>
              {policy.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy

