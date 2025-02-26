"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Get current pathname for active state
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  const navLinks = [
    { name: "Portfolio", path: "/portofolio" },
    { name: "About Me", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActivePath = (path: string) => {
    return pathname === path ? "text-secondary font-bold" : "text-secondary hover:opacity-80 transition-opacity";
  };

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isSticky ? "bg-primary shadow-md py-2" : "bg-primary py-4"}`}>
      <nav className="container mx-auto px-4 max-w-7xl">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left menu */}
          <ul className="flex space-x-8">
            {navLinks.slice(0, 2).map((link) => (
              <li key={link.path}>
                <a href={link.path} className={`font-geologica transition-opacity ${isActivePath(link.path)}`}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Logo - Centered */}
          <div className="flex-shrink-0 text-center">
            <a href="/" className={`font-prosto text-2xl transition-all duration-300 px-4 py-2 ${isSticky ? "hover:bg-opacity-10 hover:bg-secondary" : ""} ${isActivePath("/")}`}>
              MindJourney
            </a>
          </div>

          {/* Right menu */}
          <ul className="flex space-x-8">
            {navLinks.slice(2).map((link) => (
              <li key={link.path}>
                <a href={link.path} className={`font-geologica transition-opacity ${isActivePath(link.path)}`}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          {/* Mobile Logo - Left aligned */}
          <div className="flex items-center">
            <a href="/" className={`font-prosto text-xl transition-opacity ${isActivePath("/")}`}>
              MindJourney
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-secondary hover:bg-secondary hover:bg-opacity-10 p-2 rounded-lg transition-all duration-300" aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-primary shadow-lg rounded-lg p-4">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.path} className="border-b border-secondary border-opacity-20 pb-2">
                  <a href={link.path} className={`font-geologica block transition-opacity ${isActivePath(link.path)}`} onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
