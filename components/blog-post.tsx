/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

// Type definitions based on your Sanity schema
interface Post extends SanityDocument {
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage: {
    asset: {
      _ref: string;
      _id?: string;
      url?: string;
    };
    alt?: string;
  };
  category: {
    title: string;
  };
  publishedAt: string;
  readTime: number;
}

interface BlogCardProps {
  post: Post;
  isFeatured?: boolean;
}

// BlogCard Component
function BlogCard({ post, isFeatured = false }: BlogCardProps) {
  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="bg-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full">
      <Link href={`/blog/${post.slug.current}`} className="h-full flex flex-col">
        <div className="relative">
          {post.mainImage && (
            <img
              src={urlForImage(post.mainImage)
                .width(isFeatured ? 800 : 400)
                .height(isFeatured ? 400 : 200)
                .fit("crop")
                .url()}
              alt={post.mainImage.alt || post.title}
              className={`w-full object-cover ${isFeatured ? "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]" : "h-[150px] sm:h-[180px] md:h-[200px]"}`}
            />
          )}
          {post.category && <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-background px-2 sm:px-4 py-1 rounded-full text-secondary font-geologica text-xs sm:text-sm">{post.category.title}</span>}
        </div>

        <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-secondary/70 font-geologica mb-2 sm:mb-3">
            <span>{formattedDate}</span>
            <span>{post.readTime} min read</span>
          </div>

          <h2 className={`font-prosto text-secondary ${isFeatured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl"} mb-2 sm:mb-3 line-clamp-2`}>{post.title}</h2>

          <p className="paragraph-1 text-secondary/80 text-sm sm:text-base mb-3 sm:mb-4 flex-grow line-clamp-3">{post.excerpt}</p>

          <span className="font-geologica text-sm sm:text-base text-secondary hover:text-secondary/70 transition-colors mt-auto">Read More →</span>
        </div>
      </Link>
    </article>
  );
}

// Blog Section query with simpler options and limited fields
const BLOG_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && !(_id in path('drafts.**'))]|order(publishedAt desc)[0...6]{
  _id,
  title,
  slug,
  excerpt,
  mainImage {
    asset->{
      _id
    },
    alt
  },
  category->{
    title
  },
  publishedAt,
  readTime
}`;

// Main Blog Section Component
export default async function BlogSection() {
  const posts = await client.fetch<Post[]>(
    BLOG_POSTS_QUERY,
    {},
    {
      next: { revalidate: 60 }, // Using ISR with 60-second revalidation
    }
  );

  // If no posts found
  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center">
        <h1 className="heading-1 text-2xl sm:text-3xl md:text-4xl mb-4">Latest Thoughts</h1>
        <p className="paragraph-1">No blog posts found. Check back soon!</p>
      </section>
    );
  }

  // Split posts into featured and recent
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5); // Show up to 4 recent posts

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="heading-1 text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">Latest Thoughts</h1>
        <p className="paragraph-1 text-sm sm:text-base max-w-2xl mx-auto">Exploring ideas, sharing experiences, and documenting the journey of personal and creative growth.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
        {featuredPost && (
          <div className="col-span-1">
            <BlogCard post={featuredPost} isFeatured={true} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
