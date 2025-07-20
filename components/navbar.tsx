import { client, urlForImage } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { NavbarClient } from "./navbar-client";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  description,
  logo,
  contact{
    email,
    socialMedia{
      facebook,
      twitter,
      instagram,
      linkedin
    }
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function Navbar() {
  // Fetch data server-side
  const siteData = await client.fetch<SanityDocument>(SITE_SETTINGS_QUERY, {}, options);

  // Helper function for image URLs
  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.url() || null;
    } catch {
      return null;
    }
  };

  // Prepare data for client component
  const navbarData = {
    title: siteData?.title || "My Website",
    logoUrl: getImageUrl(siteData?.logo),
    email: siteData?.contact?.email,
    socialMedia: siteData?.contact?.socialMedia,
  };

  return <NavbarClient data={navbarData} />;
}
