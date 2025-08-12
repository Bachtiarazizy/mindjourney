import BlogSection from "@/components/blog-section";
import Hero from "@/components/hero";
import React from "react";

const BlogLanding = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <BlogSection />
      {/* <CategorySection searchParams={{}} /> */}
    </div>
  );
};

export default BlogLanding;
