import { SearchExperience } from "@/components/search-experience";

const mapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;

export default function Home() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs uppercase text-zinc-500">
            noname project
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
            One search for GIS, zoning, code, and narrative intel.
          </h1>
          <p className="max-w-3xl text-lg text-zinc-600">
            Paste any address or describe the site. We will geocode it, summarize
            the design context, and gather the best external resources—no city
            specific backend required.
          </p>
        </header>

        <SearchExperience mapsApiKey={mapsApiKey} />
      </div>
    </main>
  );
}
