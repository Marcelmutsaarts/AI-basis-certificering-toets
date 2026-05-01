/**
 * Roept de evaluator-LLM aan via OpenRouter.
 *
 * Model strikt: google/gemini-3.1-pro-preview (configureerbaar via
 * MODEL_EVALUATOR). Probeert eerst response_format json_object, valt bij
 * 4xx parse-fouten terug op gewone messages met strenge prompt.
 *
 * Timeout 60s. Behandelt 429 en 5xx met duidelijke errors zodat de
 * caller netjes kan reageren.
 */
import {
  EvaluatorOutputSchema,
  type EvaluatorOutput,
} from './schema';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT_MS = 60_000;

export interface CallEvaluatorArgs {
  system: string;
  user: string;
  model: string;
}

export function resolveEvaluatorModel(): string {
  const env = process.env.MODEL_EVALUATOR;
  if (env && env.trim().length > 0) return env.trim();
  return 'google/gemini-3.1-pro-preview';
}

interface OpenRouterChoice {
  message?: { content?: string };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
}

function buildHeaders(): Record<string, string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY ontbreekt.');
  }
  const referer =
    process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.length > 0
      ? process.env.NEXT_PUBLIC_APP_URL
      : 'http://localhost:3000';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': referer,
    'X-Title': 'AVD Examinator',
  };
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

async function postChat(
  messages: ChatMessage[],
  model: string,
  withJsonFormat: boolean
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: Record<string, unknown> = { model, messages };
    if (withJsonFormat) {
      body.response_format = { type: 'json_object' };
    }
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.status === 429) {
      throw new Error('Evaluator rate limit (429). Probeer later opnieuw.');
    }
    if (res.status >= 500) {
      throw new Error(`Evaluator-server gaf status ${res.status}.`);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`OpenRouter status ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as OpenRouterResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Lege evaluator-response.');
    }
    return content;
  } finally {
    clearTimeout(timer);
  }
}

function tryParseJson(raw: string): unknown {
  const direct = safeJsonParse(raw);
  if (direct !== undefined) return direct;
  const stripped = stripCodeFence(raw);
  if (stripped !== raw) {
    const second = safeJsonParse(stripped);
    if (second !== undefined) return second;
  }
  const sliced = sliceFirstObject(raw);
  if (sliced) {
    const third = safeJsonParse(sliced);
    if (third !== undefined) return third;
  }
  throw new Error('Evaluator-output is geen geldige JSON.');
}

function safeJsonParse(raw: string): unknown | undefined {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('```')) return raw;
  const withoutFences = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '');
  return withoutFences.trim();
}

function sliceFirstObject(raw: string): string | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
}

export async function callEvaluator({
  system,
  user,
  model,
}: CallEvaluatorArgs): Promise<EvaluatorOutput> {
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
  let raw: string;
  try {
    raw = await postChat(messages, model, true);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'onbekende fout';
    if (msg.startsWith('Evaluator rate limit') || msg.startsWith('Evaluator-server')) {
      throw err;
    }
    console.error('[evaluator] json_object call mislukt, fallback naar plain', msg);
    raw = await postChat(messages, model, false);
  }
  const parsed = tryParseJson(raw);
  const result = EvaluatorOutputSchema.safeParse(parsed);
  if (!result.success) {
    console.error('[evaluator] schema-validatie mislukt', result.error.issues);
    throw new Error('Evaluator-output voldoet niet aan het verwachte schema.');
  }
  return result.data;
}
