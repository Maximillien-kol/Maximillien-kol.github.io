"use client";

import React from "react";

export default function HowItWorks() {
  const cards = [
    {
      number: null,
      title: "Understanding its Steps",
      description: "Initiate Your Progress with 5 Simple Moves",
      bgColor: "bg-white",
      isHeader: true,
    },
    {
      number: "1",
      title: "Enter Your Email",
      description: "Provide your email to get started. It’s all we need to reserve your spot. No extra info is required, making it quick and easy.",
      bgColor: "bg-[#E8F3FA]",
      isHeader: false,
    },
    {
      number: "2",
      title: "Verify Your Info",
      description: "aWe quickly confirm your email so you won’t miss updates. This ensures your spot in the queue is safe and ready.",
      bgColor: "bg-[#E8F3FA]",
      isHeader: false,
    },
    {
      number: "3",
      title: "We Prepare Your Access",
      description: "Our system sets everything up behind the scenes for a smooth experience. We make sure all features are ready for you when it’s your turn.",
      bgColor: "bg-[#E8F3FA]",
      isHeader: false,
    },
    {
      number: "4",
      title: "Track Your Progress",
      description: "See your place in the queue in real time and know how close you are. You’ll always know exactly when your turn is coming.",
      bgColor: "bg-[#E8F3FA]",
      isHeader: false,
    },
    {
      number: "5",
      title: "Join the Waitlist",
      description: "EOnce confirmed, you officially join the waitlist and get priority access when it opens. We’ll keep you updated every step of the way until you’re in.",
      bgColor: "bg-[#E8F3FA]",
      isHeader: false,
    },
  ];

  return (
    <div className="py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <p 
            className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 uppercase"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            HOW IT WORKS
          </p>
          <h2 
            className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 leading-tight px-2"
            style={{
              fontFamily: "var(--font-poppins)",
              color: "#022B3A",
            }}
          >
            Our Process
          </h2>
          <p 
            className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-2"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            Simple, transparent, and designed to keep you informed every step of the way. Enter your email, track your spot, and get ready to access the platform effortlessly.
          </p>
        </div>

        {/* All Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl md:rounded-2xl p-4 md:p-6 ${card.isHeader ? 'flex flex-col justify-center' : ''} hover:shadow-lg transition-shadow`}
            >
              {card.isHeader ? (
                // Header card layout
                <>
                  <h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
                    style={{ fontFamily: 'var(--font-poppins)', color: '#022B3A' }}
                  >
                    {card.title}
                  </h2>
                  <p 
                    className="text-sm md:text-base leading-relaxed"
                    style={{ fontFamily: 'var(--font-space-grotesk)', color: '#022B3A', opacity: 0.7 }}
                  >
                    {card.description}
                  </p>
                </>
              ) : (
                // Step card layout
                <>
                  <div className="flex items-start gap-3 md:gap-4 mb-2 md:mb-3">
                    <div 
                      className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white flex items-center justify-center text-base md:text-lg font-bold"
                      style={{ fontFamily: 'var(--font-poppins)', color: '#022B3A' }}
                    >
                      {card.number}
                    </div>
                    <h3 
                      className="text-lg md:text-xl font-extrabold leading-tight"
                      style={{ fontFamily: 'var(--font-poppins)', color: '#022B3A' }}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <p 
                    className="text-xs md:text-sm leading-relaxed pl-10 md:pl-12"
                    style={{ fontFamily: 'var(--font-space-grotesk)', color: '#022B3A', opacity: 0.7 }}
                  >
                    {card.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Reviews CTA Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12 mt-8 md:mt-12 lg:mt-16 px-3 md:px-4 py-4 md:py-6 rounded-xl md:rounded-2xl max-w-5xl mx-auto">
          {/* Left side - Satisfaction text */}
          <div className="flex items-center gap-2 md:gap-3">
            <span 
              className="text-xs md:text-sm lg:text-base font-medium"
              style={{ 
                fontFamily: 'var(--font-space-grotesk)', 
                color: '#022B3A' 
              }}
            >
              10+ satisfied clients love our services
            </span>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#022B3A' }}>
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Middle - Rating */}
          <div className="flex items-center gap-3 md:gap-4 md:flex-1 md:justify-center">
            <div className="flex gap-0.5 md:gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <div className="flex flex-col">
              <span 
                className="text-sm md:text-base lg:text-lg font-bold leading-tight"
                style={{ 
                  fontFamily: 'var(--font-poppins)', 
                  color: '#022B3A' 
                }}
              >
                4.9
              </span>
              <span 
                className="text-[10px] md:text-xs leading-tight"
                style={{ 
                  fontFamily: 'var(--font-space-grotesk)', 
                  color: '#6B7280' 
                }}
              >
                Based on 10+ reviews
              </span>
            </div>
          </div>

          {/* Right side - View all reviews link */}
          <a 
            href="#"
            className="inline-flex items-center gap-1.5 md:gap-2 font-medium text-xs md:text-sm group"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A",
            }}
          >
            View all reviews
            <svg 
              className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
