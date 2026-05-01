/**
 * LivePlayer: speelt 16-bit PCM mono op 24 kHz af in real-time.
 * Buffert binnenkomende chunks en plant ze achter elkaar zonder gaps.
 */
import { OUTPUT_SAMPLE_RATE } from '@/lib/bot/persona';
import { bytesFromBase64 } from './encode';

export class LivePlayer {
  private context: AudioContext | null = null;
  private nextStartTime = 0;

  async init(): Promise<void> {
    if (this.context) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.context = new Ctor({ sampleRate: OUTPUT_SAMPLE_RATE });
    this.nextStartTime = this.context.currentTime;
  }

  enqueueBase64(base64: string): void {
    if (!this.context) return;
    const bytes = bytesFromBase64(base64);
    if (bytes.length === 0) return;
    const samples = bytes.length / 2;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const float = new Float32Array(samples);
    for (let i = 0; i < samples; i += 1) {
      const v = view.getInt16(i * 2, true);
      float[i] = v / 0x8000;
    }
    const audioBuffer = this.context.createBuffer(
      1,
      samples,
      OUTPUT_SAMPLE_RATE
    );
    audioBuffer.getChannelData(0).set(float);

    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);

    const startAt = Math.max(this.context.currentTime, this.nextStartTime);
    source.start(startAt);
    this.nextStartTime = startAt + audioBuffer.duration;
  }

  stop(): void {
    if (!this.context) return;
    const ctx = this.context;
    this.context = null;
    this.nextStartTime = 0;
    if (ctx.state !== 'closed') {
      ctx.close().catch(() => undefined);
    }
  }
}
