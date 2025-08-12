/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/queries/blog.ts
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

// ===========================================
// SANITY QUERIES
// ===========================================

export const BLOG_QUERIES = {
  // All posts query
  ALL_POSTS: `*[_type == "post"] | order(publishedAt desc) {
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
  }`,

  // Featured posts query
  FEATURED_POSTS: `*[_type == "post" && featured == true] | order(publishedAt desc) {
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
  }`,

  // Categories query
  CATEGORIES: `*[_type == "category"] | order(title asc) {
    title,
    slug,
    color,
    icon,
    "postCount": count(*[_type == "post" && references(^._id)])
  }`,

  // Available filters query
  AVAILABLE_FILTERS: `{
    "tags": array::unique(*[_type == "post"].tags[]),
    "authors": *[_type == "author"] | order(name asc) {
      name,
      slug
    }
  }`,

  // Recent posts query
  RECENT_POSTS: `*[_type == "post"] | order(publishedAt desc)[0...$limit] {
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
  }`,

  // Posts by category query
  POSTS_BY_CATEGORY: `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
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
  }`,
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export const getImageUrl = (imageAsset: any, width = 800, height = 600) => {
  if (!imageAsset?.asset) return null;
  try {
    return urlForImage(imageAsset.asset)?.width(width).height(height).url() || null;
  } catch {
    return null;
  }
};

export const getAvatarUrl = (imageAsset: any, size = 100) => {
  if (!imageAsset?.asset) return null;
  try {
    return urlForImage(imageAsset.asset)?.width(size).height(size).url() || null;
  } catch {
    return null;
  }
};

export const getCategoryIconUrl = (imageAsset: any, size = 32) => {
  if (!imageAsset?.asset) return null;
  try {
    return urlForImage(imageAsset.asset)?.width(size).height(size).url() || null;
  } catch {
    return null;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getCategoryColor = (category: any) => {
  if (category?.color?.hex) return category.color.hex;

  const colorMap: { [key: string]: string } = {
    BEAUTY: "#FF6B9D",
    SKINCARE: "#4ECDC4",
    MAKEUP: "#FFE66D",
    WELLNESS: "#95E1D3",
    LIFESTYLE: "#A8E6CF",
    REVIEWS: "#FF8B94",
    TUTORIALS: "#B4A7D6",
    TRENDS: "#FFAAA5",
    HEALTH: "#F7B2BD",
    FASHION: "#C8A8E9",
    FOOD: "#FFB347",
  };

  return colorMap[category?.title?.toUpperCase()] || "#6366F1";
};

// ===========================================
// TRANSFORM FUNCTIONS
// ===========================================

export const transformPost = (post: SanityDocument) => ({
  id: post._id,
  category: post.category?.title || "GENERAL",
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

export const transformCategory = (category: SanityDocument) => ({
  title: category.title || "",
  slug: category.slug?.current || "",
  postCount: category.postCount || 0,
  color: category.color?.hex || getCategoryColor(category),
  icon: getCategoryIconUrl(category.icon),
});

export const transformAuthor = (author: SanityDocument) => ({
  name: author.name || "Anonymous",
  slug: author.slug?.current || "",
});

// ===========================================
// FETCH FUNCTIONS
// ===========================================

const defaultOptions = { next: { revalidate: 60 } };

/**
 * Fetch recent posts for home page
 */
export async function fetchHomePosts(limit: number = 12) {
  try {
    const posts = await client.fetch<SanityDocument[]>(BLOG_QUERIES.RECENT_POSTS, { limit }, defaultOptions);
    return posts?.map(transformPost) || [];
  } catch (error) {
    console.error("Error fetching home posts:", error);
    return [];
  }
}

/**
 * Fetch featured posts
 */
export async function fetchFeaturedPosts(limit?: number) {
  try {
    const query = limit ? `${BLOG_QUERIES.FEATURED_POSTS}[0...${limit}]` : BLOG_QUERIES.FEATURED_POSTS;

    const posts = await client.fetch<SanityDocument[]>(query, {}, defaultOptions);
    return posts?.map(transformPost) || [];
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(limit?: number) {
  try {
    const query = limit ? `${BLOG_QUERIES.CATEGORIES}[0...${limit}]` : BLOG_QUERIES.CATEGORIES;

    const categories = await client.fetch<SanityDocument[]>(query, {}, defaultOptions);
    return categories?.map(transformCategory) || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch posts by category
 */
export async function fetchPostsByCategory(categorySlug: string, limit?: number) {
  try {
    const query = limit ? `${BLOG_QUERIES.POSTS_BY_CATEGORY}[0...${limit}]` : BLOG_QUERIES.POSTS_BY_CATEGORY;

    const posts = await client.fetch<SanityDocument[]>(query, { categorySlug }, defaultOptions);
    return posts?.map(transformPost) || [];
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

/**
 * Fetch available filters (tags and authors)
 */
export async function fetchAvailableFilters() {
  try {
    const filters = await client.fetch<{
      tags: string[];
      authors: SanityDocument[];
    }>(BLOG_QUERIES.AVAILABLE_FILTERS, {}, defaultOptions);

    return {
      tags: filters?.tags?.filter(Boolean) || [],
      authors: filters?.authors?.map(transformAuthor) || [],
    };
  } catch (error) {
    console.error("Error fetching available filters:", error);
    return { tags: [], authors: [] };
  }
}

/**
 * Fetch complete blog data for home page
 */
export async function fetchHomeBlogData(
  options: {
    postsLimit?: number;
    featuredLimit?: number;
    categoriesLimit?: number;
  } = {}
) {
  const { postsLimit = 12, featuredLimit = 6, categoriesLimit = 8 } = options;

  try {
    const [posts, featuredPosts, categories] = await Promise.all([fetchHomePosts(postsLimit), fetchFeaturedPosts(featuredLimit), fetchCategories(categoriesLimit)]);

    return {
      posts,
      featuredPosts,
      categories,
    };
  } catch (error) {
    console.error("Error fetching home blog data:", error);
    return {
      posts: [],
      featuredPosts: [],
      categories: [],
    };
  }
}

/**
 * Build dynamic query with filters for blog listing page
 */
export function buildFilteredQuery(filters: { category?: string; search?: string; tag?: string; author?: string }) {
  const conditions = [];

  if (filters.category) {
    conditions.push(`category->slug.current == "${filters.category}"`);
  }

  if (filters.search) {
    const escapedSearchTerm = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    conditions.push(`(title match "*${escapedSearchTerm}*" || excerpt match "*${escapedSearchTerm}*" || pt::text(body) match "*${escapedSearchTerm}*")`);
  }

  if (filters.tag) {
    conditions.push(`"${filters.tag}" in tags`);
  }

  if (filters.author) {
    conditions.push(`author->slug.current == "${filters.author}"`);
  }

  const filterCondition = conditions.length > 0 ? `&& (${conditions.join(" && ")})` : "";

  return {
    postsQuery: `*[_type == "post" ${filterCondition}] | order(publishedAt desc) [$start...$end] {
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
    }`,
    countQuery: `count(*[_type == "post" ${filterCondition}])`,
  };
}

/**
 * Fetch filtered posts for blog listing page
 */
export async function fetchFilteredPosts(
  filters: {
    category?: string;
    search?: string;
    tag?: string;
    author?: string;
  },
  pagination: {
    page: number;
    postsPerPage: number;
  }
) {
  const { postsQuery, countQuery } = buildFilteredQuery(filters);
  const start = (pagination.page - 1) * pagination.postsPerPage;
  const end = start + pagination.postsPerPage;

  try {
    const [posts, totalPosts, categories, availableFilters] = await Promise.all([
      client.fetch<SanityDocument[]>(postsQuery, { start, end }, defaultOptions),
      client.fetch<number>(countQuery, {}, defaultOptions),
      fetchCategories(),
      fetchAvailableFilters(),
    ]);

    const totalPages = Math.ceil(totalPosts / pagination.postsPerPage);

    return {
      posts: posts?.map(transformPost) || [],
      totalPosts,
      totalPages,
      categories,
      availableFilters,
      pagination: {
        currentPage: pagination.page,
        totalPages,
        totalPosts,
        hasNextPage: pagination.page < totalPages,
        hasPrevPage: pagination.page > 1,
        postsPerPage: pagination.postsPerPage,
      },
    };
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      categories: [],
      availableFilters: { tags: [], authors: [] },
      pagination: {
        currentPage: pagination.page,
        totalPages: 0,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false,
        postsPerPage: pagination.postsPerPage,
      },
    };
  }
}
