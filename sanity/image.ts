// lib/sanity.image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForImage(source: any) {
  return builder.image(source);
}
