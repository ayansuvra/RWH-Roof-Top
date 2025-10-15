/**
 * Client-side AI rooftop detection using Google Gemini API
 */

export interface SuggestRooftopBoundariesInput {
  satelliteImageDataUri: string;
  clickedPoint: { x: number; y: number };
}

export interface SuggestRooftopBoundariesOutput {
  suggestedBoundaries: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export async function suggestRooftopBoundaries(
  input: SuggestRooftopBoundariesInput
): Promise<SuggestRooftopBoundariesOutput> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this satellite image and identify the rooftop boundaries at coordinates (${input.clickedPoint.x}, ${input.clickedPoint.y}). Return a GeoJSON Polygon with coordinates as a JSON object in this exact format: {"type":"Polygon","coordinates":[[[x1,y1],[x2,y2],[x3,y3],[x4,y4],[x1,y1]]]}`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: input.satelliteImageDataUri.split(',')[1]
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      })
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      const jsonMatch = text.match(/\{[^}]*"type"[^}]*\}/);
      if (jsonMatch) {
        const boundaries = JSON.parse(jsonMatch[0]);
        return { suggestedBoundaries: boundaries };
      }
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('AI detection failed:', error);
    // Fallback to simple detection around clicked point
    return {
      suggestedBoundaries: {
        type: "Polygon",
        coordinates: [[
          [input.clickedPoint.x - 80, input.clickedPoint.y - 60],
          [input.clickedPoint.x + 80, input.clickedPoint.y - 60],
          [input.clickedPoint.x + 80, input.clickedPoint.y + 60],
          [input.clickedPoint.x - 80, input.clickedPoint.y + 60],
          [input.clickedPoint.x - 80, input.clickedPoint.y - 60]
        ]]
      }
    };
  }
}
