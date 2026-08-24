import { products } from "@/config/products";

export async function GET() {
  const baseUrl = "https://hardduckmarket.xyz";

  const categorySlugs = [
    ...new Set(products.map((product) => product.gameSlug)),
  ];

  const urls = [
    baseUrl,
    `${baseUrl}/shop`,
    `${baseUrl}/tos`,

    ...products.map(
      (product) => `${baseUrl}/product/${product.slug}`
    ),

    ...categorySlugs.map(
      (slug) => `${baseUrl}/product-category/${slug}`
    ),
  ];

  const asciiArt = `<!--
 /$$   /$$ /$$$$$$$  /$$      /$$
| $$  | $$| $$__  $$| $$$    /$$$
| $$  | $$| $$  \\ $$| $$$$  /$$$$
| $$$$$$$$| $$  | $$| $$ $$/$$ $$
| $$__  $$| $$  | $$| $$  $$$| $$
| $$  | $$| $$  | $$| $$\\  $ | $$
| $$  | $$| $$$$$$$/| $$ \\/  | $$
|__/  |__/|_______/ |__/     |__/
-->`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
${asciiArt}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}