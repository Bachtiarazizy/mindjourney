// lib/queries.ts
export const HERO_SECTION_QUERY = `*[_type == "siteSettings"][0].heroSection {
  headline,
  subheadline,
  heroImage {
    asset->{
      _id,
      url
    }
  }
}`;
