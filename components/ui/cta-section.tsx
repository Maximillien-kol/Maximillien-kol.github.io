"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <div className="relative z-30 px-4 pt-10 md:pt-32 pb-0 mt-20 bg-transparent">

      {/* Main CTA Content */}
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-8">
            <svg width="52" height="52" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M94 0C98.714 0 101.071 0.000378469 102.535 1.46484C104 2.92931 104 5.28596 104 10V45.7598H55.7598C51.0457 45.7598 48.6891 45.7601 47.2246 47.2246C45.7601 48.6891 45.7598 51.0457 45.7598 55.7598V104H10C5.28596 104 2.92931 104 1.46484 102.535C0.000378469 101.071 0 98.714 0 94V10C0 5.28595 0.000377679 2.92931 1.46484 1.46484C2.92931 0.000377679 5.28595 0 10 0H94ZM104 104H94C98.714 104 101.071 104 102.535 102.535C104 101.071 104 98.714 104 94V104Z" fill="#022B3A"/>
              <path d="M49.9199 59.9199C49.9199 55.2059 49.9199 52.8489 51.3844 51.3844C52.8489 49.9199 55.2059 49.9199 59.9199 49.9199H104V104H49.9199V59.9199Z" fill="#BFDBF7"/>
            </svg>
          </div>
        </div>
        
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          style={{ 
            fontFamily: "var(--font-poppins)", 
            color: "#022B3A" 
          }}
        >
          Make every minute count
        </h2>
        
        <p 
          className="text-base md:text-lg mb-10 max-w-xl mx-auto"
          style={{ 
            fontFamily: "var(--font-space-grotesk)", 
            color: "#022B3A" 
          }}
        >
          10+ enterprises are ready to experience how time moves faster and they call our workplace home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/waitlist">
            <Button
              size="lg"
              className="font-sans px-8"
              style={{
                backgroundColor: "#022B3A",
                color: "#F9F9F9",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Join Wishlist
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="font-sans gap-2"
            style={{
              color: "#022B3A",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            <span>▶</span>
            Explore PillarQ
          </Button>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto mb-12 opacity-40">
          <div className="text-gray-400 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>SQUARESPACE</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>grammarly</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>INTERCOM</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Lattice</div>
          <div className="text-gray-400 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>codecademy</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto opacity-40">
          <div className="text-gray-400 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>GitHub</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>miro</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>slack</div>
          <div className="text-gray-500 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>zapier</div>
          <div className="text-gray-400 font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>DocuSign</div>
        </div>
      </div>
    </div>
  );
}
