"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  // Avatar images
  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
  ];

  return (
    <div className="py-16 md:py-24 rounded-3xl flex flex-col antialiased items-center justify-center relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <p 
            className="text-xs md:text-sm tracking-[0.3em] mb-4 uppercase"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            OUR CUSTOMERS
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-poppins)', color: '#022B3A' }}
          >
            Our success stories
          </h2>
          <p 
            className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            Real leaders share how they crushed dead-end leads and boosted sales with our game-changing AI solutions.
          </p>
        </div>

        {/* Avatars Row */}
        <div className="relative mb-12 md:mb-16 overflow-hidden max-w-xl mx-auto">
          <div 
            className="flex justify-center items-center gap-2"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 40%, black 50%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, black 50%, transparent)'
            }}
          >
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{
                  borderColor: '#BFDBF7'
                }}
              >
                <img 
                  src={avatar} 
                  alt={`Customer ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Moving Cards */}
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />

        {/* Trusted By Section */}
        <div className="text-center mt-16 md:mt-20">
          <p 
            className="text-xs md:text-sm tracking-[0.3em] uppercase"
            style={{ 
              fontFamily: 'var(--font-space-grotesk)', 
              color: '#6B7280' 
            }}
          >
            Trusted by over 10+ companies
          </p>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "This AI completely transformed our lead strategy dead-end prospects disappeared, and we're closing deals faster than ever with incredible efficiency!",
    name: "Ethan Parker",
    title: "CTO, NextGen SaaS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    quote:
      "Manual tasks vanished overnight AI automation saved us countless hours and our CRM seamlessly, revolutionizing the workflow process!",
    name: "Emily Nguyen",
    title: "Operations Manager, CloudSync Ltd.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
  },
  {
    quote:
      "Generic responses died, personalized messages soared, and now every customer interaction delivers unmatched value instantly!",
    name: "Sarah Johnson",
    title: "Marketing Director, TechFlow",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
  },
  {
    quote:
      "Our sales team productivity doubled within weeks, and lead conversion rates skyrocketed beyond our wildest expectations!",
    name: "Michael Chen",
    title: "VP Sales, InnovateCorp",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
  },
  {
    quote:
      "The AI solution integrated perfectly with our existing tools, creating a seamless workflow that boosted team efficiency dramatically!",
    name: "Jessica Williams",
    title: "COO, DataDrive Solutions",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
  },
];
