import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Convert PDF to base64 for sending to Claude
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = btoa(binary);

  const conversionPrompt = `This is a Z.A Training nutrition meal plan PDF.

Your job: Read the entire plan and convert ALL portion measurements to cup measurements, then return the complete plan as a JSON object.

RULES:
- Keep every meal EXACTLY the same — same meal names, same foods, same days, same order
- ONLY change the "portionGuide" field to use cups
- Convert grams/tablespoons/hand portions to cups: e.g. "150g cooked rice" → "¾ cup cooked rice", "4 tbsp keema" → "½ cup keema", "1 palm chicken" → "¾ cup cooked chicken"
- For items that don't translate to cups (e.g. "1 chapati", "1 protein bar", "1 x 150g Skyr pot", "1 egg"), keep them as natural units — do NOT force cups on these
- Preserve ALL calorie and macro numbers exactly as shown in the PDF
- Keep all tips, summary, quick wins, shopping list and targets exactly as they appear
- STRICTLY HALAL — never introduce pork, bacon, alcohol or anything haram

Return ONLY a valid JSON object in this exact schema:
{
  "title": "string",
  "targets": { "tdee": "string", "calories": "string", "protein": "string", "fibre": "string" },
  "weeks": [{
    "weekNumber": 1,
    "days": [{
      "day": "Monday",
      "meals": [{
        "type": "Breakfast",
        "name": "string",
        "description": "string",
        "portionGuide": "converted to cups here",
        "metrics": "string",
        "prepNote": "string or null"
      }],
      "dailyTotals": "string"
    }]
  }],
  "shoppingList": {
    "proteins": ["string"],
    "vegetables": ["string"],
    "grainsAndCarbs": ["string"],
    "dairyOrAlternatives": ["string"],
    "storeCupboardStaples": ["string"]
  },
  "tips": ["string"],
  "summary": "string",
  "quickWins": ["string"]
}`;

  const payload = {
    model: 'claude-haiku-4-5',
    max_tokens: 16000,
    stream: true,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64
            }
          },
          {
            type: 'text',
            text: conversionPrompt
          }
        ]
      }
    ]
  };

  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(payload)
  });

  if (!claudeResponse.ok) {
    const error = await claudeResponse.text();
    return new Response(error, { status: claudeResponse.status });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = claudeResponse.body!.getReader();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
                const text = data.delta.text || '';
                if (text) controller.enqueue(encoder.encode(text));
              }
            } catch {}
          }
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
