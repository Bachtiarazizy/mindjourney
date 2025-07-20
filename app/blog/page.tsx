// app/blog/page.tsx
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { BlogListingClient } from "@/components/blog-listing-client";

// Query for all published posts with pagination
const BLOG_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) [$start...$end] {
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
  readTime,
  featured,
  premium
}`;

// Query for total count
const BLOG_COUNT_QUERY = `count(*[_type == "post"])`;

// Query for categories
const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  title,
  slug,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

// Query for featured posts
const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
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

const POSTS_PER_PAGE = 9;

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Blog | Discover Latest Articles",
  description: "Explore our collection of articles covering business, beauty, technology, and more. Stay updated with the latest insights and trends.",
};

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category;
  const searchTerm = searchParams.search;

  // Build dynamic query based on filters
  let postsQuery = BLOG_POSTS_QUERY;
  let countQuery = BLOG_COUNT_QUERY;

  if (selectedCategory) {
    postsQuery = `*[_type == "post" && category->slug.current == "${selectedCategory}"] | order(publishedAt desc) [$start...$end] {
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
      readTime,
      featured,
      premium
    }`;
    countQuery = `count(*[_type == "post" && category->slug.current == "${selectedCategory}"])`;
  }

  if (searchTerm) {
    const searchFilter = selectedCategory ? `&& category->slug.current == "${selectedCategory}" && (title match "${searchTerm}*" || excerpt match "${searchTerm}*")` : `&& (title match "${searchTerm}*" || excerpt match "${searchTerm}*")`;

    postsQuery = `*[_type == "post" ${searchFilter}] | order(publishedAt desc) [$start...$end] {
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
      readTime,
      featured,
      premium
    }`;
    countQuery = `count(*[_type == "post" ${searchFilter}])`;
  }

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  // Fetch data
  const [posts, totalPosts, categories, featuredPosts] = await Promise.all([
    client.fetch<SanityDocument[]>(postsQuery, { start, end }, options),
    client.fetch<number>(countQuery, {}, options),
    client.fetch<SanityDocument[]>(CATEGORIES_QUERY, {}, options),
    searchTerm || selectedCategory ? [] : client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Helper functions
  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.url() || null;
    } catch {
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Transform data for client component
  const blogData = {
    posts:
      posts?.map((post) => ({
        title: post.title || "",
        excerpt: post.excerpt || "",
        slug: post.slug?.current || "",
        imageUrl: getImageUrl(post.mainImage),
        category: {
          title: post.category?.title || "General",
          slug: post.category?.slug?.current || "",
        },
        author: {
          name: post.author?.name || "Anonymous",
          slug: post.author?.slug?.current || "",
        },
        publishedAt: formatDate(post.publishedAt),
        readTime: post.readTime || 5,
        featured: post.featured || false,
        premium: post.premium || false,
      })) || [],

    featuredPosts:
      featuredPosts?.map((post) => ({
        title: post.title || "",
        excerpt: post.excerpt || "",
        slug: post.slug?.current || "",
        imageUrl: getImageUrl(post.mainImage),
        category: {
          title: post.category?.title || "General",
          slug: post.category?.slug?.current || "",
        },
        author: {
          name: post.author?.name || "Anonymous",
          slug: post.author?.slug?.current || "",
        },
        publishedAt: formatDate(post.publishedAt),
        readTime: post.readTime || 5,
        featured: post.featured || false,
        premium: post.premium || false,
      })) || [],

    categories:
      categories?.map((cat) => ({
        title: cat.title || "",
        slug: cat.slug?.current || "",
        postCount: cat.postCount || 0,
      })) || [],

    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },

    filters: {
      selectedCategory: selectedCategory || "",
      searchTerm: searchTerm || "",
    },
  };

  return <BlogListingClient data={blogData} />;
}
