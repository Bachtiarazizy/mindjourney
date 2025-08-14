// components/navbar.tsx
import { client, urlForImage } from "@/sanity/client";
import { NavbarClient } from "./navbar-client";

interface Category {
  title: string;
  slug: string;
}

interface SiteSettings {
  title: string;
  description?: string;
  logo?: unknown;
  contact?: {
    email?: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

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

const CATEGORIES_QUERY = `*[_type == "category"] | order(title desc) {
  title,
  "slug": slug.current
}`;

const options = { next: { revalidate: 30 } };

export default async function Navbar() {
  // Fetch site settings & categories with proper types
  const [siteData, categories] = await Promise.all([client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, options), client.fetch<Category[]>(CATEGORIES_QUERY, {}, options)]);

  const getImageUrl = (imageAsset: unknown) => {
    if (!imageAsset) return null;
    try {
      return urlForImage(imageAsset)?.url() || null;
    } catch {
      return null;
    }
  };

  const navbarData = {
    title: siteData?.title || "My Website",
    logoUrl: getImageUrl(siteData?.logo),
    email: siteData?.contact?.email,
    socialMedia: siteData?.contact?.socialMedia,
    categories: categories || [],
  };

  return <NavbarClient data={navbarData} />;
}
