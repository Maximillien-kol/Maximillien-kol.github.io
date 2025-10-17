"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import { Globe } from "./globe";

export default function FeaturesSectionDemo() {
  const features = [
    {
      category: "Smart Queue System",
      title: "Manage Queues with AI-Powered Efficiency",
      description: "Reduce wait times with smart automation that streamlines customer flow, freeing up time for what matters most.",
      cta: "Get Started",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10",
      decorColor: "bg-orange-200/40 dark:bg-orange-700/20"
    },
    {
      category: "Real-Time Notifications",
      title: "Keep Customers Informed Seamlessly",
      description: "Bring your customers peace of mind with live updates, instant alerts, and status tracking—no more messy communication gaps.",
      cta: "Try It Now",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      decorColor: "bg-blue-200/40 dark:bg-blue-700/20"
    },
    {
      category: "Seamless Integrations",
      title: "Connect with Your Favorite Tools",
      description: "Integrate with popular platforms and services to keep your workflow efficient and connected across all systems.",
      cta: "Explore Integrations",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
      decorColor: "bg-purple-200/40 dark:bg-purple-700/20"
    },
    {
      category: "Advanced Analytics",
      title: "Make Data-Driven Decisions",
      description: "Gain insights with real-time analytics and reports, helping you optimize performance and drive better results.",
      cta: "View Insights",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
      decorColor: "bg-green-200/40 dark:bg-green-700/20"
    }
  ];

  return (
    <div className="relative z-20 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p 
            className="text-xs md:text-sm tracking-[0.3em] mb-4 uppercase"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            OUR FEATURES
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-poppins)",
              color: "#022B3A",
            }}
          >
            Supercharge Your Workflow
          </h2>
          <p 
            className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: '#6B7280' }}
          >
            Powerful features designed to streamline your operations, boost productivity, and drive results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative overflow-hidden rounded-3xl p-8 lg:p-10",
                feature.bgColor
              )}
            >
              {/* Decorative Circle */}
              <div className={cn(
                "absolute -right-16 -top-16 w-64 h-64 rounded-full blur-2xl opacity-50",
                feature.decorColor
              )} />
              
              {/* Content */}
              <div className="relative z-10">
                <div 
                  className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  {feature.category}
                </div>
                
                <h3 
                  className="text-xl font-extrabold mb-4 leading-tight"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: "#022B3A",
                  }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-sm leading-relaxed mb-6"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  {feature.description}
                </p>
                
                <a 
                  href="#"
                  className="inline-flex items-center gap-2 font-semibold text-sm group"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  {feature.cta}
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-2 sm:p-4 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-lg md:text-xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-xs md:text-sm max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-xs my-1"
      )}
    >
      {children}
    </p>
  );
};

// POS Demo Component - Shows daily revenue with percentage increase
const PosDemo = () => {
  return (
    <div className="space-y-3">
      {/* Percentage Increase Card - Inline */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-3.5 inline-flex items-center gap-2.5 shadow-sm">
        <div className="w-11 h-11 bg-[#00D084] rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-black dark:text-white leading-none mb-0.5">30%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">vs Yesterday</div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-11 h-11 bg-black dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Revenue</div>
        </div>
        <div className="text-3xl font-bold text-black dark:text-white">$2,545.00</div>
      </div>
    </div>
  );
};

// Inventory Demo Component - Shows purchase order interface
const InventoryDemo = () => {
  return (
    <div className="space-y-2.5">
      {/* Action Buttons */}
      <button className="w-full bg-[#00D084] hover:bg-[#00B872] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
        Open Purchase
        <span className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">3</span>
      </button>
      
      <button className="w-full bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600">
        Sent Purchase
        <span className="w-6 h-6 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">0</span>
      </button>

      {/* Item Card */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium">Receive</div>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            🍅
          </div>
          <div className="flex-1">
            <div className="font-bold text-black dark:text-white mb-1.5 text-base">Tomato</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Perfect by ripe for rich pasta sauces, vibrant salads, or a caprese finish.
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm font-bold text-black dark:text-white">USD 5.00</div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Demo Component - Shows analytics interface
const DashboardDemo = () => {
  return (
    <div className="space-y-2.5">
      {/* Dropdown Filters */}
      <div className="space-y-2">
        <div className="relative">
          <select className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer">
            <option>All locations</option>
            <option>Location 1</option>
            <option>Location 2</option>
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="relative">
          <select className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer">
            <option>All Order Types</option>
            <option>Dine In</option>
            <option>Takeout</option>
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Sales Card */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-sm">
        <h4 className="text-lg font-bold text-black dark:text-white mb-2">Total Sales</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          Track your daily, weekly, and monthly sales performance at a glance.
        </p>
        
        <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

