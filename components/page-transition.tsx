"use client";

import React, { useState, useEffect } from "react";

// The PageTransition wrapper component
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (children !== displayChildren) {
      // Start transition out
      setTransitionStage("fadeOut");
      setIsTransitioning(true);
    }
  }, [children, displayChildren]);

  const handleTransitionEnd = () => {
    if (transitionStage === "fadeOut") {
      // Change the content
      setDisplayChildren(children);
      // Start transition in
      setTransitionStage("fadeIn");
    } else if (transitionStage === "fadeIn") {
      setIsTransitioning(false);
    }
  };

  // Page change detector
  useEffect(() => {
    const handleRouteChange = () => {
      setTransitionStage("fadeOut");
      setIsTransitioning(true);

      setTimeout(() => {
        setTransitionStage("fadeIn");
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 500);
    };

    // Listen for page navigation events
    window.addEventListener("popstate", handleRouteChange);

    // Add click listener to all internal links
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        handleRouteChange();

        // Navigate after transition
        setTimeout(() => {
          window.location.href = link.href;
        }, 500);
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  return (
    <>
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-transform duration-500 ease-in-out ${
          transitionStage === "fadeOut" ? "transform-active" : transitionStage === "fadeIn" && isTransitioning ? "transform-reverse" : "transform-inactive"
        }`}
      >
        <div className="w-full h-full relative overflow-hidden">
          {/* Creative transition elements */}
          <div className="absolute inset-0 bg-secondary transition-all duration-500 transform -translate-x-full transition-effect-1"></div>
          <div className="absolute inset-0 bg-primary transition-all duration-500 transform -translate-x-full transition-effect-2"></div>

          {/* Optional animated elements for more visual interest */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-secondary scale-0 transition-all duration-700 transition-effect-circle"></div>
        </div>
      </div>

      {/* Page content */}
      <div onTransitionEnd={handleTransitionEnd} className={`transition-opacity duration-500 ${transitionStage === "fadeOut" ? "opacity-0" : "opacity-100"}`}>
        {displayChildren}
      </div>

      {/* CSS for animation */}
      <style jsx global>{`
        .transform-active .transition-effect-1 {
          transform: translateX(0);
          transition-delay: 0s;
        }

        .transform-active .transition-effect-2 {
          transform: translateX(0);
          transition-delay: 0.1s;
        }

        .transform-active .transition-effect-circle {
          transform: translate(-50%, -50%) scale(1);
          transition-delay: 0.2s;
        }

        .transform-reverse .transition-effect-1 {
          transform: translateX(100%);
          transition-delay: 0.2s;
        }

        .transform-reverse .transition-effect-2 {
          transform: translateX(100%);
          transition-delay: 0.1s;
        }

        .transform-reverse .transition-effect-circle {
          transform: translate(-50%, -50%) scale(0);
          transition-delay: 0s;
        }

        .transform-inactive .transition-effect-1,
        .transform-inactive .transition-effect-2 {
          transform: translateX(-100%);
        }
      `}</style>
    </>
  );
}

// Example usage in Layout component
