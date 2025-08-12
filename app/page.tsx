import BlogSection from "@/components/blog-section";
import CategorySection from "@/components/category-section";
import Hero from "@/components/hero";
import React, { Suspense } from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <BlogSection />
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategorySection searchParams={{}} />
      </Suspense>
    </div>
  );
};

export default Home;
