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

const options = { next: { revalidate: 30 } };

export default async function Hero() {
  // Fetch data server-side
  const siteData = await client.fetch<SanityDocument>(SITE_SETTINGS_QUERY, {}, options);

  // Helper function for image URLs
  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.width(600).height(400).url() || null;
    } catch {
      return null;
    }
  };

  // Prepare data for client component
  const heroData = {
    title: siteData?.title || "My Website",
    headline: siteData?.heroSection?.headline || "All Article About Aesthetics & Beauty.",
    subheadline: siteData?.heroSection?.subheadline || "New Article Updated Everyday",
    heroImageUrl: getImageUrl(siteData?.heroSection?.heroImage),
  };

  return <HeroClient data={heroData} />;
}
