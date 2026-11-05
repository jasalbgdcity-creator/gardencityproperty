/**
 * Garden City Properties — Robust Video URL Parser & Embed Helper
 *
 * Handles all standard and edge-case YouTube and Vimeo URLs:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - m.youtube.com, music.youtube.com, naked domains (youtube.com, youtu.be)
 * - Query strings (?si=..., &feature=..., &ab_channel=..., etc.)
 * - Timestamps (?t=1m30s, ?t=90, &start=90)
 * - Direct video files (.mp4, .webm, .ogg)
 * - Vimeo (vimeo.com/ID, player.vimeo.com/video/ID)
 */

export type VideoProvider = "youtube" | "vimeo" | "direct" | "unknown";

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string | null;
  embedUrl: string | null;
  watchUrl: string | null;
  thumbnailUrl: string | null;
  isValid: boolean;
  error?: string;
}

/**
 * Converts timestamp strings like "1m30s", "90s", "90" into integer seconds.
 */
function parseTimestampToSeconds(timestamp: string): number | null {
  if (!timestamp) return null;
  const trimmed = timestamp.trim().toLowerCase();

  // Pure numeric seconds: "90"
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  // Format: "1h20m30s" or "2m15s" or "45s"
  const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
  const match = trimmed.match(regex);
  if (match && (match[1] || match[2] || match[3])) {
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

/**
 * Extracts YouTube video ID and optional start time from any YouTube URL format.
 */
export function extractYouTubeId(rawUrl: string): { videoId: string; startTime?: number } | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  let url = rawUrl.trim();

  // If URL has no protocol, prepend https://
  if (/^([a-z0-9_-]+\.)?youtube\.com/i.test(url) || /^youtu\.be/i.test(url)) {
    url = "https://" + url;
  }

  // Check if user just pasted an 11-char YouTube ID directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return { videoId: url };
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let videoId: string | null = null;
    let startTime: number | undefined = undefined;

    // Check for timestamp in query params (t or start)
    const tParam = parsed.searchParams.get("t") || parsed.searchParams.get("start");
    if (tParam) {
      const parsedSecs = parseTimestampToSeconds(tParam);
      if (parsedSecs !== null && parsedSecs > 0) {
        startTime = parsedSecs;
      }
    }

    if (host === "youtu.be") {
      // Path format: /VIDEO_ID
      const pathId = parsed.pathname.slice(1).split("/")[0]?.split("?")[0];
      if (pathId && /^[a-zA-Z0-9_-]{11}$/.test(pathId)) {
        videoId = pathId;
      }
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const path = parsed.pathname;

      if (path === "/watch") {
        // Query param format: ?v=VIDEO_ID
        const vParam = parsed.searchParams.get("v");
        if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
          videoId = vParam;
        }
      } else if (path.startsWith("/embed/")) {
        // Embed format: /embed/VIDEO_ID
        const embedId = path.split("/embed/")[1]?.split("/")[0]?.split("?")[0];
        if (embedId && /^[a-zA-Z0-9_-]{11}$/.test(embedId)) {
          videoId = embedId;
        }
      } else if (path.startsWith("/shorts/")) {
        // Shorts format: /shorts/VIDEO_ID
        const shortId = path.split("/shorts/")[1]?.split("/")[0]?.split("?")[0];
        if (shortId && /^[a-zA-Z0-9_-]{11}$/.test(shortId)) {
          videoId = shortId;
        }
      } else if (path.startsWith("/live/")) {
        // Live stream format: /live/VIDEO_ID
        const liveId = path.split("/live/")[1]?.split("/")[0]?.split("?")[0];
        if (liveId && /^[a-zA-Z0-9_-]{11}$/.test(liveId)) {
          videoId = liveId;
        }
      } else if (path.startsWith("/v/")) {
        // Legacy format: /v/VIDEO_ID
        const legacyId = path.split("/v/")[1]?.split("/")[0]?.split("?")[0];
        if (legacyId && /^[a-zA-Z0-9_-]{11}$/.test(legacyId)) {
          videoId = legacyId;
        }
      }
    }

    if (videoId) {
      return { videoId, startTime };
    }
  } catch {
    // If standard URL constructor fails, fall back to comprehensive regex
  }

  // Regex fallback for non-standard or malformed strings
  const ytRegex =
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i;
  const match = url.match(ytRegex);
  if (match && match[1]) {
    // Check for t= or start= in the remainder
    const timeMatch = url.match(/[?&](?:t|start)=([a-zA-Z0-9]+)/i);
    let startTime: number | undefined = undefined;
    if (timeMatch && timeMatch[1]) {
      const parsedSecs = parseTimestampToSeconds(timeMatch[1]);
      if (parsedSecs !== null && parsedSecs > 0) {
        startTime = parsedSecs;
      }
    }
    return { videoId: match[1], startTime };
  }

  return null;
}

/**
 * Extracts Vimeo video ID from Vimeo URLs.
 */
export function extractVimeoId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  let url = rawUrl.trim();
  if (/^vimeo\.com/i.test(url)) {
    url = "https://" + url;
  }
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i;
  const match = url.match(vimeoRegex);
  return match && match[1] ? match[1] : null;
}

/**
 * Comprehensive video URL parser.
 * Generates privacy-enhanced embed URLs (youtube-nocookie.com), official watch links,
 * and high-resolution thumbnail URLs.
 */
export function parseVideoUrl(rawUrl: string | null | undefined): ParsedVideo {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return {
      provider: "unknown",
      videoId: null,
      embedUrl: null,
      watchUrl: null,
      thumbnailUrl: null,
      isValid: false,
      error: "No video URL provided",
    };
  }

  const trimmed = rawUrl.trim();

  // 1. Check YouTube
  const ytInfo = extractYouTubeId(trimmed);
  if (ytInfo) {
    const { videoId, startTime } = ytInfo;
    const startParam = startTime ? `&start=${startTime}` : "";

    // Using youtube-nocookie.com avoids third-party tracking cookies and connection issues
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${startParam}`;
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}${startTime ? `&t=${startTime}s` : ""}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      provider: "youtube",
      videoId,
      embedUrl,
      watchUrl,
      thumbnailUrl,
      isValid: true,
    };
  }

  // 2. Check Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      provider: "vimeo",
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      watchUrl: `https://vimeo.com/${vimeoId}`,
      thumbnailUrl: null,
      isValid: true,
    };
  }

  // 3. Check Direct Video file (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      provider: "direct",
      videoId: null,
      embedUrl: trimmed,
      watchUrl: trimmed,
      thumbnailUrl: null,
      isValid: true,
    };
  }

  // 4. Invalid or unrecognized
  return {
    provider: "unknown",
    videoId: null,
    embedUrl: null,
    watchUrl: null,
    thumbnailUrl: null,
    isValid: false,
    error: "Unrecognized video format. Please provide a valid YouTube, Vimeo, or MP4 link.",
  };
}
