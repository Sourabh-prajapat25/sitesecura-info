import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/product",
    "/careers",
    "/internships",
    "/internship-program",
    "/intern-portal",
    "/verify-internship",
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
    changeFrequency:
      route === "" ||
      route === "/careers" ||
      route === "/internships" ||
      route === "/internship-program"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1.0
        : route === "/product" || route === "/about" || route === "/internship-program"
        ? 0.8
        : 0.6,
  }));
}
