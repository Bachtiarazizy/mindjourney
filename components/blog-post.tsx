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
    <article className={`bg-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full`}>
      <Link href={`/blog/${post.slug.current}`} className="h-full flex flex-col">
        <div className="relative">
          {post.mainImage && <img src={urlForImage(post.mainImage).url()} alt={post.mainImage.alt || post.title} className={`w-full object-cover ${isFeatured ? "h-[400px]" : "h-[200px]"}`} />}
          {post.category && <span className="absolute top-4 left-4 bg-background px-4 py-1 rounded-full text-secondary font-geologica text-sm">{post.category.title}</span>}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex gap-4 text-sm text-secondary/70 font-geologica mb-3">
            <span>{formattedDate}</span>
            <span>{post.readTime} min read</span>
          </div>

          <h2 className={`font-prosto text-secondary ${isFeatured ? "text-3xl" : "text-xl"} mb-3`}>{post.title}</h2>

          <p className="paragraph-1 text-secondary/80 mb-4 flex-grow">{post.excerpt}</p>

          <span className="font-geologica text-secondary hover:text-secondary/70 transition-colors mt-auto">Read More →</span>
        </div>
      </Link>
    </article>
  );
}

// Blog Section query with revalidation options
const BLOG_POSTS_QUERY = `*[_type == "post" && defined(slug.current) && !(_id in path('drafts.**'))]|order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  excerpt,
  mainImage {
    asset->{
      _id,
      url
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
  // Server component fetching data with no-cache to ensure fresh data
  const posts = await client.fetch<Post[]>(
    BLOG_POSTS_QUERY,
    {},
    {
      cache: "no-store", // Disable caching to always get fresh content
      next: { revalidate: 60 }, // Alternatively, revalidate every 60 seconds
    }
  );

  // If no posts found
  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="heading-1 mb-4">Latest Thoughts</h1>
        <p className="paragraph-1">No blog posts found. Check back soon!</p>
      </section>
    );
  }

  // Split posts into featured and recent
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="heading-1 mb-4">Latest Thoughts</h1>
        <p className="paragraph-1 max-w-2xl mx-auto">Exploring ideas, sharing experiences, and documenting the journey of personal and creative growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredPost && (
          <div className="md:col-span-2">
            <BlogCard post={featuredPost} isFeatured={true} />
          </div>
        )}
        {recentPosts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
