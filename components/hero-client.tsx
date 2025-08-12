/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

interface FeaturedPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string;
}

interface HeroData {
  title: string;
  headline: string;
  subheadline: string;
  heroImageUrl: string | null;
  featuredPosts: FeaturedPost[];
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

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, delay: 0.3 },
  };

  return (
    <>
      {/* Hero Section - Centered */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div className="space-y-8 text-center lg:text-left" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
                  <span className="block mb-2">Selamat datang di</span>
                  <span className="block mb-2 text-4xl md:text-6xl lg:text-7xl text-blue-600">mindjourneyme</span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-gray-600">jurnal perjalanan tumbuhku</span>
                </h1>

                {/* Featured posts preview */}
                {data.featuredPosts && data.featuredPosts.length > 0 && (
                  <div className="flex justify-center lg:justify-start space-x-4 mb-10">
                    {data.featuredPosts.slice(0, 3).map((post, index) => (
                      <motion.div key={post.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}>
                        <Link href={`/blog/${post.slug}`}>
                          <div className="group w-20 h-16 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105">
                            {post.imageUrl ? (
                              <img src={post.imageUrl} alt={post.imageAlt} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300" />
                            ) : (
                              <div
                                className={`w-full h-full ${index === 0 ? "bg-gradient-to-br from-blue-100 to-indigo-100" : index === 1 ? "bg-gradient-to-br from-purple-100 to-pink-100" : "bg-gradient-to-br from-green-100 to-emerald-100"}`}
                              ></div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Fallback jika tidak ada featured posts */}
                {(!data.featuredPosts || data.featuredPosts.length === 0) && (
                  <div className="flex justify-center lg:justify-start space-x-4 mb-10">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-16 rounded-xl shadow-sm"></div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-16 rounded-xl shadow-sm"></div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-16 rounded-xl shadow-sm"></div>
                  </div>
                )}

                <div className="flex justify-center lg:justify-start">
                  <Link href="/blog">
                    <motion.button
                      className="group flex items-center space-x-3 bg-[#4460a6] text-white px-6 py-3 rounded-xl hover:bg-[#4460a6]/75 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="font-medium">Baca tulisan terbaru</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div {...fadeInUp} className="flex justify-center">
              <div className="relative rounded-3xl h-96 w-full max-w-lg overflow-hidden shadow-2xl">
                {data.heroImageUrl ? (
                  <img src={data.heroImageUrl} alt="Hero" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInLeft} className="space-y-8">
            {/* Decorative element */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>

            {/* <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Perkenalan singkat</h2> */}

            <div className="relative">
              <motion.blockquote className="text-lg md:text-xl leading-relaxed text-gray-700 font-light max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                &quot;Halo, aku <span className="font-semibold text-gray-900">Azka</span>. Mahasiswa bimbingan dan psikologi konseling yang gemar mengamati hidup dan menuliskannya. Blog ini adalah jurnal perjalananku memahami diri, orang
                lain, dan kehidupan. Semoga setiap tulisanku di sini bisa menjadi cermin atau pelukan kecil untukmu.&quot;
              </motion.blockquote>

              {/* Decorative quotes */}
              <div className="absolute -top-4 -left-4 text-6xl text-blue-200 font-serif">&quot;</div>
              <div className="absolute -bottom-8 -right-4 text-6xl text-blue-200 font-serif">&quot;</div>
            </div>

            {/* Small heart decoration */}
            <motion.div className="flex justify-center mt-12" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
              <Heart className="w-6 h-6 text-red-400 fill-current" />
            </motion.div>

            {/* Subtle pattern background */}
            <div className="absolute inset-0 -z-10 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, blue 1px, transparent 1px),
                                 radial-gradient(circle at 70% 50%, indigo 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
