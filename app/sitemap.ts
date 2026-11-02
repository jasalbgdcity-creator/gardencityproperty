import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gardencityproperties.net";
  const now = new Date();

  // 1. Static Core & Section Routes with bilingual hreflang alternates
  const staticSections = [
    { slug: "", priority: 1.0, changeFrequency: "weekly" as const },
    { slug: "#about", priority: 0.8, changeFrequency: "monthly" as const },
    { slug: "#services", priority: 0.9, changeFrequency: "weekly" as const },
    { slug: "#projects", priority: 0.9, changeFrequency: "daily" as const },
    { slug: "#leadership", priority: 0.8, changeFrequency: "monthly" as const },
    { slug: "#contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticSections.flatMap((section) => [
    {
      url: `${baseUrl}/en${section.slug ? `/${section.slug}` : ""}`,
      lastModified: now,
      changeFrequency: section.changeFrequency,
      priority: section.priority,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en${section.slug ? `/${section.slug}` : ""}`,
          "ar-OM": `${baseUrl}/ar${section.slug ? `/${section.slug}` : ""}`,
          "x-default": `${baseUrl}/en${section.slug ? `/${section.slug}` : ""}`,
        },
      },
    },
    {
      url: `${baseUrl}/ar${section.slug ? `/${section.slug}` : ""}`,
      lastModified: now,
      changeFrequency: section.changeFrequency,
      priority: section.priority,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en${section.slug ? `/${section.slug}` : ""}`,
          "ar-OM": `${baseUrl}/ar${section.slug ? `/${section.slug}` : ""}`,
          "x-default": `${baseUrl}/en${section.slug ? `/${section.slug}` : ""}`,
        },
      },
    },
  ]);

  // Root canonical entry
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: {
        "en-OM": `${baseUrl}/en`,
        "ar-OM": `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };

  // 2. Dynamic Project / Property entries fetched from Supabase
  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(projects)) {
      projectEntries = projects.flatMap((project) => {
        const lastMod = project.created_at ? new Date(project.created_at) : now;
        const validLastMod = isNaN(lastMod.getTime()) ? now : lastMod;
        const projectId = encodeURIComponent(String(project.id || "").trim());

        if (!projectId) return [];

        return [
          {
            url: `${baseUrl}/en/projects/${projectId}`,
            lastModified: validLastMod,
            changeFrequency: "weekly" as const,
            priority: 0.85,
            alternates: {
              languages: {
                "en-OM": `${baseUrl}/en/projects/${projectId}`,
                "ar-OM": `${baseUrl}/ar/projects/${projectId}`,
                "x-default": `${baseUrl}/en/projects/${projectId}`,
              },
            },
          },
          {
            url: `${baseUrl}/ar/projects/${projectId}`,
            lastModified: validLastMod,
            changeFrequency: "weekly" as const,
            priority: 0.85,
            alternates: {
              languages: {
                "en-OM": `${baseUrl}/en/projects/${projectId}`,
                "ar-OM": `${baseUrl}/ar/projects/${projectId}`,
                "x-default": `${baseUrl}/en/projects/${projectId}`,
              },
            },
          },
        ];
      });
    }
  } catch (err) {
    console.warn("Sitemap: Supabase dynamic project fetch skipped or unavailable during build.", err);
  }

  return [rootEntry, ...staticEntries, ...projectEntries];
}
