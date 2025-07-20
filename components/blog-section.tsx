// blog-section.tsx (Server Component)
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { BlogSectionClient } from "./blog-section-client";

// Queries for different blog sections
const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...2]{
  title,
  excerpt,
  slug,
  mainImage,
  category->{
    title,
    slug
  },
  author->{
    name,
    slug
  },
  publishedAt,
  readTime
}`;

const RECOMMENDED_POSTS_QUERY = `*[_type == "post" && recommended == true] | order(publishedAt desc)[0...3]{
  title,
  excerpt,
  slug,
  mainImage,
  category->{
    title,
    slug
  },
  author->{
    name,
    slug
  },
  publishedAt,
  readTime
}`;

const FAVORITE_POSTS_QUERY = `*[_type == "post" && favorite == true] | order(publishedAt desc)[0...4]{
  title,
  excerpt,
  slug,
  mainImage,
  category->{
    title,
    slug
  },
  author->{
    name,
    slug
  },
  publishedAt,
  readTime
}`;

const options = { next: { revalidate: 30 } };

export default async function BlogSection() {
  // Fetch all blog data server-side
  const [featuredPosts, recommendedPosts, favoritePosts] = await Promise.all([
    client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(RECOMMENDED_POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(FAVORITE_POSTS_QUERY, {}, options),
  ]);

  // Helper function for image URLs
  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.url() || null;
    } catch {
      return null;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Transform data for client component
  const blogData = {
    featuredPosts:
      featuredPosts?.map((post) => ({
        category: post.category?.title?.toUpperCase() || "GENERAL",
        title: post.title || "",
        description: post.excerpt || "",
        author: post.author?.name || "Anonymous",
        date: formatDate(post.publishedAt),
        imageUrl: getImageUrl(post.mainImage),
        slug: post.slug?.current || "",
        readTime: post.readTime || 5,
      })) || [],

    recommendedPosts:
      recommendedPosts?.map((post) => ({
        category: post.category?.title?.toUpperCase() || "GENERAL",
        title: post.title || "",
        description: post.excerpt || "",
        author: post.author?.name || "Anonymous",
        date: formatDate(post.publishedAt),
        imageUrl: getImageUrl(post.mainImage),
        slug: post.slug?.current || "",
        readTime: post.readTime || 5,
      })) || [],

    favoritePosts:
      favoritePosts?.map((post) => ({
        category: post.category?.title?.toUpperCase() || "GENERAL",
        title: post.title || "",
        description: post.excerpt || "",
        author: post.author?.name || "Anonymous",
        date: formatDate(post.publishedAt),
        imageUrl: getImageUrl(post.mainImage),
        slug: post.slug?.current || "",
        readTime: post.readTime || 5,
      })) || [],
  };

  return <BlogSectionClient data={blogData} />;
}
