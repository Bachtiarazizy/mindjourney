/* eslint-disable @typescript-eslint/no-explicit-any */
// blog-section.tsx (Server Component)
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { BlogSectionClient } from "./blog-section-client";

// Enhanced queries matching your schema
const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...6]{
  _id,
  title,
  excerpt,
  slug,
  mainImage{
    asset,
    alt
  },
  category->{
    title,
    slug,
    color,
    icon
  },
  author->{
    name,
    slug,
    image,
    jobTitle,
    shortBio
  },
  publishedAt,
  readTime,
  tags,
  premium
}`;

const RECOMMENDED_POSTS_QUERY = `*[_type == "post" && recommended == true] | order(publishedAt desc)[0...8]{
  _id,
  title,
  excerpt,
  slug,
  mainImage{
    asset,
    alt
  },
  category->{
    title,
    slug,
    color,
    icon
  },
  author->{
    name,
    slug,
    image,
    jobTitle,
    shortBio
  },
  publishedAt,
  readTime,
  tags,
  premium
}`;

const FAVORITE_POSTS_QUERY = `*[_type == "post" && favorite == true] | order(publishedAt desc)[0...12]{
  _id,
  title,
  excerpt,
  slug,
  mainImage{
    asset,
    alt
  },
  category->{
    title,
    slug,
    color,
    icon
  },
  author->{
    name,
    slug,
    image,
    jobTitle,
    shortBio
  },
  publishedAt,
  readTime,
  tags,
  premium
}`;

// Query for all posts with pagination support
const ALL_POSTS_QUERY = `{
  "posts": *[_type == "post"] | order(publishedAt desc)[$start...$end]{
    _id,
    title,
    excerpt,
    slug,
    mainImage{
      asset,
      alt
    },
    category->{
      title,
      slug,
      color,
      icon
    },
    author->{
      name,
      slug,
      image,
      jobTitle,
      shortBio
    },
    publishedAt,
    readTime,
    tags,
    featured,
    recommended,
    favorite,
    premium
  },
  "total": count(*[_type == "post"])
}`;

const options = { next: { revalidate: 30 } };

interface BlogSectionProps {
  page?: number;
  postsPerPage?: number;
}

export default async function BlogSection({ page = 1, postsPerPage = 12 }: BlogSectionProps) {
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;

  // Fetch all blog data server-side
  const [featuredPosts, recommendedPosts, favoritePosts, allPostsData] = await Promise.all([
    client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(RECOMMENDED_POSTS_QUERY, {}, options),
    client.fetch<SanityDocument[]>(FAVORITE_POSTS_QUERY, {}, options),
    client.fetch<{ posts: SanityDocument[]; total: number }>(ALL_POSTS_QUERY, { start, end }, options),
  ]);

  // Helper function for image URLs with alt text
  const getImageUrl = (imageAsset: any) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(800).height(600).url() || null;
    } catch {
      return null;
    }
  };

  // Helper function for avatar URLs
  const getAvatarUrl = (imageAsset: any) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(100).height(100).url() || null;
    } catch {
      return null;
    }
  };

  // Helper function for category icon URLs
  const getCategoryIconUrl = (imageAsset: any) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(32).height(32).url() || null;
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

  // Helper function to get category color
  const getCategoryColor = (category: any) => {
    if (category?.color?.hex) return category.color.hex;
    // Fallback colors based on category title
    const colorMap: { [key: string]: string } = {
      BEAUTY: "#FF6B9D",
      SKINCARE: "#4ECDC4",
      MAKEUP: "#FFE66D",
      WELLNESS: "#95E1D3",
      LIFESTYLE: "#A8E6CF",
      REVIEWS: "#FF8B94",
      TUTORIALS: "#B4A7D6",
      TRENDS: "#FFAAA5",
    };
    return colorMap[category?.title?.toUpperCase()] || "#6366F1";
  };

  // Transform post data
  const transformPost = (post: SanityDocument) => ({
    id: post._id,
    category: post.category?.title?.toUpperCase() || "GENERAL",
    categoryColor: getCategoryColor(post.category),
    categoryIcon: getCategoryIconUrl(post.category?.icon),
    title: post.title || "",
    description: post.excerpt || "",
    author: {
      name: post.author?.name || "Anonymous",
      jobTitle: post.author?.jobTitle || "",
      shortBio: post.author?.shortBio || "",
      image: getAvatarUrl(post.author?.image),
      slug: post.author?.slug?.current || "",
    },
    date: formatDate(post.publishedAt),
    imageUrl: getImageUrl(post.mainImage),
    imageAlt: post.mainImage?.alt || post.title || "",
    slug: post.slug?.current || "",
    readTime: post.readTime || 5,
    tags: post.tags || [],
    featured: post.featured || false,
    recommended: post.recommended || false,
    favorite: post.favorite || false,
    premium: post.premium || false,
  });

  // Transform data for client component
  const blogData = {
    featuredPosts: featuredPosts?.map(transformPost) || [],
    recommendedPosts: recommendedPosts?.map(transformPost) || [],
    favoritePosts: favoritePosts?.map(transformPost) || [],
    allPosts: allPostsData?.posts?.map(transformPost) || [],
    pagination: {
      currentPage: page,
      totalPosts: allPostsData?.total || 0,
      postsPerPage,
      totalPages: Math.ceil((allPostsData?.total || 0) / postsPerPage),
    },
  };

  return <BlogSectionClient data={blogData} />;
}
