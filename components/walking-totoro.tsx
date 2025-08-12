"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

interface WalkingTotoroProps {
  className?: string;
}

const WalkingTotoro: React.FC<WalkingTotoroProps> = ({ className = "" }) => {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load animation data from public folder
    const loadAnimation = async () => {
      try {
        const response = await fetch("/lotties/Totoro Walk.json");
        if (!response.ok) {
          throw new Error("Failed to load animation");
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className={`relative z-20 ${className}`}>
        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full animate-pulse flex items-center justify-center shadow-lg">
          <motion.span className="text-2xl" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            🐾
          </motion.span>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (hasError || !animationData) {
    return (
      <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className={`relative z-20 ${className}`}>
        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
          <motion.span className="text-2xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            🌟
          </motion.span>
        </div>
      </motion.div>
    );
  }

  const lottieOptions = {
    animationData,
    loop: true,
    autoplay: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{
        opacity: 1,
        x: 0,
        // Add a subtle walking animation
        y: [0, -5, 0],
      }}
      transition={{
        opacity: { duration: 1 },
        x: { duration: 1.2 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`relative z-20 ${className}`}
    >
      <div
        className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
        }}
      >
        <Lottie {...lottieOptions} className="w-full h-full" />
      </div>
    </motion.div>
  );
};

export default WalkingTotoro;
