"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer className="bg-[#4460a6] text-white py-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Want to discuss with us?</h3>
            <p className="">
              Feel free to email us at:{" "}
              <a href="mailto:azkamusfirah@gmail.com">
                <span className="text-white">azkamusfirah@gmail.com</span>
              </a>
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <div className="w-10 h-10 bg-[#91abed] rounded-full flex items-center justify-center">
              <span className="text-sm">i</span>
            </div>

            <div className="w-10 h-10 bg-[#91abed] rounded-full flex items-center justify-center">
              <span className="text-sm">in</span>
            </div>
            <div className="w-10 h-10 bg-[#91abed] rounded-full flex items-center justify-center">
              <span className="text-sm">@</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-white">
          <p className="">Copyright © 2025 - All Rights Reserved</p>
        </div>
      </div>
    </motion.footer>
  );
}
