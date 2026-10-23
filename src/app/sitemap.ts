import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/product",
    "/careers",
    "/internships",
    "/apply",
    "/contact",
    "/privacy",
    "/terms",
    "/responsible-disclosure",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/careers" || route === "/internships" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/product" || route === "/about" ? 0.8 : 0.6,
  }));
}
