// The real GitHub Models PAT must never end up in a shipped bundle — anything
// under VITE_* is plain text in the built JS. For local dev you can still use
// VITE_GITHUB_MODELS_KEY directly; the public/deployed build should only ever
// set VITE_API_PROXY_URL, pointing at cloudflare-worker/ which holds the real
// key server-side.
const PROXY_URL = import.meta.env.VITE_API_PROXY_URL;
const DIRECT_KEY = import.meta.env.VITE_GITHUB_MODELS_KEY;
const MODEL = 'gpt-4o-mini';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatCompletion(messages: Message[]): Promise<string> {
  const useProxy = Boolean(PROXY_URL);
  const url = useProxy ? PROXY_URL : 'https://models.inference.ai.azure.com/chat/completions';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!useProxy) headers.Authorization = `Bearer ${DIRECT_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.choices[0].message.content.trim();
}
