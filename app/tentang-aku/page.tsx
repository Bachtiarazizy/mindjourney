/* eslint-disable @typescript-eslint/no-explicit-any */
// app/about/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import { client, urlForImage } from "@/sanity/client";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, Heart, Instagram, Facebook, Twitter, Linkedin, ExternalLink, Footprints, HandHeart } from "lucide-react";

// Query untuk mengambil author utama (bisa berdasarkan featured atau yang pertama)
const AUTHOR_QUERY = `*[_type == "author"] | order(featured desc, _createdAt asc)[0] {
  name,
  slug,
  image,
  bio,
  jobTitle,
  shortBio,
  social,
  featured,
  "postCount": count(*[_type == "post" && references(^._id)])
}`;

// Query untuk stats
const STATS_QUERY = `{
  "totalPosts": count(*[_type == "post"]),
  "totalCategories": count(*[_type == "category"]),
  "latestPost": *[_type == "post"] | order(publishedAt desc)[0] {
    title,
    publishedAt
  }
}`;

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "About Me | Personal Blog",
  description: "Learn more about my journey, passion for beauty and lifestyle, and the story behind this blog.",
  openGraph: {
    title: "About Me | Personal Blog",
    description: "Learn more about my journey, passion for beauty and lifestyle, and the story behind this blog.",
    type: "website",
  },
};

// Helper function to get social media icon
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className="w-5 h-5" />;
    case "facebook":
      return <Facebook className="w-5 h-5" />;
    case "twitter":
      return <Twitter className="w-5 h-5" />;
    case "linkedin":
      return <Linkedin className="w-5 h-5" />;
    default:
      return <ExternalLink className="w-5 h-5" />;
  }
};

// Helper function to format platform name
const formatPlatformName = (platform: string) => {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

export default async function AboutPage() {
  const [author, stats] = await Promise.all([client.fetch<SanityDocument>(AUTHOR_QUERY, {}, options), client.fetch<any>(STATS_QUERY, {}, options)]);

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Author Information Not Found</h1>
          <Link href="/" className="text-pink-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const authorImageUrl = author.image ? urlForImage(author.image)?.url() : null;

  // Check if social data exists and has content
  const hasSocialLinks = author.social && Object.keys(author.social).some((key) => author.social[key]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* About Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Bio Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {authorImageUrl ? (
                      <Image src={authorImageUrl} alt={author.name} width={300} height={300} className="rounded-2xl shadow-xl w-64 h-64 md:w-72 md:h-72 object-cover" priority />
                    ) : (
                      <div className="w-64 h-64 md:w-72 md:h-72 bg-gray-200 rounded-2xl flex items-center justify-center">
                        <span className="text-gray-400 text-6xl">👤</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-gray-900">
                    <span className="text-pink-600">{author.name}</span>
                  </h1>

                  {author.jobTitle && <p className="text-lg md:text-xl text-gray-600 mb-4 font-medium">{author.jobTitle}</p>}

                  <p className="text-medium text-gray-700 leading-relaxed">{author.shortBio || "Welcome to my personal space where I share my passion for beauty, lifestyle, and everything that inspires me."}</p>
                </div>
              </div>

              {/* Story Section */}
              <div className="prose-section">
                {author.bio && Array.isArray(author.bio) ? (
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <PortableText value={author.bio} />
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      Welcome to my corner of the internet! I&apos;m passionate about sharing my journey through the world of beauty, lifestyle, and personal growth. What started as a personal hobby has grown into a space where I can
                      connect with like-minded individuals who share similar interests and curiosities.
                    </p>
                    <p className="mb-6">
                      My approach is all about authenticity and real experiences. I believe in honest reviews, practical tips, and content that actually adds value to your daily routine. Whether it&apos;s the latest skincare trend or
                      timeless beauty wisdom, I&apos;m here to share what works and what doesn&apos;t.
                    </p>
                    <p className="mb-0">
                      When I&apos;m not writing or testing new products, you can find me exploring new places, trying different cuisines, or simply enjoying a good book with a cup of coffee. Life is about balance, and I love sharing all
                      aspects of it with you.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Quick Facts Card */}
                <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-pink-900">
                    <Heart className="w-5 h-5 mr-2" />
                    Quick Facts
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Footprints className="w-4 h-4 mr-3 text-pink-600 flex-shrink-0" />
                      <span>senang mengeksplorasi budaya baru</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <HandHeart className="w-4 h-4 mr-3 text-pink-600 flex-shrink-0" />
                      <span>volunteeran buat ngisi energi sosial</span>
                    </div>

                    {/* Blog Stats */}
                    <div className="pt-3 border-t border-pink-200">
                      <p className="text-sm text-gray-600 mb-1">Growth is messy. but so is baklava-and we all love that</p>
                    </div>

                    {stats.latestPost && (
                      <div className="pt-3 border-t border-pink-200">
                        <p className="text-sm text-gray-600 mb-1">Tulisan terbaru</p>
                        <p className="font-medium text-pink-900 text-sm leading-tight">{stats.latestPost.title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Let&apos;s Connect!</h3>
                  <p className="mb-4 text-white/90 text-sm leading-relaxed">Punya pertanyaan atau ingin berbagi cerita?</p>
                  <Link href="mailto:azkamusfirah@gmail.com" className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center text-sm hover:shadow-md">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Link>
                </div>

                {/* Social Links */}
                {hasSocialLinks && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Follow Me</h3>
                    <div className="space-y-3">
                      {Object.entries(author.social).map(([platform, url]) => {
                        // Skip empty values
                        if (!url || typeof url !== "string") return null;

                        return (
                          <Link key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors group">
                            <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 group-hover:bg-pink-50 transition-colors shadow-sm">{getSocialIcon(platform)}</span>
                            <span className="font-medium">{formatPlatformName(platform)}</span>
                            <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
