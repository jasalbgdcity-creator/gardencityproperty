import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface GooglePlaceResult {
  name: string;
  place_id: string;
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
}

export interface NearbyPlaceItem {
  id?: string;
  name: string;
  category: string;
  distance_km: number;
  travel_time_text?: string;
  travel_time_minutes?: number;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
  display_order?: number;
}

/**
 * Calculates straight-line distance in kilometres using the Haversine formula.
 */
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const CATEGORY_SEARCH_SPECS: Array<{ category: string; type: string; keyword?: string; radius: number }> = [
  { category: "Airport", type: "airport", keyword: "international airport", radius: 50000 },
  { category: "Airport", type: "airport", keyword: "airport", radius: 35000 },
  { category: "Hospital", type: "hospital", radius: 15000 },
  { category: "School", type: "school", radius: 12000 },
  { category: "University", type: "university", radius: 25000 },
  { category: "Shopping Mall", type: "shopping_mall", radius: 15000 },
  { category: "Supermarket", type: "supermarket", radius: 10000 },
  { category: "Restaurant", type: "restaurant", radius: 8000 },
  { category: "Hotel", type: "lodging", radius: 15000 },
  { category: "Public Transport", type: "transit_station", radius: 15000 },
  { category: "Landmark", type: "tourist_attraction", keyword: "mosque heritage landmark", radius: 25000 },
  { category: "Beach", type: "natural_feature", keyword: "beach corniche", radius: 25000 },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: "Valid latitude and longitude coordinates are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        hasApiKey: false,
        message:
          "Google Maps API key is not configured in server environment (GOOGLE_MAPS_API_KEY). You can manually add and manage nearby places below.",
        places: [],
      });
    }

    const placesMap = new Map<string, NearbyPlaceItem>();

    // Concurrently fetch places across categories
    const fetchPromises = CATEGORY_SEARCH_SPECS.map(async (spec) => {
      try {
        let endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${spec.radius}&type=${spec.type}&key=${apiKey}&language=en`;
        if (spec.keyword) {
          endpoint += `&keyword=${encodeURIComponent(spec.keyword)}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.status === "OK" && Array.isArray(data.results)) {
          // Take top 2 results per category specification
          const candidates: GooglePlaceResult[] = data.results.slice(0, 2);

          for (const item of candidates) {
            if (!item.name || !item.geometry?.location) continue;

            const placeLat = item.geometry.location.lat;
            const placeLng = item.geometry.location.lng;
            const dist = calculateHaversineKm(lat, lng, placeLat, placeLng);
            const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLng}${
              item.place_id ? `&destination_place_id=${item.place_id}` : ""
            }`;

            // Deduplicate by place_id or name
            const key = item.place_id || item.name.toLowerCase();
            if (!placesMap.has(key)) {
              placesMap.set(key, {
                name: item.name,
                category: spec.category,
                distance_km: dist,
                travel_time_text: `${dist} km`,
                google_maps_url: navUrl,
                latitude: placeLat,
                longitude: placeLng,
                place_id: item.place_id,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Error querying category ${spec.category}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // Sort by distance ascending
    const sortedPlaces = Array.from(placesMap.values()).sort(
      (a, b) => a.distance_km - b.distance_km
    );

    // Limit to top 12 relevant places
    const finalPlaces = sortedPlaces.slice(0, 12).map((place, index) => ({
      ...place,
      display_order: index,
    }));

    return NextResponse.json({
      success: true,
      hasApiKey: true,
      count: finalPlaces.length,
      places: finalPlaces,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve nearby places.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
