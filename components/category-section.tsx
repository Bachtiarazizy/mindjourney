/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/page.tsx
import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { CategorySectionClient } from "./category-section-client";

const CATEGORIES_QUERY = `*[_type == "category"] | order(title desc) {
  title,
  slug,
  color,
  icon,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

// Query to get all available tags and authors for filtering
const AVAILABLE_FILTERS_QUERY = `{
  "tags": array::unique(*[_type == "post"].tags[]),
  "authors": *[_type == "author"] | order(name asc) {
    name,
    slug
  }
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

export default async function CategorySection({ searchParams }: { searchParams: SearchParams }) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category;
  const searchTerm = searchParams.search;
  const selectedTag = searchParams.tag;
  const selectedAuthor = searchParams.author;

  const buildFilters = () => {
    const filters = [];

    if (selectedCategory) {
      filters.push(`category->slug.current == "${selectedCategory}"`);
    }

    if (searchTerm) {
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filters.push(`(title match "*${escapedSearchTerm}*" || excerpt match "*${escapedSearchTerm}*" || pt::text(body) match "*${escapedSearchTerm}*")`);
    }

    if (selectedTag) {
      filters.push(`"${selectedTag}" in tags`);
    }

    if (selectedAuthor) {
      filters.push(`author->slug.current == "${selectedAuthor}"`);
    }

    return filters.length > 0 ? `&& (${filters.join(" && ")})` : "";
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

  const [posts, totalPosts, categories, availableFilters] = await Promise.all([
    client.fetch<SanityDocument[]>(postsQuery, { start, end }, options),
    client.fetch<number>(countQuery, {}, options),
    client.fetch<SanityDocument[]>(CATEGORIES_QUERY, {}, options),
    client.fetch<{ tags: string[]; authors: SanityDocument[] }>(AVAILABLE_FILTERS_QUERY, {}, options),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

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

  const transformPost = (post: SanityDocument) => ({
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

  const blogData = {
    posts: posts?.map(transformPost) || [],

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

    availableFilters: {
      tags: availableFilters?.tags?.filter(Boolean) || [],
      authors:
        availableFilters?.authors
          ?.map((author) => ({
            name: author.name || "Anonymous",
            slug: author.slug?.current || "",
          }))
          .filter((author) => author.slug) || [],
    },
  };

  console.log("Filter condition:", filterCondition);
  console.log("Total posts found:", totalPosts);
  console.log("Posts returned:", posts?.length);

  return <CategorySectionClient data={blogData} />;
}
