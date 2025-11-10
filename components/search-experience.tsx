'use client';

import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { MapDisplay } from "@/components/map-display";
import { SummaryBox } from "@/components/summary-box";
import { LinkModule } from "@/components/link-module";
import type { SearchResult } from "@/types/search";
import { RESOURCE_CATEGORIES } from "@/types/search";

type SearchExperienceProps = {
  mapsApiKey?: string;
};

const suggestions = [
  "Ithaca Farmers Market waterfront site",
  "545 5th Ave New York zoning + GIS information",
  "Mission District SF lot with code references",
];

export function SearchExperience({ mapsApiKey }: SearchExperienceProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const runSearch = async (value: string) => {
    if (!value) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: value }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to complete the search.");
      }
      setResult(payload as SearchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={runSearch}
          loading={loading}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            Try:
          </span>
          {suggestions.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQuery(sample);
                runSearch(sample);
              }}
              className="rounded-full border border-transparent bg-white px-3 py-1 text-zinc-700 shadow-sm transition hover:border-zinc-300"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div ref={targetRef} className="space-y-6">
        {loading && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <span className="h-3 w-3 animate-ping rounded-full bg-zinc-900" />
              Crunching zoning, GIS, and narrative context…
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 p-8 text-center text-sm text-zinc-500">
            Search for any site worldwide to get coordinates, design summary,
            and curated links in seconds.
          </div>
        )}

        {result && !loading && (
          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Address
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                {result.address}
              </h2>
            </div>

            <MapDisplay
              coords={result.coords}
              address={result.address}
              apiKey={mapsApiKey}
            />

            <div>
              <p className="text-sm font-semibold text-zinc-600">
                Quick Summary
              </p>
              <SummaryBox summary={result.summary} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {RESOURCE_CATEGORIES.map((category) => (
                <LinkModule
                  key={category}
                  title={category}
                  items={result.links?.[category]}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
