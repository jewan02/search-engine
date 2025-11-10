import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai-client";
import { geocodeLocation } from "@/lib/google";
import {
  openAiResponseSchema,
  searchRequestSchema,
  searchResponseSchema,
} from "@/lib/validation";

const systemPrompt = `You are an architectural research assistant. Given a query you must return:
1. A normalized address for the site (use provided geocoder data as ground truth when available).
2. Latitude and longitude values.
3. A 2-3 sentence summary that focuses on the site's urban design, cultural, or planning context.
4. Four categories (GIS, Zoning, Code, Narrative). Each category includes 2-3 high quality external links with clear titles. Favor official city/state sources, academic resources, and widely used professional tools.`;

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { q } = searchRequestSchema.parse(body);

    const geocoded = await geocodeLocation(q);
    const openai = getOpenAIClient();

    const response = await openai.responses.create({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_output_tokens: 1200,
      response_format: {
        type: "json_schema",
        json_schema: openAiResponseSchema,
      },
      input: [
        {
          role: "system",
          content: [{ type: "text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: q,
                  geocode: {
                    address: geocoded.formattedAddress,
                    coords: geocoded.coordinates,
                  },
                },
                null,
                2,
              ),
            },
          ],
        },
      ],
    });

    const asText = extractStructuredText(response);
    if (!asText) {
      throw new Error("OpenAI returned an empty response.");
    }

    const parsed = searchResponseSchema.parse(JSON.parse(asText));

    return NextResponse.json({
      ...parsed,
      address: geocoded.formattedAddress ?? parsed.address,
      coords: geocoded.coordinates ?? parsed.coords,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 },
      );
    }
    if ("issues" in (error as { issues?: unknown })) {
      const message =
        Array.isArray((error as { issues: Array<{ message: string }> }).issues) &&
        (error as { issues: Array<{ message: string }> }).issues.length > 0
          ? (error as { issues: Array<{ message: string }> }).issues[0].message
          : "Validation failed.";

      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error("[/api/search] error", error);
    return NextResponse.json(
      { error: "We could not generate the site packet. Try again soon." },
      { status: 500 },
    );
  }
}

function extractStructuredText(result: unknown): string | null {
  if (
    result &&
    typeof result === "object" &&
    "output_text" in result &&
    Array.isArray((result as { output_text?: unknown }).output_text)
  ) {
    const asString = (result as { output_text: string[] }).output_text.join("");
    if (asString.trim().length > 0) {
      return asString.trim();
    }
  }

  if (
    result &&
    typeof result === "object" &&
    "output" in result &&
    Array.isArray((result as { output?: unknown }).output)
  ) {
    for (const item of (result as { output: unknown[] }).output) {
      if (
        item &&
        typeof item === "object" &&
        "content" in item &&
        Array.isArray((item as { content?: unknown }).content)
      ) {
        const textPart = (item as { content: Array<{ type: string; text?: string }> }).content.find(
          (part) => part.type === "output_text" && typeof part.text === "string",
        );
        if (textPart?.text) return textPart.text.trim();
      }
    }
  }

  return null;
}
