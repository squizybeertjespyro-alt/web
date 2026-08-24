import type { MetadataRoute } from "next";
import { products } from "@/config/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hardduckmarket.xyz";

  const categorySlugs = [
    ...new Set(products.map((product) => product.gameSlug)),
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tos`,
      lastModified: new Date(),
    },

    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
    })),

    ...categorySlugs.map((slug) => ({
      url: `${baseUrl}/product-category/${slug}`,
      lastModified: new Date(),
    })),
  ];
}