/* eslint-disable @typescript-eslint/no-explicit-any */
// blog-section.tsx (Server Component)
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { BlogSectionClient } from "./blog-section-client";

// Query for latest posts
const LATEST_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)[0...9]{
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
}`;

// Query for categories with post count
const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc){
  _id,
  title,
  slug,
  color,
  icon,
  description,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

const options = { next: { revalidate: 30 } };

interface BlogSectionProps {
  page?: number;
  postsPerPage?: number;
}

export default async function BlogSection({ page = 1, postsPerPage = 12 }: BlogSectionProps) {
  // Fetch latest posts and categories
  const [latestPosts, categories] = await Promise.all([client.fetch<SanityDocument[]>(LATEST_POSTS_QUERY, {}, options), client.fetch<SanityDocument[]>(CATEGORIES_QUERY, {}, options)]);

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
    return new Date(dateString).toLocaleDateString("id-ID", {
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
      PSIKOLOGI: "#8B5CF6",
      "KESEHATAN MENTAL": "#10B981",
      "PENGEMBANGAN DIRI": "#F59E0B",
      REFLEKSI: "#EF4444",
      KONSELING: "#3B82F6",
      MINDFULNESS: "#8B5CF6",
      HUBUNGAN: "#EC4899",
      MOTIVASI: "#F97316",
      JURNAL: "#6366F1",
      CERITA: "#14B8A6",
    };
    return colorMap[category?.title?.toUpperCase()] || "#6366F1";
  };

  // Transform post data
  const transformPost = (post: SanityDocument) => ({
    id: post._id,
    category: post.category?.title || "Umum",
    categoryColor: getCategoryColor(post.category),
    categoryIcon: getCategoryIconUrl(post.category?.icon),
    title: post.title || "",
    description: post.excerpt || "",
    author: {
      name: post.author?.name || "Azka",
      jobTitle: post.author?.jobTitle || "Mahasiswa Psikologi",
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

  // Transform category data
  const transformCategory = (category: SanityDocument) => ({
    id: category._id,
    title: category.title || "",
    slug: category.slug?.current || "",
    color: getCategoryColor(category),
    icon: getCategoryIconUrl(category.icon),
    postCount: category.postCount || 0,
    description: category.description || `Kumpulan artikel tentang ${category.title?.toLowerCase()}`,
  });

  // Transform data for client component
  const blogData = {
    latestPosts: latestPosts?.map(transformPost) || [],
    categories: categories?.filter((cat: any) => cat.postCount > 0).map(transformCategory) || [],
    pagination: {
      currentPage: page,
      totalPosts: latestPosts?.length || 0,
      postsPerPage,
      totalPages: Math.ceil((latestPosts?.length || 0) / postsPerPage),
    },
  };

  return <BlogSectionClient data={blogData} />;
}
