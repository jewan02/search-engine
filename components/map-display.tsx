'use client';

import { useEffect, useRef } from "react";

type MapDisplayProps = {
  coords?: [number, number];
  address?: string;
  apiKey?: string;
};

export function MapDisplay({ coords, address, apiKey }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const lat = coords?.[0];
  const lng = coords?.[1];

  useEffect(() => {
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !apiKey ||
      !mapRef.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    let marker: google.maps.Marker | undefined;
    let map: google.maps.Map | undefined;

    const initializeMap = () => {
      if (!mapRef.current) return;
      map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: address,
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps]",
    );

    if ((window as typeof window & { google?: typeof google }).google?.maps) {
      initializeMap();
      return () => marker?.setMap(null);
    }

    const script = existingScript ?? document.createElement("script");
    if (!existingScript) {
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "true";
      document.head.appendChild(script);
    }

    script.addEventListener("load", initializeMap, { once: true });

    return () => {
      script.removeEventListener("load", initializeMap);
      marker?.setMap(null);
      map = undefined;
    };
  }, [lat, lng, apiKey, address]);

  return (
    <div
      ref={mapRef}
      className="h-80 w-full rounded-3xl border border-zinc-200 bg-zinc-100"
      aria-label={address ? `Map showing ${address}` : "Map placeholder"}
    >
      {!apiKey && (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for map rendering.
        </div>
      )}
    </div>
  );
}
