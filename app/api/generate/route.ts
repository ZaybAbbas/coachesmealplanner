import { NextRequest } from 'next/server';

export const runtime = 'edge';

async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

export async function POST(request: NextRequest) {
  // Gate the endpoint itself, not just the UI — otherwise anyone who finds the
  // URL can spend Anthropic credits by posting straight to it.
  const expectedPassword = process.env.APP_PASSWORD;
  if (!expectedPassword) {
    return new Response('APP_PASSWORD is not set on the server.', { status: 500 });
  }
  if (request.headers.get('x-app-password') !== expectedPassword) {
    return new Response('Unauthorised', { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const contentType = request.headers.get('content-type') || '';

  // Most calls (the full plan, the recipe book) run fine on Haiku. The Starter
  // Plan's food-diary reading needs a model that's careful with photos and
  // won't guess — the caller opts into that with `model`. Whitelisted so a
  // client can't smuggle an arbitrary model string through this field.
  const ALLOWED_MODELS = ['claude-haiku-4-5', 'claude-sonnet-5'];
  let requestedModel = 'claude-haiku-4-5';

  let content: any;

  if (contentType.includes('multipart/form-data')) {
    // Diary-photo flow: text prompt + one or more images sent as form data
    const formData = await request.formData();
    const prompt = (formData.get('prompt') as string) || '';
    const images = formData.getAll('diaryImages') as File[];
    const modelField = formData.get('model') as string | null;
    if (modelField && ALLOWED_MODELS.includes(modelField)) requestedModel = modelField;

    const imageBlocks = await Promise.all(images.map(async (file) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: file.type || 'image/jpeg',
        data: await fileToBase64(file)
      }
    })));

    content = [...imageBlocks, { type: 'text', text: prompt }];
  } else {
    const body = await request.json();
    content = body.contents?.[0]?.parts?.[0]?.text || '';
    if (body.model && ALLOWED_MODELS.includes(body.model)) requestedModel = body.model;
  }

  const payload = {
    model: requestedModel,
    max_tokens: 16000,
    stream: true,
    messages: [
      { role: 'user', content }
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
