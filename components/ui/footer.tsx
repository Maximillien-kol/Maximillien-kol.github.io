"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-32 max-w-6xl mx-auto px-6 md:px-8 pt-16 pb-0 border-t" style={{ borderColor: "#BFDBF7" }}>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr] gap-4 md:gap-x-16 mb-12">
        {/* Logo & Description */}
        <div className="md:pr-8">
          <Link href="/">
            <div className="flex items-center mb-4 cursor-pointer">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3">
                <svg width="40" height="40" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M94 0C98.714 0 101.071 0.000378469 102.535 1.46484C104 2.92931 104 5.28596 104 10V45.7598H55.7598C51.0457 45.7598 48.6891 45.7601 47.2246 47.2246C45.7601 48.6891 45.7598 51.0457 45.7598 55.7598V104H10C5.28596 104 2.92931 104 1.46484 102.535C0.000378469 101.071 0 98.714 0 94V10C0 5.28595 0.000377679 2.92931 1.46484 1.46484C2.92931 0.000377679 5.28595 0 10 0H94ZM104 104H94C98.714 104 101.071 104 102.535 102.535C104 101.071 104 98.714 104 94V104Z" fill="#022B3A"/>
                  <path d="M49.9199 59.9199C49.9199 55.2059 49.9199 52.8489 51.3844 51.3844C52.8489 49.9199 55.2059 49.9199 59.9199 49.9199H104V104H49.9199V59.9199Z" fill="#BFDBF7"/>
                </svg>
              </div>
              <span 
                className="font-extrabold text-lg"
                style={{ 
                  fontFamily: "var(--font-poppins)", 
                  color: "#022B3A" 
                }}
              >
                PillarQ
              </span>
            </div>
          </Link>
          <p 
            className="text-sm leading-relaxed max-w-xs"
            style={{ 
              fontFamily: "var(--font-space-grotesk)", 
              color: "#022B3A",
              opacity: 0.7
            }}
          >
            PillarQ offers reliable and flexible Queue system tailored to your business, startup, and enterprise with everything it needs.
          </p>
        </div>


        {/* Products Column */}
        <div>
          <h4 
            className="font-extrabold mb-4 text-sm"
            style={{ 
              fontFamily: "var(--font-poppins)", 
              color: "#022B3A" 
            }}
          >
            Products
          </h4>
          <ul 
            className="space-y-3 text-sm"
            style={{ 
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A"
            }}
          >
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Pillar Core</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Pillar Connect</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">PillarDisplay</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Pillar Hub</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Pillar B-Cloud</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Pillar Link</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Q-Bot</li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 
            className="font-extrabold mb-4 text-sm"
            style={{ 
              fontFamily: "var(--font-poppins)", 
              color: "#022B3A" 
            }}
          >
            Company
          </h4>
          <ul 
            className="space-y-3 text-sm"
            style={{ 
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A"
            }}
          >
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">About PillarQ</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Careers</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Customers</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Press & Media</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Merch</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Legal & Compliance</li>
          </ul>
        </div>

        {/* Partner Column */}
        <div>
          <h4 
            className="font-extrabold mb-4 text-sm"
            style={{ 
              fontFamily: "var(--font-poppins)", 
              color: "#022B3A" 
            }}
          >
            Resource
          </h4>
          <ul 
            className="space-y-3 text-sm"
            style={{ 
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A"
            }}
          >
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Integration Partners</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Hardware Vendors</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Reseller Program</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Enterprise Collaborations</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Startup Accelerator Program</li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 
            className="font-extrabold mb-4 text-sm"
            style={{ 
              fontFamily: "var(--font-poppins)", 
              color: "#022B3A" 
            }}
          >
            Resources
          </h4>
          <ul 
            className="space-y-3 text-sm"
            style={{ 
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A"
            }}
          >
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Documentation</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">API Access</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Help center</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Knowledge Base</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Product Updates</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Support</li>
            <li className="opacity-70 hover:opacity-85 cursor-pointer transition-opacity">Privacy policy</li>
          </ul>
        </div>
      </div>

      {/* Copyright & Social */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 pb-0 m-0 border-t" style={{ borderColor: "#BFDBF7" }}>
        <p 
          className="text-xs m-0 mb-3 md:mb-0"
          style={{ 
            fontFamily: "var(--font-space-grotesk)",
            color: "#022B3A",
            opacity: 0.5
          }}
        >
          Copyright © 2025 PillarQ. All rights reserved. 
        </p>
        
        <div className="flex gap-4 m-0 p-0">
          <a href="#" className="opacity-70 hover:opacity-85 transition-opacity">
            <svg width="20" height="20" fill="#022B3A" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a> 
          <a href="#" className="opacity-70 hover:opacity-85 transition-opacity">
            <svg width="20" height="20" fill="#022B3A" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </a>
          <a href="#" className="opacity-70 hover:opacity-85 transition-opacity">
            <svg width="20" height="20" fill="#022B3A" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5"/>
              <path fill="#fff" d="M12 7a5 5 0 100 10 5 5 0 000-10z"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
            </svg>
          </a>            
        </div>
      </div>
    </footer>
  );
}
