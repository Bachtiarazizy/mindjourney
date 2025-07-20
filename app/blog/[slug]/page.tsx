/* eslint-disable @typescript-eslint/no-unused-vars */
// app/blog/[slug]/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import { client, urlForImage } from "@/sanity/client";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Star, Lock } from "lucide-react";
// import ShareButtons from "@/components/share-buttons";
// import RelatedPosts from "@/components/related-posts";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  excerpt,
  slug,
  mainImage,
  body,
  category->{
    title,
    slug
  },
  author->{
    name,
    slug,
    image
  },
  publishedAt,
  readTime,
  featured,
  premium,
  "related": *[_type == "post" && references(^._id) && slug.current != $slug][0...3] {
    title,
    slug,
    mainImage,
    category->{
      title,
      slug
    },
    publishedAt
  }
}`;

const options = { next: { revalidate: 30 } };

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug: params.slug }, options);

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.mainImage ? [urlForImage(post.mainImage)?.url() || ""] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author?.name || "Anonymous"],
    },
    keywords: post.category?.title ? [post.category.title] : [],
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug: params.slug }, options);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-pink-600 hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const postImageUrl = post.mainImage ? urlForImage(post.mainImage)?.url() : null;
  const authorImageUrl = post.author?.image ? urlForImage(post.author.image)?.url() : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-pink-100 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Link href={`/blog?category=${post.category?.slug?.current || ""}`} className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
              {post.category?.title || "General"}
            </Link>

            {post.featured && (
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </span>
            )}

            {post.premium && (
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Premium
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl opacity-90 max-w-3xl mb-8">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              {authorImageUrl ? <Image src={authorImageUrl} alt={post.author?.name} width={40} height={40} className="rounded-full mr-3" /> : <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />}
              <div>
                <div className="font-medium">{post.author?.name || "Anonymous"}</div>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-12">
          {postImageUrl && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <Image src={postImageUrl} alt={post.title} width={1200} height={630} className="w-full object-cover" priority />
            </div>
          )}

          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-pink-600 hover:prose-a:text-pink-700 prose-blockquote:border-l-pink-500 prose-blockquote:bg-pink-50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-img:rounded-xl">
            {Array.isArray(post.body) && <PortableText value={post.body} />}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">{/* <ShareButtons title={post.title} url={`/blog/${post.slug.current}`} /> */}</div>
        </div>
      </article>

      {/* Author Bio */}
      {post.author && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {authorImageUrl ? (
                <Image src={authorImageUrl} alt={post.author.name} width={120} height={120} className="rounded-full flex-shrink-0" />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-28 flex-shrink-0" />
              )}

              <div>
                <h3 className="text-2xl font-bold mb-2">About {post.author.name}</h3>
                <p className="text-gray-600 mb-4">
                  {/* In a real app, you'd have a bio field in your author schema */}
                  {post.author.name} is a contributor to our blog with expertise in
                  {post.category?.title ? ` ${post.category.title}` : " various topics"}. With a passion for sharing knowledge, they help create insightful content for our readers.
                </p>
                <Link href={`/author/${post.author.slug?.current}`} className="text-pink-600 hover:underline font-medium">
                  View all articles by {post.author.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Posts */}
      {post.related && post.related.length > 0 && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-10 text-center">Related Articles</h2>
            {/* <RelatedPosts posts={post.related} /> */}
          </div>
        </div>
      )}
    </div>
  );
}
