import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import back3 from "../assets/back3.jpg";
import back4 from "../assets/back4.jpg";

const heroData = [
  {
    image: back2,
    subtitle: "Women Collection 2026",
    title: "NEW ARRIVALS",
    buttonText: "SHOP NOW",
  },
  {
    image: back1,
    subtitle: "Women Collection 2026",
    title: "NEW SEASON",
    buttonText: "SHOP NOW",
  },
  {
    image: back3,
    subtitle: "Men New-Season",
    title: "JACKETS & COATS",
    buttonText: "SHOP NOW",
  },
  {
    image: back4,
    subtitle: "Women Collection 2026",
    title: "NEW ARRIVALS",
    buttonText: "SHOP NOW",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroData.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {heroData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-6">
                <span
                  className={`block text-lg sm:text-xl md:text-2xl font-light font-heading text-white transition-all duration-700 delay-300 transform ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  {slide.subtitle}
                </span>
                <h2
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-heading leading-tight transition-all duration-700 delay-500 transform ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.6)" }}
                >
                  {slide.title}
                </h2>
                <button
                  onClick={() => navigate("/collection")}
                  className={`mt-6 px-8 md:px-12 py-3 md:py-4 bg-white text-gray-900 rounded-full font-bold uppercase hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  } delay-700 font-sans tracking-wide text-sm md:text-base`}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 md:gap-4 z-20">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125 w-8 md:w-10"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white animate-bounce">
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}

export default Hero;
