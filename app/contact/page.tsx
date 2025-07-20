// // app/blog/[slug]/page.tsx
// import { client, urlForImage } from "@/sanity/client";
// import { type SanityDocument } from "next-sanity";
// import { Metadata } from "next";
// import { notFound } from "next/navigation";

// // Query for single post
// const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
//   title,
//   excerpt,
//   slug,
//   mainImage,
//   category->{
//     title,
//     slug
//   },
//   author->{
//     name,
//     slug,
//     image,
//     bio
//   },
//   publishedAt,
//   readTime,
//   body,
//   tags,
//   premium,
//   seo{
//     metaTitle,
//     metaDescription,
//     metaKeywords
//   }
// }`;

// // Query for related posts
// const RELATED_POSTS_QUERY = `*[_type == "post" && slug.current != $slug && category->slug.current == $categorySlug] | order(publishedAt desc)[0...3]{
//   title,
//   excerpt,
//   slug,
//   mainImage,
//   category->{
//     title,
//     slug
//   },
//   author->{
//     name,
//     slug
//   },
//   publishedAt,
//   readTime
// }`;

// const options = { next: { revalidate: 30 } };

// interface Props {
//   params: { slug: string };
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const post = await client.fetch<SanityDocument>(POST_QUERY, { slug: params.slug }, options);

//   if (!post) {
//     return {
//       title: "Post Not Found",
//     };
//   }

//   return {
//     title: post.seo?.metaTitle || post.title,
//     description: post.seo?.metaDescription || post.excerpt,
//     keywords: post.seo?.metaKeywords?.join(", "),
//     openGraph: {
//       title: post.title,
//       description: post.excerpt,
//       type: "article",
//       publishedTime: post.publishedAt,
//       authors: [post.author?.name],
//       images: post.mainImage ? [urlForImage(post.mainImage)?.url() || ""] : [],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description: post.excerpt,
//       images: post.mainImage ? [urlForImage(post.mainImage)?.url() || ""] : [],
//     },
//   };
// }

// export default async function BlogPostPage({ params }: Props) {
//   // Fetch post data
//   const post = await client.fetch<SanityDocument>(POST_QUERY, { slug: params.slug }, options);

//   if (!post) {
//     notFound();
//   }

//   // Fetch related posts
//   const relatedPosts = await client.fetch<SanityDocument[]>(
//     RELATED_POSTS_QUERY, 
//     { 
//       slug: params.slug, 
//       categorySlug: post.category?.slug?.current 
//     }, 
//     options
//   );

//   // Helper functions
//   const getImageUrl = (imageAsset: unknown) => {
//     if (!imageAsset) return null;
//     try {
//       return urlForImage(imageAsset)?.url() || null;
//     } catch {
//       return null;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Transform data for client component
//   const blogPostData = {
//     post: {
//       title: post.title || "",
//       excerpt: post.excerpt || "",
//       slug: post.slug?.current || "",
//       mainImageUrl: getImageUrl(post.mainImage),
//       category: {
//         title: post.category?.title || "General",
//         slug: post.category?.slug?.current || "",
//       },
//       author: {
//         name: post.author?.name || "Anonymous",
//         slug: post.author?.slug?.current || "",
//         imageUrl: getImageUrl(post.author?.image),
//         bio: post.author?.bio || "",
//       },
//       publishedAt: formatDate(post.publishedAt),
//       readTime: post.readTime || 5,
//       body: post.body || [],
//       tags: post.tags || [],
//       premium: post.premium || false,
//     },

//     relatedPosts: relatedPosts?.map(relatedPost => ({
//       title: relatedPost.title || "",
//       excerpt: relatedPost.excerpt || "",
//       slug: relatedPost.slug?.current || "",
//       imageUrl: getImageUrl(relatedPost.mainImage),
//       category: {
//         title: relatedPost.category?.title || "General",
//         slug: relatedPost.category?.slug?.current || "",
//       },
//       author: {
//         name: relatedPost.author?.name || "Anonymous",
//         slug: relatedPost.author?.slug?.current || "",
//       },
//       publishedAt: formatDate(relatedPost.publishedAt),
//       readTime: relatedPost.readTime || 5,
//     })) || [],
//   };

//   return <BlogPostClient data={blogPostData} />;
// }
import React from 'react'

export default function Page() {
  return (
    <div>
      contact page
    </div>
  )
}
