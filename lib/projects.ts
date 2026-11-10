export type Project = {
  id: string;
  name: string;
  image: string;
  price: string;
  paymentPlan: string;
  startingArea: string;
  developer: string;
  whatsapp_number?: string;
};

export const PROJECTS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1iPJQFbZX6b7iYxWiOkyfP79n72NqDwsTBj8I1EbSKNA/gviz/tq?tqx=out:csv";

export const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw6g4sIpwIY0uvpudTyEK3rGmAN_FRyXVELdVSVe0Tkyd1Uv2FvXVGrG8KQdvfMZ4NK/exec";

/**
 * Converts Google Drive viewer and sharing links into direct image rendering URLs:
 * https://drive.google.com/uc?export=view&id=ID
 */
export function toDirectDriveImageUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const cleaned = rawUrl.trim().replace(/^["']|["']$/g, "").trim();
  if (!cleaned) return "";

  // 1. Match /file/d/<ID> or /d/<ID>
  const fileMatch = cleaned.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  // 2. Match ?id=<ID> or &id=<ID>
  const idMatch = cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }

  return cleaned;
}

export function isGoogleDriveUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return /drive\.google\.com|googleusercontent\.com|docs\.google\.com/i.test(url);
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      if (row.some((c) => c.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function cleanCell(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

function fallback(value: string | undefined, emptyValue: string): string {
  const cleaned = cleanCell(value);
  return cleaned.length > 0 ? cleaned : emptyValue;
}

function isHeaderRow(row: string[]): boolean {
  if (!row || row.length === 0) return false;
  const first = cleanCell(row[0]).toLowerCase();
  const joined = row.map(cleanCell).join(" ").toLowerCase();

  return (
    first.includes("name of the project") ||
    first.includes("project name") ||
    first === "name" ||
    joined.includes("image link") ||
    joined.includes("payment plan") ||
    joined.includes("starting area") ||
    joined.includes("developer")
  );
}

export function parseProjectsCsv(csv: string): Project[] {
  const rows = parseCsv(csv);
  if (rows.length === 0) return [];

  const startIndex = isHeaderRow(rows[0] ?? []) ? 1 : 0;

  return rows
    .slice(startIndex)
    .map((columns, index) => {
      const rawName = cleanCell(columns[0]);
      const rawImage = cleanCell(columns[1]);
      const price = fallback(columns[2], "0");
      const paymentPlan = fallback(columns[3], "N/A");
      const startingArea = fallback(columns[4], "0");
      const developer = fallback(columns[5], "N/A");

      return {
        id: `proj-${index}-${rawName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name: rawName,
        image: rawImage ? toDirectDriveImageUrl(rawImage) : "",
        price,
        paymentPlan,
        startingArea,
        developer,
      };
    })
    .filter((project) => {
      // If a row is deleted from the sheet, it must immediately disappear from the UI
      return project.name.length > 0;
    });
}

/**
 * Parses JSON returned from Google Apps Script web apps, Next.js API, or custom endpoints.
 * Handles arrays of objects, objects with { projects: [...] }, { data: [...] }, or 2D row arrays.
 */
export function parseProjectsJson(data: unknown): Project[] {
  if (!data) return [];

  let rawList: unknown[] = [];

  if (Array.isArray(data)) {
    rawList = data;
  } else if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.projects)) {
      rawList = record.projects;
    } else if (Array.isArray(record.data)) {
      rawList = record.data;
    } else if (Array.isArray(record.rows)) {
      rawList = record.rows;
    } else if (Array.isArray(record.items)) {
      rawList = record.items;
    }
  }

  // Handle 2D array of rows (e.g. from Sheets getValues())
  if (rawList.length > 0 && Array.isArray(rawList[0])) {
    const rows = rawList as string[][];
    const firstRowJoined = (rows[0] ?? []).join(" ").toLowerCase();
    const startIndex =
      firstRowJoined.includes("name") || firstRowJoined.includes("project")
        ? 1
        : 0;

    return rows
      .slice(startIndex)
      .map((cols, idx) => {
        const name = String(cols[0] ?? "").trim();
        const imageRaw = String(cols[1] ?? "").trim();
        const price = String(cols[2] ?? "").trim() || "0";
        const paymentPlan = String(cols[3] ?? "").trim() || "N/A";
        const startingArea = String(cols[4] ?? "").trim() || "0";
        const developer = String(cols[5] ?? "").trim() || "N/A";

        return {
          id: `proj-json-row-${idx}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name,
          image: imageRaw ? toDirectDriveImageUrl(imageRaw) : "",
          price,
          paymentPlan,
          startingArea,
          developer,
        };
      })
      .filter((p) => p.name.length > 0);
  }

  // Handle array of objects (from Google Apps Script or REST API)
  return rawList
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;

      const name = String(
        row.name ??
          row.Name ??
          row["Name of the project"] ??
          row["Name of the Project"] ??
          row["project_name"] ??
          row["Project Name"] ??
          row.title ??
          "",
      ).trim();

      const imageRaw = String(
        row.image ??
          row.Image ??
          row["Image link"] ??
          row["Image Link"] ??
          row["image_link"] ??
          row.imageUrl ??
          row.imageLink ??
          "",
      ).trim();

      const price =
        String(
          row.price ??
            row.Price ??
            row["Price"] ??
            "",
        ).trim() || "0";

      const paymentPlan =
        String(
          row.paymentPlan ??
            row.payment_plan ??
            row["Payment Plan"] ??
            row["paymentPlan"] ??
            "",
        ).trim() || "N/A";

      const startingArea =
        String(
          row.startingArea ??
            row.starting_area ??
            row["Starting Area"] ??
            row["startingArea"] ??
            row.area ??
            "",
        ).trim() || "0";

      const developer =
        String(
          row.developer ??
            row.Developer ??
            row["Developer"] ??
            "",
        ).trim() || "N/A";

      return {
        id: `proj-json-${index}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name,
        image: imageRaw ? toDirectDriveImageUrl(imageRaw) : "",
        price,
        paymentPlan,
        startingArea,
        developer,
      };
    })
    .filter((p): p is Project => p !== null && p.name.length > 0);
}
