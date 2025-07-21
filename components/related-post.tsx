/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/client";
import { Calendar, Clock, Star } from "lucide-react";

interface RelatedPost {
  title: string;
  slug: {
    current: string;
  };
  mainImage?: any;
  category?: {
    title: string;
    slug: {
      current: string;
    };
  };
  publishedAt: string;
  readTime?: number;
  featured?: boolean;
  excerpt?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => {
        const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.url() : null;

        return (
          <Link key={post.slug.current} href={`/blog/${post.slug.current}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200">
            <div className="relative">
              {imageUrl ? (
                <div className="aspect-video overflow-hidden">
                  <Image src={imageUrl} alt={post.title} width={400} height={250} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <div className="text-pink-300 text-4xl font-bold">{post.title.charAt(0)}</div>
                </div>
              )}

              {/* Category Badge */}
              {post.category && (
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-pink-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm">{post.category.title}</span>
                </div>
              )}

              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-400/90 backdrop-blur-sm text-yellow-900 p-1.5 rounded-full shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight">{post.title}</h3>

              {post.excerpt && <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                {post.readTime && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{post.readTime} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-200 rounded-xl transition-colors pointer-events-none"></div>
          </Link>
        );
      })}
    </div>
  );
}
