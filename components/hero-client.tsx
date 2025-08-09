/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroData {
  title: string;
  headline: string;
  subheadline: string;
  heroImageUrl: string | null;
}

interface HeroClientProps {
  data: HeroData;
}

export function HeroClient({ data }: HeroClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            {/* heroImage */}
            <div className="rounded-2xl h-96 mb-8 overflow-hidden">{data.heroImageUrl ? <img src={data.heroImageUrl} alt="Hero" className="w-full h-full object-cover" /> : <div className="bg-gray-300 w-full h-full"></div>}</div>
          </motion.div>

          <motion.div className="space-y-8" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="flex items-center space-x-2 text-[#4460a6]">
              <span className="bg-[#36539b] text-white px-2 py-1 text-xs rounded">NEW</span>
              <span className="text-sm">{data.subheadline}</span>
            </div>

            <div>
              <h1 className="text-3xl md:text-6xl font-bold text-gray-900 leading-tight tracking-wide mb-6">
                All Article About
                <br className="mt-2" />
                My Mindjourney.
              </h1>

              {/* featured or latest post image and url later */}
              <div className="flex space-x-4 mb-8">
                <div className="bg-gray-300 w-20 h-16 rounded-lg"></div>
                <div className="bg-gray-300 w-20 h-16 rounded-lg"></div>
              </div>

              <Link href="/blog">
                <motion.button className="flex items-center space-x-2 text-gray-900 group" whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400 }}>
                  <span className="border-b border-gray-900">Explore Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
