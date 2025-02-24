"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get current pathname for active state
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  const navLinks = [
    { name: "Portfolio", path: "/portfolio" },
    { name: "About Me", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActivePath = (path: string) => {
    return pathname === path ? "text-secondary font-bold" : "text-secondary hover:opacity-80";
  };

  return (
    <header className="w-full container mx-auto px-4 bg-primary py-4">
      <nav className="max-w-7xl mx-auto">
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

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className={`font-prosto text-2xl transition-opacity ${isActivePath("/")}`}>
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
          {/* Mobile Logo */}
          <a href="/" className={`font-prosto text-xl transition-opacity ${isActivePath("/")}`}>
            MindJourney
          </a>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-secondary hover:opacity-80 transition-opacity">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
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
