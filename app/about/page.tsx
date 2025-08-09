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
      <div
        className="relative text-white py-24 min-h-screen flex items-center"
        style={{
          backgroundImage: "url(/azkaa.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="flex justify-start md:justify-center ">
              <div className="relative">
                {authorImageUrl ? (
                  <Image src={authorImageUrl} alt={author.name} width={400} height={400} className="rounded-2xl shadow-2xl w-80 h-80 md:w-96 md:h-96 object-cover" priority />
                ) : (
                  <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-6xl">👤</span>
                  </div>
                )}
              </div>
            </div>
            {/* Text Content */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Hi, Aku <br /> {author.name}
              </h1>
              {author.jobTitle && <p className="text-2xl text-white mb-6 font-medium">{author.jobTitle}</p>}
              <p className="text-xl opacity-90 mb-8 leading-relaxed">{author.shortBio || "Welcome to my personal space where I share my passion for beauty, lifestyle, and everything that inspires me."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Bio Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">My Story</h2>

              {author.bio && Array.isArray(author.bio) ? (
                <div
                  className="prose max-w-none
                "
                >
                  <PortableText value={author.bio} />
                </div>
              ) : (
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-6">
                    Welcome to my corner of the internet! I&apos;m passionate about sharing my journey through the world of beauty, lifestyle, and personal growth. What started as a personal hobby has grown into a space where I can connect
                    with like-minded individuals who share similar interests and curiosities.
                  </p>
                  <p className="mb-6">
                    My approach is all about authenticity and real experiences. I believe in honest reviews, practical tips, and content that actually adds value to your daily routine. Whether it&apos;s the latest skincare trend or timeless
                    beauty wisdom, I&apos;m here to share what works and what doesn&apos;t.
                  </p>
                  <p>
                    When I&apos;m not writing or testing new products, you can find me exploring new places, trying different cuisines, or simply enjoying a good book with a cup of coffee. Life is about balance, and I love sharing all
                    aspects of it with you.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Quick Facts */}
                <div className="bg-pink-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-pink-900">
                    <Heart className="w-5 h-5 mr-2" />
                    Quick Facts
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center">
                      <Coffee className="w-4 h-4 mr-3 text-pink-600" />
                      <span>Coffee enthusiast</span>
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-3 text-pink-600" />
                      <span>Social Volunteer</span>
                    </div>
                    {stats.latestPost && (
                      <div className="pt-2 border-t border-pink-200">
                        <p className="text-sm text-gray-600">Latest post:</p>
                        <p className="font-medium text-pink-900">{stats.latestPost.title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Let&apos;s Connect!</h3>
                  <p className="mb-4 text-white/90 text-sm">Have a question or want to collaborate? I&apos;d love to hear from you!</p>
                  <Link href="mailto:azkamusfirah@gmail.com" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
