"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Instagram, Linkedin, Heart, ArrowUp } from "lucide-react";
import Link from "next/link";
import WalkingTotoro from "./walking-totoro";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative">
      {/* Walking Totoro Animation - positioned on top of footer */}
      <div className="relative z-20 flex justify-center md:justify-start md:pl-12 lg:pl-20 -mb-8 md:-mb-12">
        <WalkingTotoro className="transform" />
      </div>

      <motion.footer className="relative bg-gradient-to-br from-[#4460a6] via-[#5a73b8] to-[#4460a6] text-white overflow-hidden pt-12 md:pt-16" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                             radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand & Description */}
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">mindjourneyme</h3>
                <p className="text-blue-100 leading-relaxed">Jurnal perjalanan tumbuh dalam memahami diri, orang lain, dan kehidupan. Semoga setiap tulisan di sini bisa menjadi cermin atau pelukan kecil untukmu.</p>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <div className="flex flex-wrap gap-4">
                  <Link href="/" className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline">
                    Beranda
                  </Link>
                  <Link href="/blog" className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline">
                    Blog
                  </Link>
                  <Link href="/kenalan-yuk" className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline">
                    About
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-300" />
                Let&apos;s Connect
              </h3>

              <div className="space-y-4">
                <p className="text-blue-100 leading-relaxed">Punya pertanyaan atau ingin berbagi cerita?</p>

                <motion.a
                  href="mailto:azkamusfirah@gmail.com"
                  className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                  <span className="font-medium group-hover:text-white">azkamusfirah@gmail.com</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
              <h3 className="text-xl font-bold mb-4">Follow My Journey</h3>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-6 h-6 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>

                <motion.a
                  href="#"
                  className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-6 h-6 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>
              </div>

              {/* Back to Top Button */}
              <motion.button onClick={scrollToTop} className="inline-flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-300 mt-6 group" whileHover={{ y: -2 }}>
                <ArrowUp className="w-4 h-4 group-hover:animate-bounce" />
                <span className="text-sm font-medium">Back to Top</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-blue-100">
                <span>Made with</span>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Heart className="w-4 h-4 text-pink-300 fill-current" />
                </motion.div>
                <span>by Azka</span>
              </div>

              <p className="text-blue-100 text-sm">Copyright © 2025 mindjourneyme. All Rights Reserved</p>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-20 left-10 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-50"></div>
      </motion.footer>
    </div>
  );
}
