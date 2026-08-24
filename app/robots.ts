//  /$$   /$$ /$$$$$$$  /$$      /$$
// | $$  | $$| $$__  $$| $$$    /$$$
// | $$  | $$| $$  \ $$| $$$$  /$$$$
// | $$$$$$$$| $$  | $$| $$ $$/$$ $$
// | $$__  $$| $$  | $$| $$  $$$| $$
// | $$  | $$| $$  | $$| $$\  $ | $$
// | $$  | $$| $$$$$$$/| $$ \/  | $$
// |__/  |__/|_______/ |__/     |__/

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://hardduckmarket.xyz/sitemap.xml",
    };
}