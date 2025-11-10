export type ResourceCategory = "GIS" | "Zoning" | "Code" | "Narrative";

export interface ResourceLink {
  title: string;
  url: string;
  description?: string;
}

export interface SearchResult {
  address: string;
  coords: [number, number];
  summary: string;
  links: Record<ResourceCategory, ResourceLink[]>;
}

export interface SearchRequestPayload {
  q: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "GIS",
  "Zoning",
  "Code",
  "Narrative",
];
