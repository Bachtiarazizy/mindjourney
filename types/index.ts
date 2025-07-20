export interface SanityImageAsset {
  _ref: string;
  _type: string;
}

export interface SanityImage {
  asset: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Contact {
  email?: string;
  socialMedia?: SocialMedia;
}

export interface HeroSection {
  headline?: string;
  subheadline?: string;
  heroImage?: SanityImage;
}

export interface PremiumSection {
  headline?: string;
  description?: string;
  image?: SanityImage;
}

export interface SiteSettings {
  _id?: string;
  _type?: "siteSettings";
  _createdAt?: string;
  _updatedAt?: string;
  title?: string;
  description?: string;
  logo?: SanityImage;
  heroSection?: HeroSection;
  premiumSection?: PremiumSection;
  contact?: Contact;
}

// Navigation types (jika nanti mau buat navigation dinamis juga)
export interface NavigationItem {
  title: string;
  href: string;
  external?: boolean;
}

export interface Navigation {
  _id?: string;
  _type?: "navigation";
  title?: string;
  items?: NavigationItem[];
}
