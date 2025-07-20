/* eslint-disable @typescript-eslint/no-explicit-any */
// components/blog-detail-client.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar, Share2, Twitter, Facebook, Linkedin, Copy, Star, Lock, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Import your client config
import { client } from "@/sanity/client";

interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl: string | null;
  content: any[];
  category: {
    title: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
    bio: string;
    imageUrl: string | null;
  };
  publishedAt: string;
  readTime: number;
  featured: boolean;
  premium: boolean;
  tags: string[];
}

interface RelatedPost {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl: string | null;
  category: {
    title: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
  };
  publishedAt: string;
  readTime: number;
  featured: boolean;
  premium: boolean;
}

interface BlogDetailData {
  post: BlogPost;
  relatedPosts: RelatedPost[];
}

interface BlogDetailClientProps {
  data: BlogDetailData;
}

// Create URL builder
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) => (projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null);

// Simplified Portable Text components following official pattern
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;

      const imageUrl = urlFor(value)?.width(800).height(400).url();
      if (!imageUrl) return null;

      return (
        <div className="my-8">
          <Image src={imageUrl} alt={value.alt || ""} width={800} height={400} className="rounded-lg shadow-lg w-full h-auto" />
          {value.caption && <p className="text-sm text-gray-500 text-center mt-2 italic">{value.caption}</p>}
        </div>
      );
    },
    code: ({ value }: any) => (
      <pre className="bg-gray-900 text-white p-4 rounded-lg my-6 overflow-x-auto">
        <code>{value.code}</code>
      </pre>
    ),
  },

  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">{children}</h4>,
    normal: ({ children }: any) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-pink-500 pl-6 py-2 my-6 bg-pink-50 rounded-r-lg">
        <div className="text-gray-700 italic">{children}</div>
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-700">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{children}</code>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 underline">
        {children}
      </a>
    ),
  },

  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
  },

  listItem: {
    bullet: ({ children }: any) => <li className="text-gray-700">{children}</li>,
    number: ({ children }: any) => <li className="text-gray-700">{children}</li>,
  },
};

export function BlogDetailClient({ data }: BlogDetailClientProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { post, relatedPosts } = data;

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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
    }
    setShowShareMenu(false);
  };

  const RelatedPostCard = ({ post: relatedPost }: { post: RelatedPost }) => (
    <motion.article className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" variants={fadeInUp} whileHover={{ y: -5 }}>
      <Link href={`/blog/${relatedPost.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {relatedPost.imageUrl ? (
            <Image src={relatedPost.imageUrl} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
              <span className="text-pink-500 text-lg font-medium">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {relatedPost.featured && (
              <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {relatedPost.premium && (
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-pink-500 px-3 py-1 rounded-full text-xs font-semibold">{relatedPost.category.title}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">{relatedPost.title}</h3>

          <p className="text-gray-600 mb-4 line-clamp-2">{relatedPost.excerpt}</p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{relatedPost.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{relatedPost.readTime} min</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{relatedPost.publishedAt}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );

  // Simplified content rendering following official pattern
  const renderPortableText = () => {
    // Basic validation - just check if content exists and is an array
    if (!post.content || !Array.isArray(post.content)) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No content available.</p>
        </div>
      );
    }

    if (post.content.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Content is empty.</p>
        </div>
      );
    }

    try {
      return (
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.content} components={portableTextComponents} />
        </div>
      );
    } catch (error) {
      console.error("Error rendering PortableText:", error);
      return (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg mb-4">Error rendering content.</p>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-sm text-gray-500">
              <summary>Error Details</summary>
              <pre className="mt-2 p-4 bg-red-50 rounded text-left overflow-auto text-red-700">{error instanceof Error ? error.message : String(error)}</pre>
            </details>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Blog Button */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div {...fadeInUp}>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/blog" className="hover:text-pink-500 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/blog?category=${post.category.slug}`} className="hover:text-pink-500 transition-colors">
                {post.category.title}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 truncate">{post.title}</span>
            </nav>

            {/* Article Header */}
            <div className="mb-8">
              {/* Badges */}
              <div className="flex items-center space-x-3 mb-4">
                {post.featured && (
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Featured Article
                  </span>
                )}
                {post.premium && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Premium Content
                  </span>
                )}
                <Link href={`/blog?category=${post.category.slug}`} className="bg-pink-100 text-pink-700 hover:bg-pink-200 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  {post.category.title}
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-gray-200">
                <div className="flex items-center space-x-6">
                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    {post.author.imageUrl ? (
                      <Image src={post.author.imageUrl} alt={post.author.name} width={48} height={48} className="rounded-full" />
                    ) : (
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-pink-500" />
                      </div>
                    )}
                    <div>
                      <Link href={`/authors/${post.author.slug}`} className="font-medium text-gray-900 hover:text-pink-500 transition-colors">
                        {post.author.name}
                      </Link>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>

                  {/* Date and Read Time */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.publishedAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[160px]">
                      <button onClick={() => handleShare("twitter")} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button onClick={() => handleShare("facebook")} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button onClick={() => handleShare("linkedin")} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        <span>LinkedIn</span>
                      </button>
                      <button onClick={() => handleShare("copy")} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                        <Copy className="w-4 h-4 text-gray-600" />
                        <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg mb-12">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw" priority />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {renderPortableText()}
          </motion.article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div className="mt-12 pt-8 border-t border-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Bio */}
          {post.author.bio && (
            <motion.div className="mt-12 p-8 bg-gray-50 rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <div className="flex items-start space-x-4">
                {post.author.imageUrl ? (
                  <Image src={post.author.imageUrl} alt={post.author.name} width={80} height={80} className="rounded-full" />
                ) : (
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-pink-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About {post.author.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-3xl font-bold text-gray-900 text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              Related Articles
            </motion.h2>

            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Click outside to close share menu */}
      {showShareMenu && <div className="fixed inset-0 z-30" onClick={() => setShowShareMenu(false)} />}
    </div>
  );
}
