/* eslint-disable @typescript-eslint/no-explicit-any */
// app/about/page.tsx
import { PortableText, type SanityDocument } from "next-sanity";
import { client, urlForImage } from "@/sanity/client";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail, Heart, Coffee, Sparkles } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative text-white py-24 flex items-center"
        style={{
          backgroundImage: "url(/bd-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mb-8 leading-tight text-white">About Me</h1>
            <p className="text-medium md:text-lg text-white/90 max-w-3xl mb-12 leading-relaxed mx-auto">
              A small corner of the internet where I pour out stories, reflections, and quiet thoughts all shaped by my love for understanding people and the invisible threads that connect us.
            </p>
          </div>
        </div>
      </section>

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
                    Hai, aku <br className="hidden sm:block" />
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
                      <Coffee className="w-4 h-4 mr-3 text-pink-600 flex-shrink-0" />
                      <span>Coffee enthusiast</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Sparkles className="w-4 h-4 mr-3 text-pink-600 flex-shrink-0" />
                      <span>Social Volunteer</span>
                    </div>

                    {/* Blog Stats */}
                    {stats.totalPosts > 0 && (
                      <div className="pt-3 border-t border-pink-200">
                        <p className="text-sm text-gray-600 mb-1">Blog posts written:</p>
                        <p className="font-semibold text-pink-900">{stats.totalPosts} articles</p>
                      </div>
                    )}

                    {stats.latestPost && (
                      <div className="pt-3 border-t border-pink-200">
                        <p className="text-sm text-gray-600 mb-1">Latest post:</p>
                        <p className="font-medium text-pink-900 text-sm leading-tight">{stats.latestPost.title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-3">Let&apos;s Connect!</h3>
                  <p className="mb-4 text-white/90 text-sm leading-relaxed">Have a question or want to collaborate? I&apos;d love to hear from you!</p>
                  <Link href="mailto:azkamusfirah@gmail.com" className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center text-sm hover:shadow-md">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Link>
                </div>

                {/* Social Links (jika ada) */}
                {author.social && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Follow Me</h3>
                    <div className="space-y-2">
                      {/* Add social media links here based on author.social data */}
                      <p className="text-sm text-gray-600">Social media links coming soon!</p>
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
