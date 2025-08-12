import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { HeroClient } from "./hero-client";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  description,
  heroSection{
    headline,
    subheadline,
    heroImage
  }
}`;

// Query untuk featured posts - ambil 3 posts yang featured
const FEATURED_POSTS_QUERY = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  mainImage{
    asset,
    alt
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function Hero() {
  // Fetch data server-side
  const [siteData, featuredPosts] = await Promise.all([client.fetch<SanityDocument>(SITE_SETTINGS_QUERY, {}, options), client.fetch<SanityDocument[]>(FEATURED_POSTS_QUERY, {}, options)]);

  // Helper function for image URLs
  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.width(600).height(400).url() || null;
    } catch {
      return null;
    }
  };

  // Helper function for featured post thumbnails
  const getThumbnailUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.width(200).height(150).url() || null;
    } catch {
      return null;
    }
  };

  // Prepare featured posts data
  const transformedFeaturedPosts =
    featuredPosts?.map((post) => ({
      id: post._id,
      title: post.title || "",
      slug: post.slug?.current || "",
      imageUrl: getThumbnailUrl(post.mainImage?.asset),
      imageAlt: post.mainImage?.alt || post.title || "",
    })) || [];

  // Prepare data for client component
  const heroData = {
    title: siteData?.title || "My Website",
    headline: siteData?.heroSection?.headline || "All Article About Aesthetics & Beauty.",
    subheadline: siteData?.heroSection?.subheadline || "New Article Updated Everyday",
    heroImageUrl: getImageUrl(siteData?.heroSection?.heroImage),
    featuredPosts: transformedFeaturedPosts,
  };

  return <HeroClient data={heroData} />;
}
