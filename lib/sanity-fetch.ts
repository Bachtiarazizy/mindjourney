import { client } from "@/sanity/client";

// Optimized fetch function for Sanity queries
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600, // Default to 1 hour cache
}: {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  tags?: string[];
  revalidate?: number | false;
}) {
  return client.fetch<T>(query, params, {
    // Don't use both no-store and revalidate
    next: {
      revalidate,
      tags,
    },
  });
}
