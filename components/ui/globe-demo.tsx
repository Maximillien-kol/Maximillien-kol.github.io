"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const GlobeComponent = dynamic(() => import("./globe"), { ssr: false });

export default function GlobeDemo() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full"
      >
        <GlobeComponent />
      </motion.div>
      {/* Beautiful animated arcs and rings can be added here in future */}
    </div>
  );
}
