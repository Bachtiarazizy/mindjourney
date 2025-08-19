/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
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

interface Category {
  id: string;
  title: string;
  slug: string;
  color: string;
  icon: string | null;
  postCount: number;
  description?: string;
}

interface BlogData {
  latestPosts: BlogPost[];
  categories: Category[];
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
  gap?: number;
}> = ({ children, itemsPerView = 3, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  // Responsive breakpoints
  const updateItemsToShow = useCallback(() => {
    const width = window.innerWidth;

    let newItemsToShow;
    if (width < 640) {
      newItemsToShow = 1; // mobile
    } else if (width < 768) {
      newItemsToShow = Math.min(2, itemsPerView); // small tablet
    } else if (width < 1024) {
      newItemsToShow = Math.min(2, itemsPerView); // tablet
    } else if (width < 1280) {
      newItemsToShow = Math.min(3, itemsPerView); // laptop
    } else {
      newItemsToShow = itemsPerView; // desktop
    }

    // Ensure we don't show more items than available
    newItemsToShow = Math.min(newItemsToShow, totalItems);

    setItemsToShow(newItemsToShow);

    // Reset index if it's out of bounds
    const maxIndex = Math.max(0, totalItems - newItemsToShow);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [itemsPerView, totalItems]);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [updateItemsToShow]);

  // Calculate boundaries
  const maxIndex = Math.max(0, totalItems - itemsToShow);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const shouldShowNavigation = totalItems > itemsToShow;

  // Navigation functions
  const goToPrevious = () => {
    if (canGoPrevious && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToNext = () => {
    if (canGoNext && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canGoNext) {
      goToNext();
    }
    if (isRightSwipe && canGoPrevious) {
      goToPrevious();
    }
  };

  // Calculate item width percentage
  const itemWidthPercent = 100 / itemsToShow;
  const translateX = currentIndex * itemWidthPercent;

  return (
    <div className="w-full mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
        <div className="flex-1 text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          {subtitle && <p className="text-gray-600 text-lg max-w-3xl leading-relaxed text-left">{subtitle}</p>}
        </div>

        {/* Navigation Buttons */}
        {shouldShowNavigation && (
          <div className="hidden md:flex items-center space-x-3 ml-4">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`
                p-3 rounded-full border-2 transition-all duration-200
                ${canGoPrevious && !isTransitioning ? "border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-blue-50 hover:shadow-md" : "border-gray-200 text-gray-300 cursor-not-allowed"}
              `}
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext || isTransitioning}
              className={`
                p-3 rounded-full border-2 transition-all duration-200
                ${canGoNext && !isTransitioning ? "border-gray-300 hover:border-blue-400 text-gray-700 hover:bg-blue-50 hover:shadow-md" : "border-gray-200 text-gray-300 cursor-not-allowed"}
              `}
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${translateX}%)`,
            }}
          >
            {childrenArray.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-3"
                style={{
                  width: `${itemWidthPercent}%`,
                }}
              >
                <div className="h-full">{child}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator (for mobile) */}
        {shouldShowNavigation && itemsToShow === 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 300);
                  }
                }}
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  ${index === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"}
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <div className="group">
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
            {category.icon ? <img src={category.icon} alt={category.title} className="w-6 h-6" /> : <Tag className="w-6 h-6" style={{ color: category.color }} />}
          </div>
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            {category.postCount} artikel
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.title}</h3>

        {category.description && <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{category.description}</p>}

        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
          <span>Lihat artikel</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};

export const BlogSectionClient: React.FC<BlogSectionClientProps> = ({ data }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Latest Posts Carousel */}
        {data.latestPosts.length > 0 && (
          <Carousel title="Tulisan terbaru untuk kamu" subtitle="" itemsPerView={3}>
            {data.latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
};
