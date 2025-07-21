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

  // Get category color or default
  const categoryColor = post.category?.color?.hex || "#ec4899";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div
        className="text-white py-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Link href={`/blog?category=${post.category?.slug?.current || ""}`} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center">
              {post.category?.icon && <Image src={urlForImage(post.category.icon)?.url() || ""} alt="" width={16} height={16} className="mr-2 rounded" />}
              {post.category?.title || "General"}
            </Link>

            {post.featured && (
              <span className="bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Featured
              </span>
            )}

            {post.premium && (
              <span className="bg-purple-400/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Premium
              </span>
            )}
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>
            <p className="text-xl opacity-90 max-w-3xl mb-8 leading-relaxed">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {authorImageUrl ? <Image src={authorImageUrl} alt={post.author?.name} width={32} height={32} className="rounded-full mr-3" /> : <div className="bg-white/20 rounded-full w-8 h-8 mr-3" />}
                <div>
                  <div className="font-medium">{post.author?.name || "Anonymous"}</div>
                  {post.author?.jobTitle && <div className="text-xs opacity-75">{post.author.jobTitle}</div>}
                </div>
              </div>

              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.readTime || 5} min read</span>
              </div>
            </div>
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
                {/* Enhanced Typography for Content */}
                <div
                  className="prose prose-xl max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                  prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-a:text-pink-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-pink-700
                  prose-blockquote:border-l-4 prose-blockquote:border-pink-500 prose-blockquote:bg-pink-50 
                  prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-r-xl prose-blockquote:my-8
                  prose-blockquote:text-pink-900 prose-blockquote:font-medium prose-blockquote:italic
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:mb-2 prose-li:leading-relaxed
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-hr:border-gray-200 prose-hr:my-12
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto
                "
                >
                  {Array.isArray(post.body) && <PortableText value={post.body} />}
                </div>

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
                        <Link href={`/author/${post.author.slug?.current}`} className="text-pink-600 hover:text-pink-700 font-medium hover:underline">
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
                          {category.featured && <Star className="w-3 h-3 ml-2 text-yellow-500 fill-current" />}
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
