/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { SanityDocument } from "next-sanity";
import { urlForImage } from "@/sanity/image";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity-fetch";

// Type definitions
interface Post extends SanityDocument {
  title: string;
  slug: {
    current: string;
  };
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
    _id: string;
  };
  publishedAt: string;
  readTime: number;
  excerpt?: string;
}

interface Category extends SanityDocument {
  title: string;
  _id: string;
}

// Function to generate metadata for the page
export async function generateMetadata() {
  return {
    title: "Blog | Our Latest Articles",
    description: "Explore our collection of articles and insights on various topics",
  };
}

// Featured Post Card Component
function FeaturedPostCard({ post }: { post: Post }) {
  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug.current}`}>
      <div className="group grid md:grid-cols-2 gap-8 mb-12 p-6 rounded-lg border border-secondary/10 hover:bg-secondary/5 transition-colors">
        {post.mainImage && (
          <div className="md:order-2">
            <img src={urlForImage(post.mainImage).width(600).height(400).url()} alt={post.mainImage.alt || post.title} className="w-full h-64 object-cover rounded-md" />
          </div>
        )}
        <div className="flex flex-col justify-between md:order-1">
          {post.category && (
            <div className="mb-3">
              <span className="text-xs uppercase tracking-wide font-geologica text-secondary/70">{post.category.title}</span>
            </div>
          )}
          <h2 className="font-prosto text-2xl md:text-3xl text-secondary group-hover:text-accent transition-colors mb-4">{post.title}</h2>
          <p className="text-secondary/80 font-geologica text-base mb-6 line-clamp-3">{post.excerpt || "Read our latest article..."}</p>
          <div className="text-sm text-secondary/60 font-geologica mt-auto">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Regular Post Card Component
function PostCard({ post }: { post: Post }) {
  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug.current}`}>
      <div className="group flex flex-col h-full border border-secondary/10 rounded-lg overflow-hidden hover:bg-secondary/5 transition-colors">
        {post.mainImage && (
          <div className="h-48">
            <img src={urlForImage(post.mainImage).width(400).height(240).url()} alt={post.mainImage.alt || post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          {post.category && (
            <div className="mb-2">
              <span className="text-xs uppercase tracking-wide font-geologica text-secondary/70">{post.category.title}</span>
            </div>
          )}
          <h3 className="font-prosto text-xl text-secondary group-hover:text-accent transition-colors mb-3 line-clamp-2">{post.title}</h3>
          <p className="text-secondary/80 font-geologica text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt || "Read more..."}</p>
          <div className="text-xs text-secondary/60 font-geologica mt-auto">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main blog page component
export default async function BlogPage() {
  // Fetch featured posts (latest 1) with improved caching
  const featuredPosts = await sanityFetch<Post[]>({
    query: `*[_type == "post" && !(_id in path('drafts.**'))][0]{
      _id,
      title,
      slug,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      category->{
        title,
        _id
      },
      publishedAt,
      readTime,
      excerpt
    }`,
    revalidate: 3600, // Cache for 1 hour
    tags: ["post"], // For on-demand revalidation
  });

  // Fetch regular posts with improved performance
  const posts = await sanityFetch<Post[]>({
    query: `*[_type == "post" && !(_id in path('drafts.**'))][1..12]{
      _id,
      title,
      slug,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      category->{
        title,
        _id
      },
      publishedAt,
      readTime,
      excerpt
    } | order(publishedAt desc)`,
    revalidate: 3600,
    tags: ["post"],
  });

  // Fetch all categories with caching
  const categories = await sanityFetch<Category[]>({
    query: `*[_type == "category" && !(_id in path('drafts.**'))]{
      _id,
      title
    } | order(title asc)`,
    revalidate: 3600 * 24, // Categories change less often
    tags: ["category"],
  });

  return (
    <main className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Page Header */}
        <header className="mb-16 text-center">
          <h1 className="font-prosto text-4xl md:text-5xl text-secondary font-normal mb-6">Our Blog</h1>
          <p className="font-geologica text-secondary/80 max-w-2xl mx-auto">Explore our collection of articles and insights on various topics</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - Left side */}
          <div className="lg:w-2/3">
            {/* Featured Post Section */}
            {featuredPosts[0] && (
              <section className="mb-16">
                <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Featured Article</h2>
                <FeaturedPostCard post={featuredPosts[0]} />
              </section>
            )}

            {/* Regular Posts Grid */}
            <section>
              <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Pagination (if needed) */}
              {posts.length > 10 && (
                <div className="mt-12 flex justify-center">
                  <div className="inline-flex items-center">
                    <button className="px-4 py-2 border border-secondary/10 rounded-l-md text-secondary/70 hover:bg-secondary/5">Previous</button>
                    <button className="px-4 py-2 border-t border-b border-r border-secondary/10 text-secondary">1</button>
                    <button className="px-4 py-2 border-t border-b border-secondary/10 text-secondary/70 hover:bg-secondary/5">2</button>
                    <button className="px-4 py-2 border-t border-b border-r border-secondary/10 rounded-r-md text-secondary/70 hover:bg-secondary/5">Next</button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Categories & Newsletter (Right side) */}
          <aside className="lg:w-1/3">
            <div className="sticky top-20 space-y-8">
              {/* Categories Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-6 pb-3 border-b border-secondary/10">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link key={category._id} href={`/blog/category/${category.title.toLowerCase()}`} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs hover:bg-secondary/20 transition-colors">
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-4">Subscribe to our Newsletter</h2>
                <p className="text-sm text-secondary/80 font-geologica mb-6">Stay updated with our latest articles and news delivered directly to your inbox.</p>
                <form className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
