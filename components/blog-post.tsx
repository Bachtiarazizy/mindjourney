/* eslint-disable @next/next/no-img-element */
import React from "react";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

const featuredPost: BlogPost = {
  title: "The Journey of Self-Discovery Through Creative Writing",
  excerpt: "Exploring how writing can be a powerful tool for personal growth and understanding our inner thoughts...",
  date: "Feb 24, 2024",
  readTime: "5 min read",
  category: "Personal Growth",
  imageUrl: "/feature-1.jpg",
};

const recentPosts: BlogPost[] = [
  {
    title: "Finding Balance in a Digital World",
    excerpt: "Tips and strategies for maintaining mental wellness while staying connected...",
    date: "Feb 20, 2024",
    readTime: "4 min read",
    category: "Lifestyle",
    imageUrl: "/feature-2.jpg",
  },
  {
    title: "The Art of Mindful Photography",
    excerpt: "How capturing moments through a lens can help us stay present and aware...",
    date: "Feb 18, 2024",
    readTime: "3 min read",
    category: "Creativity",
    imageUrl: "/video.jpg",
  },
];

function BlogCard({ post, isFeatured = false }: { post: BlogPost; isFeatured?: boolean }) {
  return (
    <article className={`bg-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${isFeatured ? "col-span-2" : ""}`}>
      <div className="relative">
        <img src={post.imageUrl} alt={post.title} className={`w-full object-cover ${isFeatured ? "h-[400px]" : "h-[200px]"}`} />
        <span className="absolute top-4 left-4 bg-background px-4 py-1 rounded-full text-secondary font-geologica text-sm">{post.category}</span>
      </div>

      <div className="p-6">
        <div className="flex gap-4 text-sm text-secondary/70 font-geologica mb-3">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <h2 className={`font-prosto text-secondary ${isFeatured ? "text-3xl" : "text-xl"} mb-3`}>{post.title}</h2>

        <p className="paragraph-1 text-secondary/80 mb-4">{post.excerpt}</p>

        <button className="font-geologica text-secondary hover:text-secondary/70 transition-colors">Read More →</button>
      </div>
    </article>
  );
}

export default function BlogSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="heading-1 mb-4">Latest Thoughts</h1>
        <p className="paragraph-1 max-w-2xl mx-auto">Exploring ideas, sharing experiences, and documenting the journey of personal and creative growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BlogCard post={featuredPost} isFeatured={true} />
        {recentPosts.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </section>
  );
}
