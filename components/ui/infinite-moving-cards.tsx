"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl overflow-hidden md:w-[580px]"
            style={{
              backgroundColor: '#F9F9F9',
              border: '1px solid rgba(191, 219, 247, 0.5)'
            }}
            key={item.name}
          >
            <blockquote className="flex flex-col lg:flex-row gap-0">
              {/* Top/Left Column - Business Types */}
              <div 
                className="flex flex-col justify-between p-4 lg:p-6 lg:min-w-[160px]"
                style={{
                  backgroundColor: '#BFDBF7',
                  borderBottom: '1px solid rgba(191, 219, 247, 0.5)',
                  borderRight: 'none'
                }}
                // Add border-right only on large screens
                data-border-right="lg:border-r lg:border-b-0"
              >
                <style jsx>{`
                  @media (min-width: 1024px) {
                    div[data-border-right] {
                      border-right: 1px solid rgba(191, 219, 247, 0.5);
                      border-bottom: none !important;
                    }
                  }
                `}</style>
                <div className="flex items-start gap-2 mb-3 lg:mb-0">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4B5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span 
                    className="text-xs font-medium"
                    style={{ 
                      color: '#4B5563',
                      fontFamily: 'var(--font-space-grotesk)'
                    }}
                  >
                    Business Types
                  </span>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 items-start flex-wrap">
                  <span 
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ 
                      backgroundColor: '#F9F9F9',
                      color: '#022B3A',
                      fontFamily: 'var(--font-space-grotesk)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    SaaS
                  </span>
                  <span 
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ 
                      backgroundColor: '#F9F9F9',
                      color: '#022B3A',
                      fontFamily: 'var(--font-space-grotesk)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    L. Conversion
                  </span>
                  <span 
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ 
                      backgroundColor: '#F9F9F9',
                      color: '#022B3A',
                      fontFamily: 'var(--font-space-grotesk)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sales Boost
                  </span>
                </div>
              </div>

              {/* Bottom/Right Column - Testimonial Content */}
              <div 
                className="flex-1 flex flex-col p-4 lg:p-6"
                style={{
                  backgroundColor: '#FFFFFF'
                }}
              >
                {/* Author Info with Avatar */}
                <div className="flex items-center gap-3 mb-4 lg:mb-20">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden flex-shrink-0" style={{ borderWidth: '0px', borderColor: '#BFDBF7', borderStyle: 'solid' }}>
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm lg:text-base font-bold" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span 
                      className="text-sm lg:text-base leading-tight font-bold mb-0.5"
                      style={{ 
                        color: '#022B3A',
                        fontFamily: 'var(--font-poppins)'
                      }}
                    >
                      {item.name}
                    </span>
                    <span 
                      className="text-[10px] lg:text-xs leading-tight"
                      style={{ 
                        color: '#4B5563',
                        fontFamily: 'var(--font-space-grotesk)'
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-3 lg:mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 stroke-yellow-500" viewBox="0 0 24 24" strokeWidth="0.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span 
                    className="ml-2 text-sm lg:text-base font-semibold" 
                    style={{ 
                      color: '#022B3A',
                      fontFamily: 'var(--font-poppins)'
                    }}
                  >
                    5.0
                  </span>
                </div>

                {/* Quote */}
                <p 
                  className="text-xs lg:text-sm leading-relaxed"
                  style={{ 
                    color: '#1F2937',
                    fontFamily: 'var(--font-space-grotesk)'
                  }}
                >
                  "{item.quote}"
                </p>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
