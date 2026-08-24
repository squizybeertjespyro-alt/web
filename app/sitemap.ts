import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hardduckmarket.xyz/",
      lastModified: new Date(),
    },
  ];
}