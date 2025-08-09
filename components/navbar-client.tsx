"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClassName = "transition-colors font-medium relative";
    if (isActiveLink(path)) {
      return `${baseClassName} text-[#4460a6] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#4460a6] after:rounded-full`;
    }
    return `${baseClassName} text-gray-600 hover:text-[#4460a6]`;
  };

  const getMobileLinkClassName = (path: string) => {
    const baseClassName = "transition-colors font-medium px-2 relative";
    if (isActiveLink(path)) {
      return `${baseClassName} text-[#4460a6] bg-[#4460a6]/10 rounded-md py-2`;
    }
    return `${baseClassName} text-gray-600 hover:text-[#4460a6] py-2`;
  };

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
            <a href="/" className={getLinkClassName("/")}>
              Home
            </a>
            <a href="/blog" className={getLinkClassName("/blog")}>
              Blog
            </a>
            <a href="/about" className={getLinkClassName("/about")}>
              About
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {data.email && (
              <a href={`mailto:${data.email}`} className="bg-[#4460a6] text-white px-4 py-2 rounded-lg hover:bg-[#3a5296] transition-colors font-medium">
                Contact
              </a>
            )}
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
            <div className="flex flex-col space-y-2">
              <a href="/" className={getMobileLinkClassName("/")} onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
              <a href="/blog" className={getMobileLinkClassName("/blog")} onClick={() => setMobileMenuOpen(false)}>
                Blog
              </a>
              <a href="/about" className={getMobileLinkClassName("/about")} onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-200">
                <button className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {data.email && (
                  <a href={`mailto:${data.email}`} className="bg-[#4460a6] text-white px-4 py-2 rounded-lg hover:bg-[#3a5296] transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
