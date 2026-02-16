import type { MetadataRoute } from "next";

import { blogSlugs, exampleSlugs, serviceSlugs } from "@/lib/content/catalog";
import { absoluteSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/pricing",
    "/how-it-works",
    "/services",
    "/examples",
    "/faq",
    "/about",
    "/contact",
    "/blog",
    "/legal/terms",
    "/legal/privacy",
    "/legal/disclaimer",
    "/login",
    "/signup",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: absoluteSiteUrl(path),
      lastModified: new Date(),
    })),
    ...serviceSlugs.map((slug) => ({
      url: absoluteSiteUrl(`/services/${slug}`),
      lastModified: new Date(),
    })),
    ...exampleSlugs.map((slug) => ({
      url: absoluteSiteUrl(`/examples/${slug}`),
      lastModified: new Date(),
    })),
    ...blogSlugs.map((slug) => ({
      url: absoluteSiteUrl(`/blog/${slug}`),
      lastModified: new Date(),
    })),
  ];
}
