import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  formatted_address?: string;
  address_components?: GeocodeAddressComponent[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

/**
 * Extracts latitude and longitude from Google Maps URLs.
 */
function extractCoordinatesFromUrl(targetUrl: string): { lat: number; lng: number } | null {
  // Pattern 1: /@23.588033,58.382877,15z or /@23.588033,58.382877
  const atMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Pattern 2: ?q=23.588033,58.382877 or &q=23.588033,58.382877
  const qMatch = targetUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Pattern 3: !3d23.588033!4d58.382877 (data payload coordinates)
  const dataMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dataMatch) {
    const lat = parseFloat(dataMatch[1]);
    const lng = parseFloat(dataMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Pattern 4: ll=23.588033,58.382877
  const llMatch = targetUrl.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = String(body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Google Maps location link." },
        { status: 400 }
      );
    }

    let resolvedUrl = rawUrl;

    // Follow redirects for shortened Google Maps links (e.g. maps.app.goo.gl or goo.gl/maps)
    if (rawUrl.includes("goo.gl") || rawUrl.includes("maps.app.goo.gl")) {
      try {
        const response = await fetch(rawUrl, {
          method: "HEAD",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        resolvedUrl = response.url || rawUrl;
      } catch (redirectErr) {
        // If HEAD fails, try standard GET with stream abort
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(rawUrl, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
          });
          clearTimeout(timeout);
          resolvedUrl = response.url || rawUrl;
        } catch (e) {
          console.warn("Could not follow redirect:", e);
        }
      }
    }

    // Try extracting coordinates from the final resolved URL
    const coords = extractCoordinatesFromUrl(resolvedUrl) || extractCoordinatesFromUrl(rawUrl);

    let latitude = coords?.lat ?? null;
    let longitude = coords?.lng ?? null;
    let formattedAddress = "";
    let city = "Muscat";
    let country = "Oman";

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // If Google Maps API key is configured, perform reverse geocoding
    if (apiKey && latitude !== null && longitude !== null) {
      try {
        const geocodeRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
        );
        const geocodeData = await geocodeRes.json();

        if (geocodeData.status === "OK" && Array.isArray(geocodeData.results) && geocodeData.results.length > 0) {
          const first: GeocodeResult = geocodeData.results[0];
          formattedAddress = first.formatted_address || "";

          if (first.address_components) {
            for (const comp of first.address_components) {
              if (comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")) {
                city = comp.long_name;
              }
              if (comp.types.includes("country")) {
                country = comp.long_name;
              }
            }
          }
        }
      } catch (geoErr) {
        console.warn("Google Geocoding failed:", geoErr);
      }
    }

    // If coordinates were found, return success
    if (latitude !== null && longitude !== null) {
      return NextResponse.json({
        success: true,
        latitude,
        longitude,
        formattedAddress,
        city,
        country,
        resolvedUrl,
        hasApiKey: Boolean(apiKey),
      });
    }

    // If no coordinates could be parsed, notify admin and allow manual entry
    return NextResponse.json(
      {
        success: false,
        error:
          "Could not automatically parse coordinates from this Google Maps link. Please verify the URL or enter the coordinates and address manually below.",
        resolvedUrl,
        hasApiKey: Boolean(apiKey),
      },
      { status: 422 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resolve location.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
