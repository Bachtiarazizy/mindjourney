/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BlogCard } from "./blog-card";

interface Author {
  name: string;
  jobTitle: string;
  shortBio: string;
  image: string | null;
  slug: string;
}

interface BlogPost {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: string | null;
  title: string;
  description: string;
  author: Author;
  date: string;
  imageUrl: string | null;
  imageAlt: string;
  slug: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  recommended: boolean;
  favorite: boolean;
  premium: boolean;
}

interface BlogData {
  featuredPosts: BlogPost[];
  recommendedPosts: BlogPost[];
  favoritePosts: BlogPost[];
  allPosts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPosts: number;
    postsPerPage: number;
    totalPages: number;
  };
}

interface BlogSectionClientProps {
  data: BlogData;
}

const Carousel: React.FC<{
  children: React.ReactNode;
  itemsPerView?: number;
  title: string;
  subtitle?: string;
}> = ({ children, itemsPerView = 3, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);

  const childrenArray = React.Children.toArray(children);

  // Fix: Pastikan maxIndex tidak negatif dan sesuai dengan jumlah item
  const maxIndex = Math.max(0, childrenArray.length - itemsToShow);

  // Fix: Jika item kurang dari itemsToShow, set currentIndex ke 0
  const effectiveIndex = childrenArray.length <= itemsToShow ? 0 : Math.min(currentIndex, maxIndex);

  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;

      if (width >= 1280) setItemsToShow(Math.min(itemsPerView, childrenArray.length));
      else if (width >= 1024) setItemsToShow(Math.min(3, itemsPerView, childrenArray.length));
      else if (width >= 768) setItemsToShow(Math.min(2, childrenArray.length));
      else setItemsToShow(1);
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [itemsPerView, childrenArray.length]);

  // Fix: Reset currentIndex jika melebihi maxIndex setelah resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrevious = effectiveIndex > 0;
  const canGoNext = effectiveIndex < maxIndex && childrenArray.length > itemsToShow;

  // Fix: Jika jumlah item <= itemsToShow, jangan tampilkan navigation
  const showNavigation = childrenArray.length > itemsToShow;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        {/* Navigation buttons - hanya tampil jika diperlukan */}
        {showNavigation && (
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className={`p-3 rounded-full border transition-all ${canGoPrevious ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={`p-3 rounded-full border transition-all ${canGoNext ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            // Fix: Transform yang konsisten untuk semua ukuran layar
            transform: `translateX(-${effectiveIndex * (100 / itemsToShow)}%)`,
            // Fix: Width container yang konsisten
            width: `${(childrenArray.length * 100) / itemsToShow}%`,
          }}
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="px-3 flex-shrink-0"
              style={{
                // Fix: Width per item yang konsisten
                width: `${100 / childrenArray.length}%`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className={`p-2 rounded-lg ${currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-lg font-medium ${page === currentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`p-2 rounded-lg ${currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export const BlogSectionClient: React.FC<BlogSectionClientProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(data.pagination.currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you'd update the URL and refetch data
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Posts Carousel */}
        {data.featuredPosts.length > 0 && (
          <Carousel title="What I'm Excited to Share" subtitle="The pieces I can't wait for you to read right now." itemsPerView={3}>
            {data.featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}

        {/* Favorite Posts Carousel */}
        {data.favoritePosts.length > 0 && (
          <Carousel title="Close to My Heart" subtitle="Stories and reflections that mean the most to me (and, I hope, to you too)." itemsPerView={4}>
            {data.favoritePosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}

        {/* All Posts Grid */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Every Story So Far</h2>
              <p className="text-gray-600">A little library of everything I&lsquo;ve written — from everyday thoughts to deeper reflections.</p>
            </div>

            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium">
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.allPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={data.pagination.totalPages} onPageChange={handlePageChange} />}
        </div>
      </div>
    </section>
  );
};
