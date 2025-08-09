/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/blog/[slug]/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import { client, urlForImage } from "@/sanity/client";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Star, Lock, Instagram, Twitter, Linkedin, Globe, Tag } from "lucide-react";
import { RelatedPosts } from "@/components/related-post";
import { ShareButtons } from "@/components/share-button";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  excerpt,
  slug,
  mainImage,
  body,
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
    shortBio,
    jobTitle,
    social,
    featured
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

// Query for sidebar categories
const CATEGORIES_QUERY = `*[_type == "category"] | order(featured desc, title asc) {
  title,
  slug,
  color,
  icon,
  featured,
  "postCount": count(*[_type == "post" && references(^._id)])
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
  const [post, categories] = await Promise.all([client.fetch<SanityDocument>(POST_QUERY, { slug: params.slug }, options), client.fetch<SanityDocument[]>(CATEGORIES_QUERY, {}, options)]);

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
      <div className="bg-gradient-to-br from-[#4460a6] via-[#36539b] to-[#527ff0] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>
            <p className="text-large opacity-90 max-w-3xl mb-8 leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {postImageUrl && (
                <div className="aspect-video overflow-hidden">
                  <Image src={postImageUrl} alt={post.title} width={1200} height={630} className="w-full h-full object-cover" priority />
                </div>
              )}

              <div className="p-8 md:p-12">
                {/* Article Meta */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(post.publishedAt)}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{post.readTime} min read</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {post.category && (
                      <div className="flex items-center">
                        <div className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: post.category.color?.hex || "#6b7280" }}>
                          {post.category.title}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Typography for Content */}
                <div className="prose max-w-none">{Array.isArray(post.body) && <PortableText value={post.body} />}</div>

                <div className="mt-16 pt-8 border-t border-gray-200">
                  <ShareButtons title={post.title} url={`/blog/${post.slug.current}`} excerpt={post.excerpt} />
                </div>
              </div>
            </article>

            {/* Enhanced Author Bio */}
            {post.author && (
              <div className="mt-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {authorImageUrl ? (
                      <div className="relative">
                        <Image src={authorImageUrl} alt={post.author.name} width={120} height={120} className="rounded-2xl flex-shrink-0 shadow-lg" />
                        {post.author.featured && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-28 h-28 flex-shrink-0" />
                    )}

                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-1">About {post.author.name}</h3>
                        {post.author.jobTitle && <p className="text-pink-600 font-medium">{post.author.jobTitle}</p>}
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {post.author.shortBio ||
                          `${post.author.name} is a contributor to our blog with expertise in ${post.category?.title ? post.category.title : "various topics"}. With a passion for sharing knowledge, they help create insightful content for our readers.`}
                      </p>

                      <div className="flex items-center justify-between">
                        <Link href={`/blog`} className="text-pink-600 hover:text-pink-700 font-medium hover:underline">
                          View all articles by {post.author.name} →
                        </Link>

                        {post.author.social && (
                          <div className="flex items-center gap-3">
                            {post.author.social.instagram && (
                              <a href={post.author.social.instagram} className="text-gray-400 hover:text-pink-500 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                            {post.author.social.twitter && (
                              <a href={post.author.social.twitter} className="text-gray-400 hover:text-blue-500 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-5 h-5" />
                              </a>
                            )}
                            {post.author.social.linkedin && (
                              <a href={post.author.social.linkedin} className="text-gray-400 hover:text-blue-700 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                            {post.author.social.website && (
                              <a href={post.author.social.website} className="text-gray-400 hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Globe className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-pink-600" />
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category: any) => {
                    const categoryIconUrl = category.icon ? urlForImage(category.icon)?.url() : null;
                    const categoryColor = category.color?.hex || "#6b7280";

                    return (
                      <Link key={category.slug.current} href={`/blog?category=${category.slug.current}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center">
                          {categoryIconUrl ? <Image src={categoryIconUrl} alt="" width={20} height={20} className="mr-3 rounded" /> : <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: categoryColor }}></div>}
                          <span className="font-medium group-hover:text-pink-600 transition-colors">{category.title}</span>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.postCount}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Explore More</h3>
                <div className="space-y-3">
                  <Link href="/blog" className="block text-white/90 hover:text-white transition-colors">
                    → All Articles
                  </Link>
                  <Link href="/blog?featured=true" className="block text-white/90 hover:text-white transition-colors">
                    → Featured Posts
                  </Link>
                  {post.category && (
                    <Link href={`/blog?category=${post.category.slug.current}`} className="block text-white/90 hover:text-white transition-colors">
                      → More in {post.category.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {post.related && post.related.length > 0 && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">You Might Also Like</h2>
            <RelatedPosts posts={post.related} />
          </div>
        </div>
      )}
    </div>
  );
}
