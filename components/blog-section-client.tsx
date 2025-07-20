/* eslint-disable @typescript-eslint/no-unused-vars */
// blog-section-client.tsx (Client Component)
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string | null;
  slug: string;
  readTime: number;
}

interface BlogSectionData {
  featuredPosts: BlogPost[];
  recommendedPosts: BlogPost[];
  favoritePosts: BlogPost[];
}

interface BlogSectionClientProps {
  data: BlogSectionData;
}

export function BlogSectionClient({ data }: BlogSectionClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const BlogPostCard = ({ post, className = "", size = "large" }: { post: BlogPost; className?: string; size?: "large" | "medium" | "small" }) => (
    <motion.article className={`group cursor-pointer ${className}`} variants={fadeInUp} whileHover={{ y: size === "large" ? -10 : -5 }} transition={{ duration: 0.3 }}>
      <a href={`/blog/${post.slug}`} className="block">
        <div className={`relative rounded-xl overflow-hidden mb-4 ${size === "large" ? "h-48" : size === "medium" ? "h-56" : "h-40"}`}>
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes={size === "large" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"} />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        <span className="text-pink-500 text-sm font-medium">{post.category}</span>

        <h3 className={`font-bold text-gray-900 mt-2 mb-3 group-hover:text-pink-500 transition-colors ${size === "large" ? "text-xl" : size === "medium" ? "text-lg" : "text-base"}`}>{post.title}</h3>

        <p className={`text-gray-600 mb-4 ${size === "small" ? "text-sm" : ""}`}>{post.description}</p>

        <div className="flex items-center space-x-3">
          <div className={`bg-gray-400 rounded-full flex-shrink-0 ${size === "large" ? "w-8 h-8" : "w-6 h-6"}`}></div>
          <div>
            <p className={`font-medium text-gray-900 ${size === "small" ? "text-sm" : ""}`}>{post.author}</p>
            <p className={`text-gray-500 ${size === "small" ? "text-xs" : "text-sm"}`}>
              {post.date} • {post.readTime} min read
            </p>
          </div>
        </div>
      </a>
    </motion.article>
  );

  return (
    <>
      {/* Featured Blog Section */}
      {data.featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 className="text-4xl font-bold text-gray-900" {...fadeInUp}>
                Featured Blog
              </motion.h2>
              <div className="flex space-x-2">
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.div className={`grid gap-8 ${data.featuredPosts.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"}`} variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {data.featuredPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-6" size="large" />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Recommended Blog Section */}
      {data.recommendedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 className="text-4xl font-bold text-gray-900" {...fadeInUp}>
                Recommended Blog
              </motion.h2>
              <div className="flex space-x-2">
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {data.recommendedPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} size="medium" />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Premium Content CTA */}
      <motion.section className="py-16 bg-gradient-to-r from-pink-100 to-yellow-50" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="bg-gray-300 rounded-2xl h-80" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}></motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <span className="text-pink-500 font-medium">Register Now</span>
              <h2 className="text-4xl font-bold text-gray-900">
                Want to access our
                <br />
                <em className="text-gray-700">premium content?</em>
              </h2>
              <p className="text-gray-600">
                Sometimes features require a short description.
                <br />
                This can be detailed description.
              </p>
              <div className="flex space-x-4">
                <motion.button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Register Now
                </motion.button>
                <button className="text-gray-900 px-6 py-3 border-b border-gray-900 hover:border-pink-500 hover:text-pink-500 transition-colors">Contact Us</button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Favorite Article Section */}
      {data.favoritePosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <span className="text-pink-500 font-medium">Article Source</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Our Favorite Article</h2>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-8 mb-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {data.favoritePosts.slice(0, 2).map((post, index) => (
                <BlogPostCard key={post.slug} post={post} size="medium" />
              ))}
            </motion.div>

            {data.favoritePosts.length > 2 && (
              <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                {data.favoritePosts.slice(2, 4).map((post, index) => (
                  <BlogPostCard key={post.slug} post={post} size="medium" />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <motion.div className="flex justify-center items-center space-x-2 mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button key={page} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${page === 1 ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-200"}`}>
                  {page}
                </button>
              ))}
              <button className="text-gray-600 hover:text-pink-500 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
