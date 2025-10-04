// src/ai/suggestRooftopBoundaries.ts
import { z } from "zod";

// Input Schema
export const SuggestRooftopBoundariesInputSchema = z.object({
  satelliteImageDataUri: z
    .string()
    .describe(
      "A satellite image of a building's rooftop, as a data URI (Base64). Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clickedPoint: z.object({
    x: z.number().describe("The x-coordinate of the click on the image."),
    y: z.number().describe("The y-coordinate of the click on the image."),
  }),
});
export type SuggestRooftopBoundariesInput = z.infer<
  typeof SuggestRooftopBoundariesInputSchema
>;

// Output Schema
const GeoJSONPolygonSchema = z.object({
  type: z.string(), // should be "Polygon"
  coordinates: z.array(z.array(z.array(z.number()))),
});

export const SuggestRooftopBoundariesOutputSchema = z.object({
  suggestedBoundaries: GeoJSONPolygonSchema,
});
export type SuggestRooftopBoundariesOutput = z.infer<
  typeof SuggestRooftopBoundariesOutputSchema
>;

// Mock/Stub Implementation (replace with real API later)
export async function suggestRooftopBoundaries(
  input: SuggestRooftopBoundariesInput
): Promise<SuggestRooftopBoundariesOutput> {
  // Normally you'd call your backend/AI API here.
  // For now, return a mock polygon around the clicked point.
  return {
    suggestedBoundaries: {
      type: "Polygon",
      coordinates: [
        [
          [input.clickedPoint.x - 10, input.clickedPoint.y - 10],
          [input.clickedPoint.x + 10, input.clickedPoint.y - 10],
          [input.clickedPoint.x + 10, input.clickedPoint.y + 10],
          [input.clickedPoint.x - 10, input.clickedPoint.y + 10],
          [input.clickedPoint.x - 10, input.clickedPoint.y - 10],
        ],
      ],
    },
  };
}

