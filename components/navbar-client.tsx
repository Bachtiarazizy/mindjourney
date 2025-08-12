"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail } from "lucide-react";

interface Category {
  title: string;
  slug: string;
}

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
  categories?: Category[];
}

interface NavbarClientProps {
  data: NavbarData;
}

export function NavbarClient({ data }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    // Handle home page separately
    if (path === "/") return pathname === "/";

    // Handle kategori
    if (path.startsWith("/topik")) {
      return pathname.startsWith("/topik");
    }

    // Untuk halaman lain, gunakan exact match atau startsWith dengan batasan
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // PERBAIKAN: Gunakan Link untuk semua navigasi internal
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={getLinkClassName(href)}>
      {children}
    </Link>
  );

  const getLinkClassName = (path: string) => {
    const baseClassName = "transition-colors font-medium relative flex items-center";
    if (isActiveLink(path)) {
      return `${baseClassName} text-[#4460a6] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#4460a6] after:rounded-full`;
    }
    return `${baseClassName} text-gray-600 hover:text-[#4460a6]`;
  };

  return (
    <motion.header className="bg-white shadow-sm sticky top-0 z-50" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {data.logoUrl ? <Image src={data.logoUrl} alt={data.title} width={120} height={40} /> : <span className="font-bold text-lg">{data.title}</span>}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink href="/">Beranda</NavLink>

            {/* Topik dropdown */}
            <div className="relative group" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button
                className={`flex items-center gap-1 ${
                  isActiveLink("/topik") ? "text-[#4460a6] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#4460a6] after:rounded-full" : "text-gray-600 hover:text-[#4460a6]"
                } font-medium relative`}
              >
                Topik
                <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: dropdownOpen ? 1 : 0,
                  y: dropdownOpen ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden z-50 ${dropdownOpen ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <ul className="py-2 w-60">
                  {data.categories?.map((cat) => (
                    <li key={cat.slug}>
                      <Link href={`/blog?category=${cat.slug}`} className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#4460a6]">
                        {cat.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <NavLink href="/kenalan-yuk">Kenalan yuk</NavLink>
          </nav>

          {/* Contact */}
          <div className="hidden md:flex items-center space-x-4">
            {data.email && (
              <a href={`mailto:${data.email}`} className="bg-[#4460a6] text-white px-4 py-2 rounded-lg hover:bg-[#3a5296] transition-colors font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:text-[#4460a6] transition-colors" aria-label="Toggle mobile menu">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <NavLink href="/">Beranda</NavLink>

              <div className="pt-2">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center gap-1 ${isActiveLink("/topik") ? "text-[#4460a6]" : "text-gray-600"} font-medium relative w-full text-left`}>
                  Topik
                  <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} className="ml-auto">
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="pl-4 mt-2 border-l border-gray-200">
                    <ul className="space-y-2">
                      {data.categories?.map((cat) => (
                        <li key={cat.slug}>
                          <Link href={`/blog?category=${cat.slug}`} className="block py-2 text-gray-600 hover:text-[#4460a6] transition-colors">
                            {cat.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              <NavLink href="/kenalan-yuk">Kenalan yuk</NavLink>

              {data.email && (
                <a href={`mailto:${data.email}`} className="bg-[#4460a6] text-white px-4 py-2 rounded-lg mt-4 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
