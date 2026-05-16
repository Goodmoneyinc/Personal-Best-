import type { Metadata } from "next";

type BuildMetadataOptions = {
  title: string;
  description: string;
  image?: string | null;
};

export function buildMetadata({
  title,
  description,
  image,
}: BuildMetadataOptions): Metadata {
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
