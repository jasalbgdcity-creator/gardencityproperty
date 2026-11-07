import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gardencityproperties.net";
  const now = new Date();

  // 1. Clean Top-Level Canonical Routes with Trailing Slashes (matches trailingSlash: true)
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en/`,
          "ar-OM": `${baseUrl}/ar/`,
          "x-default": `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/en/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en/`,
          "ar-OM": `${baseUrl}/ar/`,
          "x-default": `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en/`,
          "ar-OM": `${baseUrl}/ar/`,
          "x-default": `${baseUrl}/`,
        },
      },
    },
  ];

  // 2. Dedicated Section Canonical Routes (8 Localized URLs)
  const sections = [
    { slug: "about", priority: 0.85, changeFreq: "monthly" as const },
    { slug: "projects", priority: 0.90, changeFreq: "weekly" as const },
    { slug: "services", priority: 0.85, changeFreq: "monthly" as const },
    { slug: "contact", priority: 0.80, changeFreq: "monthly" as const },
  ];

  const sectionRoutes: MetadataRoute.Sitemap = sections.flatMap((section) => [
    {
      url: `${baseUrl}/en/${section.slug}/`,
      lastModified: now,
      changeFrequency: section.changeFreq,
      priority: section.priority,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en/${section.slug}/`,
          "ar-OM": `${baseUrl}/ar/${section.slug}/`,
          "x-default": `${baseUrl}/en/${section.slug}/`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/${section.slug}/`,
      lastModified: now,
      changeFrequency: section.changeFreq,
      priority: section.priority,
      alternates: {
        languages: {
          "en-OM": `${baseUrl}/en/${section.slug}/`,
          "ar-OM": `${baseUrl}/ar/${section.slug}/`,
          "x-default": `${baseUrl}/en/${section.slug}/`,
        },
      },
    },
  ]);

  // 3. Dynamic Project / Property entries fetched from Supabase
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
            url: `${baseUrl}/en/projects/${projectId}/`,
            lastModified: validLastMod,
            changeFrequency: "weekly" as const,
            priority: 0.85,
            alternates: {
              languages: {
                "en-OM": `${baseUrl}/en/projects/${projectId}/`,
                "ar-OM": `${baseUrl}/ar/projects/${projectId}/`,
                "x-default": `${baseUrl}/en/projects/${projectId}/`,
              },
            },
          },
          {
            url: `${baseUrl}/ar/projects/${projectId}/`,
            lastModified: validLastMod,
            changeFrequency: "weekly" as const,
            priority: 0.85,
            alternates: {
              languages: {
                "en-OM": `${baseUrl}/en/projects/${projectId}/`,
                "ar-OM": `${baseUrl}/ar/projects/${projectId}/`,
                "x-default": `${baseUrl}/en/projects/${projectId}/`,
              },
            },
          },
        ];
      });
    }
  } catch (err) {
    console.warn("Sitemap: Supabase dynamic project fetch skipped or unavailable during build.", err);
  }

  return [...coreRoutes, ...sectionRoutes, ...projectEntries];
}
