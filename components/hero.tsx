/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 pt-20 pb-8">
      <div className="relative rounded-3xl bg-background p-4 sm:p-8 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
        {/* Pink Background - Maintained */}
        <div className="absolute inset-0 bg-pink-50 rounded-3xl"></div>

        {/* Background Image - Responsive positioning */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
          <img src="/hero.png" alt="Psychology Journey" className="w-[280px] h-[320px] sm:w-[350px] sm:h-[400px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] object-cover rounded-xl" />
        </div>

        {/* Social Media Icons - Top Right */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex gap-2 sm:gap-4">
          <a href="#" className="text-secondary hover:text-secondary/50 transition-colors" aria-label="Twitter">
            <Twitter size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="text-secondary hover:text-secondary/50 transition-colors" aria-label="Github">
            <Github size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="text-secondary hover:text-secondary/50 transition-colors" aria-label="LinkedIn">
            <Linkedin size={20} className="sm:w-6 sm:h-6" />
          </a>
        </div>

        {/* Main Content - Bottom Left */}
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 max-w-[150px] xs:max-w-[200px] sm:max-w-[250px] md:max-w-md z-10">
          <h4 className="font-geologica text-xs sm:text-sm md:text-base text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Begin Your Mind Journey</h4>
          <h1 className="font-prosto text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Transform Your Mind With Us</h1>
        </div>

        {/* Paragraph - Bottom Right, responsive visibility */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 max-w-[150px] sm:max-w-[200px] md:max-w-sm text-right z-10">
          <Link href="/contact" className="button-1 text-xs sm:text-sm md:text-base inline-block mb-2">
            Get Started
          </Link>
          <p className="font-geologica text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            Embark on a transformative journey to unlock your mind&apos;s full potential.
            <span className="hidden sm:inline"> Discover new perspectives and enhance your mental wellness.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
