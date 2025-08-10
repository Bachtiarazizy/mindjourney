// sanity/write-client.ts
// Buat file baru untuk client yang bisa write

import { createClient } from "next-sanity";

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-05-03",
  token: process.env.SANITY_WRITE_TOKEN!, // Add this to .env.local
  useCdn: false, // Don't use CDN for writes
});
