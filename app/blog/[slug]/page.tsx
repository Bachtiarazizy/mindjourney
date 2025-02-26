/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { notFound } from "next/navigation";
import { SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { urlForImage } from "@/sanity/image";
import { sanityFetch } from "@/lib/sanity-fetch"; // Import the optimized fetch function

// Type definitions remain the same
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
  body: any; // PortableText content
  category: {
    title: string;
    _id: string;
  };
  publishedAt: string;
  readTime: number;
  author?: {
    name: string;
    image?: {
      asset: {
        _ref: string;
      };
    };
    bio?: any[]; // Portable Text array
  };
}

// Components for the PortableText remain the same
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-12 relative">
          <img src={urlForImage(value).url()} alt={value.alt || ""} className="w-full rounded-md" />
          {value.caption && <figcaption className="text-center text-sm text-secondary/60 mt-3 font-geologica">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a href={value.href} rel={rel} className="text-accent no-underline border-b border-accent/30 hover:border-accent transition-colors">
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-prosto text-secondary mt-16 mb-6 font-normal">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-prosto text-secondary mt-12 mb-5 font-normal">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-prosto text-secondary mt-10 mb-4 font-normal">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-prosto text-secondary mt-8 mb-3 font-medium">{children}</h4>,
    normal: ({ children }: any) => <p className="text-base leading-relaxed text-secondary/90 mb-6 font-geologica">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-2 border-accent/40 pl-4 my-8 text-secondary/80 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-secondary/90 space-y-2 font-geologica">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-secondary/90 space-y-2 font-geologica">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-base leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="text-base leading-relaxed">{children}</li>,
  },
};

// Simplified components for compact bio rendering remains the same
const bioComponents = {
  block: {
    normal: ({ children }: any) => <span>{children}</span>,
  },
  marks: {
    strong: ({ children }: any) => <span>{children}</span>,
    em: ({ children }: any) => <span>{children}</span>,
    link: ({ children }: any) => <span>{children}</span>,
  },
};

// GROQ queries remain the same
const POST_QUERY = `*[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))][0]{
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
  body,
  category->{
    title,
    _id
  },
  publishedAt,
  readTime,
  author->{
    name,
    image {
      asset->
    },
    bio
  }
}`;

const RELATED_POSTS_QUERY = `*[_type == "post" && category._ref == $categoryId && slug.current != $currentSlug && !(_id in path('drafts.**'))][0...4]{
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
  publishedAt,
  readTime
}`;

const RELATED_BY_CATEGORY_TITLE_QUERY = `*[_type == "post" && references(*[_type == "category" && title == $categoryTitle]._id) && slug.current != $currentSlug && !(_id in path('drafts.**'))][0...4]{
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
  publishedAt,
  readTime
}`;

// Function to generate metadata for the page - optimized
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await sanityFetch<Post>({
      query: POST_QUERY,
      params: { slug: params.slug },
      revalidate: 60, // Cache for 1 minute
      tags: [`post-${params.slug}`],
    });

    if (!post) {
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist",
      };
    }

    return {
      title: post.title,
      description: post.title,
      openGraph: {
        images: post.mainImage ? [urlForImage(post.mainImage).url()] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching post metadata:", error);
    return {
      title: "Blog",
      description: "Read our latest articles",
    };
  }
}

// Function to generate static params for build time - optimized to limit posts
export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "post" && defined(slug.current) && !(_id in path('drafts.**'))][0...20]{
      "slug": slug.current
    }`,
    revalidate: 3600, // Cache for 1 hour
  });

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// Related Post Card Component remains the same
function RelatedPostCard({ post }: { post: Post }) {
  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug.current}`}>
      <div className="group flex flex-col mb-6 hover:bg-secondary/5 p-3 rounded-md transition-colors">
        {post.mainImage && (
          <div className="mb-3">
            <img src={urlForImage(post.mainImage).width(300).height(150).url()} alt={post.mainImage.alt || post.title} className="w-full h-32 object-cover rounded-md" />
          </div>
        )}
        <h3 className="font-prosto text-base text-secondary group-hover:text-accent transition-colors mb-2 line-clamp-2">{post.title}</h3>
        <div className="text-xs text-secondary/60 font-geologica mt-auto">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

// Main blog post page component - optimized
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the post with optimized caching
  const post = await sanityFetch<Post>({
    query: POST_QUERY,
    params: { slug: params.slug },
    revalidate: 60, // Revalidate content every minute
    tags: [`post-${params.slug}`],
  });

  if (!post) {
    notFound();
  }

  // Fetch related posts in parallel with the main post
  const relatedPostsPromise = post.category
    ? post.category._id
      ? sanityFetch<Post[]>({
          query: RELATED_POSTS_QUERY,
          params: {
            categoryId: post.category._id,
            currentSlug: post.slug.current,
          },
          revalidate: 300, // Cache related posts for 5 minutes
          tags: [`category-${post.category._id}`],
        })
      : sanityFetch<Post[]>({
          query: RELATED_BY_CATEGORY_TITLE_QUERY,
          params: {
            categoryTitle: post.category.title,
            currentSlug: post.slug.current,
          },
          revalidate: 300,
          tags: [`category-${post.category.title}`],
        })
    : Promise.resolve([]);

  // Await the related posts query result
  const relatedPosts = await relatedPostsPromise;

  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-primary min-h-screen">
      {/* Article content with sidebar */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - Left side */}
          <article className="lg:w-2/3">
            {/* Post header */}
            <header className="mb-12">
              {post.category && (
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wide font-geologica text-secondary/70">{post.category.title}</span>
                </div>
              )}
              <h1 className="font-prosto text-3xl md:text-4xl lg:text-5xl text-secondary font-normal leading-tight mb-6">{post.title}</h1>

              {/* Author and meta information */}
              <div className="flex items-center justify-between border-t border-b border-secondary/10 py-4 mb-6">
                <div className="flex items-center">
                  {post.author?.image && <img src={urlForImage(post.author.image).url()} alt={post.author.name} className="w-10 h-10 rounded-full mr-3 object-cover" />}
                  <div>{post.author && <p className="font-geologica text-sm text-secondary">{post.author.name}</p>}</div>
                </div>
                <div className="text-xs text-secondary/60 font-geologica">
                  <span>{formattedDate}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </header>

            {/* Featured image */}
            {post.mainImage && (
              <div className="mb-12">
                <img src={urlForImage(post.mainImage).url()} alt={post.mainImage.alt || post.title} className="w-full rounded-md" />
              </div>
            )}

            {/* Post content */}
            <div className="prose max-w-none">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {/* Author bio (if exists) */}
            {post.author?.bio && post.author.bio.length > 0 && (
              <div className="mt-16 pt-8 border-t border-secondary/10">
                <div className="flex items-start">
                  {post.author.image && <img src={urlForImage(post.author.image).url()} alt={post.author.name} className="w-16 h-16 rounded-full mr-4 object-cover flex-shrink-0" />}
                  <div>
                    <h3 className="font-prosto text-lg text-secondary mb-2">About {post.author.name}</h3>
                    <div className="text-sm text-secondary/80 font-geologica">
                      <PortableText value={post.author.bio} components={bioComponents} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Related posts (Right side) */}
          <aside className="lg:w-1/3">
            <div className="sticky top-20 bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
              <h2 className="font-prosto text-xl text-secondary mb-6 pb-3 border-b border-secondary/10">Related Articles</h2>

              {relatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard key={relatedPost._id} post={relatedPost} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-secondary/70 font-geologica">No related articles found.</p>
              )}

              <div className="mt-8 pt-6 border-t border-secondary/10">
                <h3 className="font-prosto text-lg text-secondary mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Normally we would fetch all categories here */}
                  {post.category && (
                    <Link href={`/blog/category/${post.category.title.toLowerCase()}`} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs hover:bg-secondary/20 transition-colors">
                      {post.category.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
