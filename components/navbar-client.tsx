"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NavbarData {
  title: string;
  logoUrl: string | null;
  email?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface NavbarClientProps {
  data: NavbarData;
}

export function NavbarClient({ data }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header className="bg-white shadow-sm sticky top-0 z-50" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/Mindjourney.png" alt="" width={200} height={200} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-900 hover:text-[#4460a6] transition-colors font-medium">
              Home
            </a>

            <a href="/blog" className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium">
              Blog
            </a>
            <a href="/about" className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium">
              About
            </a>
            {data.email && (
              <a href={`mailto:${data.email}`} className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium">
                Contact
              </a>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Toggle mobile menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-900 hover:text-[#4460a6] transition-colors font-medium px-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
              <a href="/blog" className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium px-2" onClick={() => setMobileMenuOpen(false)}>
                My Blog
              </a>
              <a href="/about" className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium px-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              {data.email && (
                <a href={`mailto:${data.email}`} className="text-gray-600 hover:text-[#4460a6] transition-colors font-medium px-2" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </a>
              )}
              <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-200">
                <button className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
