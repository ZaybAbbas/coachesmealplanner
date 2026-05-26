import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Extract prompt from payload
  const prompt = body.contents?.[0]?.parts?.[0]?.text || '';

  const payload = {
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 16000,
    stream: true,
    messages: [
      { role: 'user', content: prompt }
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
