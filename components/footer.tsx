"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer className="bg-pink-800 text-white py-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Want to discuss with us?</h3>
            <p className="text-pink-200">
              Feel free to email us at: <span className="text-white">getintouch@gmail.com</span>
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <div className="w-10 h-10 bg-pink-700 rounded-full flex items-center justify-center">
              <span className="text-sm">f</span>
            </div>
            <div className="w-10 h-10 bg-pink-700 rounded-full flex items-center justify-center">
              <span className="text-sm">t</span>
            </div>
            <div className="w-10 h-10 bg-pink-700 rounded-full flex items-center justify-center">
              <span className="text-sm">in</span>
            </div>
            <div className="w-10 h-10 bg-pink-700 rounded-full flex items-center justify-center">
              <span className="text-sm">@</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-pink-700">
          <p className="text-pink-200">Copyright © 2023 - All Rights Reserved</p>
        </div>
      </div>
    </motion.footer>
  );
}
