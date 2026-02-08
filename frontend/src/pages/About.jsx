import React from "react";
import Title from "../component/Title";
import about from "../assets/about.jpg";
import NewLetterBox from "../component/NewLetterBox";
import Footer from "../component/Footer";
import { IoCheckmarkCircle, IoRocketOutline, IoHeartOutline } from "react-icons/io5";

function About() {
  const features = [
    {
      icon: IoCheckmarkCircle,
      title: "Quality Assurance",
      description: "We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction always."
    },
    {
      icon: IoRocketOutline,
      title: "Convenience",
      description: "Shop easily with fast delivery, simple navigation, secure checkout, and everything you need in one place."
    },
    {
      icon: IoHeartOutline,
      title: "Exceptional Customer Service",
      description: "Our dedicated support team ensures quick responses, helpful solutions, and a smooth shopping experience every time."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Title text1={"ABOUT"} text2={"US"} />
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <img 
              className="w-full h-auto object-cover rounded-2xl shadow-lg" 
              src={about} 
              alt="About AICart" 
            />
          </div>
          
          <div className="order-1 lg:order-2 space-y-6 text-gray-600">
            <p className="text-base md:text-lg leading-relaxed">
              AICART was born for smart, seamless shopping—created to deliver quality
              products, trending styles, and everyday essentials in one place.
              With reliable service, fast delivery, and great value, AICart makes
              your online shopping experience simple, satisfying, and stress-free.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Data-driven and customer-focused, we bridge the gap between
              modern shoppers and the products they love. Whether it's fashion, 
              essentials, or trends, we bring everything you need to one trusted 
              platform with fast delivery, easy returns, and a customer-first 
              experience.
            </p>
            
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Our Mission</h3>
              <p className="text-base md:text-lg leading-relaxed">
                Our mission is to redefine online shopping by delivering quality,
                affordability, and convenience. AICart connects customers with
                trusted products and brands, offering a seamless, customer-focused
                experience that saves time, adds value, and fits every lifestyle and
                need.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-12">
          <div className="text-center mb-12">
            <Title text1={"WHY"} text2={"CHOOSE US"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white border border-gray-200 rounded-xl p-8 hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
              >
                <feature.icon className="w-12 h-12 text-primary group-hover:text-white mb-4 transition-colors" />
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 font-heading transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white leading-relaxed transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <h4 className="text-4xl md:text-5xl font-bold mb-2">10K+</h4>
              <p className="text-white/90">Happy Customers</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-bold mb-2">5K+</h4>
              <p className="text-white/90">Products</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-bold mb-2">50+</h4>
              <p className="text-white/90">Brands</p>
            </div>
            <div>
              <h4 className="text-4xl md:text-5xl font-bold mb-2">99%</h4>
              <p className="text-white/90">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      <NewLetterBox />
      <Footer />
    </div>
  );
}

export default About;

