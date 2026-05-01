/**
 * Helpers voor base64-encoding en simpele PCM-resampling.
 * De Live API verwacht 16-bit PCM mono op 16 kHz, base64-encoded.
 */

export function encodePcmChunk(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  return base64FromBytes(bytes);
}

export function base64FromBytes(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...sub);
  }
  return btoa(binary);
}

export function bytesFromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function floatsToInt16(floats: Float32Array): Int16Array {
  const out = new Int16Array(floats.length);
  for (let i = 0; i < floats.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, floats[i]));
    out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return out;
}

/**
 * Simpele lineaire downsampling van bron-rate naar 16 kHz.
 * Niet anti-aliased; voldoende voor spraak die door VAD aan de Google-zijde
 * wordt verwerkt en daarna door hun ASR opnieuw geresampled wordt.
 */
export function downsampleTo16k(
  input: Float32Array,
  fromRate: number
): Float32Array {
  const targetRate = 16_000;
  if (fromRate === targetRate) return input;
  if (fromRate < targetRate) return input;
  const ratio = fromRate / targetRate;
  const length = Math.floor(input.length / ratio);
  const out = new Float32Array(length);
  let position = 0;
  for (let i = 0; i < length; i += 1) {
    const start = Math.floor(position);
    const end = Math.min(input.length, Math.floor(position + ratio));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j += 1) {
      sum += input[j];
      count += 1;
    }
    out[i] = count > 0 ? sum / count : 0;
    position += ratio;
  }
  return out;
}
