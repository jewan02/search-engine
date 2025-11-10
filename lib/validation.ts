import { z } from "zod";
import type { ResourceCategory } from "@/types/search";
import { RESOURCE_CATEGORIES } from "@/types/search";

export const searchRequestSchema = z.object({
  q: z
    .string({
      required_error: "Query is required.",
    })
    .min(3, "Tell me a bit more about the site.")
    .max(280, "Shorten the query to 280 characters or fewer."),
});

const linkSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  description: z.string().optional(),
});

const categorySchema = z.object({
  GIS: z.array(linkSchema).min(1),
  Zoning: z.array(linkSchema).min(1),
  Code: z.array(linkSchema).min(1),
  Narrative: z.array(linkSchema).min(1),
});

export const searchResponseSchema = z.object({
  address: z.string().min(4),
  coords: z
    .tuple([z.number(), z.number()])
    .refine(
      (coords) =>
        coords[0] >= -90 &&
        coords[0] <= 90 &&
        coords[1] >= -180 &&
        coords[1] <= 180,
      "Coordinates must be valid latitude/longitude values.",
    ),
  summary: z.string().min(12),
  links: categorySchema,
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const openAiResponseSchema = {
  name: "architect_site_pack",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["address", "coords", "summary", "links"],
    properties: {
      address: { type: "string" },
      coords: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: { type: "number" },
      },
      summary: { type: "string" },
      links: {
        type: "object",
        additionalProperties: false,
        required: RESOURCE_CATEGORIES,
        properties: RESOURCE_CATEGORIES.reduce(
          (acc, key) => {
            acc[key as ResourceCategory] = {
              type: "array",
              minItems: 2,
              maxItems: 3,
              items: {
                type: "object",
                required: ["title", "url"],
                additionalProperties: true,
                properties: {
                  title: { type: "string" },
                  url: { type: "string", format: "uri" },
                  description: { type: "string" },
                },
              },
            };
            return acc;
          },
          {} as Record<ResourceCategory, unknown>,
        ),
      },
    },
  },
} as const;
