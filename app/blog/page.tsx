/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/page.tsx
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { BlogListingClient } from "@/components/blog-listing-client";

// Enhanced queries matching your schema structure
// const BLOG_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) [$start...$end] {
//   _id,
//   title,
//   excerpt,
//   slug,
//   mainImage{
//     asset,
//     alt
//   },
//   category->{
//     title,
//     slug,
//     color,
//     icon
//   },
//   author->{
//     name,
//     slug,
//     image,
//     jobTitle,
//     shortBio
//   },
//   publishedAt,
//   readTime,
//   tags,
//   featured,
//   recommended,
//   favorite,
//   premium
// }`;

// const BLOG_COUNT_QUERY = `count(*[_type == "post"])`;

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  title,
  slug,
  color,
  icon,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...6] {
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

const POSTS_PER_PAGE = 12;

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  tag?: string;
  author?: string;
}

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Blog | Latest Articles & Stories",
  description: "Explore our collection of articles covering beauty, skincare, wellness, and lifestyle. Stay updated with the latest insights and trends.",
};

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category;
  const searchTerm = searchParams.search;
  const selectedTag = searchParams.tag;
  const selectedAuthor = searchParams.author;

  // Build dynamic queries based on filters
  const buildFilters = () => {
    const filters = [];

    if (selectedCategory) {
      filters.push(`category->slug.current == "${selectedCategory}"`);
    }

    if (searchTerm) {
      filters.push(`(title match "${searchTerm}*" || excerpt match "${searchTerm}*" || pt::text(body) match "${searchTerm}*")`);
    }

    if (selectedTag) {
      filters.push(`"${selectedTag}" in tags`);
    }

    if (selectedAuthor) {
      filters.push(`author->slug.current == "${selectedAuthor}"`);
    }

    return filters.length > 0 ? `&& ${filters.join(" && ")}` : "";
  };

  const filterCondition = buildFilters();

  const postsQuery = `*[_type == "post" ${filterCondition}] | order(publishedAt desc) [$start...$end] {
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

  const countQuery = `count(*[_type == "post" ${filterCondition}])`;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  // Fetch data
  const [posts, totalPosts, categories, featuredPosts] = await Promise.all([
    client.fetch<SanityDocument[]>(postsQuery, { start, end }, options),
    client.fetch<number>(countQuery, {}, options),
    client.fetch<SanityDocument[]>(CATEGORIES_QUERY, {}, options),
    // Only fetch featured posts if no filters are applied
    !selectedCategory && !searchTerm && !selectedTag && !selectedAuthor && currentPage === 1 ? client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Helper functions
  const getImageUrl = (imageAsset: any, width = 800, height = 600) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(width).height(height).url() || null;
    } catch {
      return null;
    }
  };

  const getAvatarUrl = (imageAsset: any) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(100).height(100).url() || null;
    } catch {
      return null;
    }
  };

  const getCategoryIconUrl = (imageAsset: any) => {
    if (!imageAsset?.asset) return null;
    try {
      return urlForImage(imageAsset.asset)?.width(32).height(32).url() || null;
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
    posts: posts?.map(transformPost) || [],

    featuredPosts: featuredPosts?.map(transformPost) || [],

    categories:
      categories?.map((cat) => ({
        title: cat.title || "",
        slug: cat.slug?.current || "",
        postCount: cat.postCount || 0,
        color: cat.color?.hex || "#6366F1",
        icon: getCategoryIconUrl(cat.icon),
      })) || [],

    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      postsPerPage: POSTS_PER_PAGE,
    },

    filters: {
      selectedCategory: selectedCategory || "",
      searchTerm: searchTerm || "",
      selectedTag: selectedTag || "",
      selectedAuthor: selectedAuthor || "",
    },

    // Get all unique tags and authors for filter options
    availableFilters: {
      tags: Array.from(new Set(posts?.flatMap((post) => post.tags || []) || [])),
      authors: [
        ...Array.from(
          new Set(
            posts?.map((post) =>
              JSON.stringify({
                name: post.author?.name || "Anonymous",
                slug: post.author?.slug?.current || "",
              })
            ) || []
          )
        ).map((authorStr) => JSON.parse(authorStr)),
      ].filter((author, index, self) => index === self.findIndex((a) => a.slug === author.slug)),
    },
  };

  return <BlogListingClient data={blogData} />;
}
