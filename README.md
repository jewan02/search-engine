## Site Intel – Architectural Site Research Aggregator

A lightweight App Router experience for architects and students to explore GIS, zoning, code, and cultural resources for any site. Queries are geocoded with the Google Maps API and enriched by the OpenAI Responses API to produce a summary plus curated link modules.

### Tech
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS for layout and tokens
- OpenAI Responses API (GPT-5 ready, default model `gpt-4.1-mini`)
- Google Maps Geocoding + JS SDK (no database or city-specific backend)

## Getting Started

1. Copy the environment template and add keys:
   ```bash
   cp .env.example .env.local
   ```
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4.1-mini   # optional override
   GOOGLE_MAPS_API_KEY=...      # used on the API route
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...  # used by the map component
   ```
2. Install dependencies and run the dev server:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) and try a natural-language site prompt such as:
   - `Ithaca Farmers Market site`
   - `123 Main St Boston – need zoning and GIS info`

The `/api/search` route performs the following steps on each request:
1. Google Geocoding API normalizes the address + coordinates.
2. OpenAI Responses API (JSON schema enforced) generates the summary and 4 link groups (GIS, Zoning, Code, Narrative).
3. The React client renders the address, Google Map pin, summary, and responsive link grid with loading + error states.

## Project Structure

- `app/api/search/route.ts` – serverless handler that orchestrates geocoding + OpenAI.
- `components/*` – modular UI pieces (`SearchBar`, `MapDisplay`, `SummaryBox`, `LinkModule`, `SearchExperience`).
- `lib/` – helper utilities for OpenAI, Google, and schema validation.
- `types/search.ts` – shared TypeScript contracts between API and UI.

## Stretch Ideas
- Export PDF or Notion-ready packets of the summary/link content.
- Voice input wrapper on the search bar (Web Speech API).
- LocalStorage bookmarks for frequently referenced sites.
