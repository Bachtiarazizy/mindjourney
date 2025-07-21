"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
          <Image src="/Mindjourney.png" alt="" width={200} height={200} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/node_modules" className="text-gray-900 hover:text-[#4460a6] transition-colors font-medium">
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

      {/* Social Media Links */}
      {data.socialMedia && (
        <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col space-y-3">
            {data.socialMedia.facebook && (
              <motion.a
                href={data.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white shadow-md rounded-full text-gray-600 hover:text-[#4460a6] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
            )}
            {data.socialMedia.twitter && (
              <motion.a
                href={data.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white shadow-md rounded-full text-gray-600 hover:text-[#4460a6] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </motion.a>
            )}
            {data.socialMedia.instagram && (
              <motion.a
                href={data.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white shadow-md rounded-full text-gray-600 hover:text-[#4460a6] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297zm7.598-9.02c-.49 0-.876-.386-.876-.876s.386-.876.876-.876.876.386.876.876-.386.876-.876.876zm-3.606 5.573c-1.297 0-2.448-.49-3.324-1.297-.807-.876-1.297-2.027-1.297-3.324s.49-2.448 1.297-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297z" />
                </svg>
              </motion.a>
            )}
            {data.socialMedia.linkedin && (
              <motion.a
                href={data.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white shadow-md rounded-full text-gray-600 hover:text-[#4460a6] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
