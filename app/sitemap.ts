import type { MetadataRoute } from "next";
import { products } from "@/config/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hardduckmarket.xyz";

  // Get unique category slugs
  const categorySlugs = [...new Set(products.map((product) => product.gameSlug))];

  return [
    // Main pages
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

    // Every product
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
    })),

    // Every category
    ...categorySlugs.map((slug) => ({
      url: `${baseUrl}/product-category/${slug}`,
      lastModified: new Date(),
    })),
  ];
}