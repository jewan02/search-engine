type GeocodeResult = {
  formattedAddress: string;
  coordinates: [number, number];
};

type RawGeocodeResponse = {
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
  status: string;
  error_message?: string;
};

export async function geocodeLocation(query: string): Promise<GeocodeResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY.");
  }

  const params = new URLSearchParams({
    address: query,
    key: apiKey,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
    {
      next: { revalidate: 60 * 60 },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to reach Google Geocoding API.");
  }

  const payload = (await response.json()) as RawGeocodeResponse;
  if (payload.status !== "OK" || payload.results.length === 0) {
    throw new Error(
      payload.error_message ?? "Google could not find that address.",
    );
  }

  const bestMatch = payload.results[0];
  return {
    formattedAddress: bestMatch.formatted_address,
    coordinates: [
      bestMatch.geometry.location.lat,
      bestMatch.geometry.location.lng,
    ],
  };
}
