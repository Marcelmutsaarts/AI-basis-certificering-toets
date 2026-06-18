/**
 * LiveRecorder: pakt microfoon-audio via getUserMedia en levert
 * 16-bit PCM mono op 16 kHz aan in chunks van ~250 ms.
 *
 * Gebruikt een ScriptProcessorNode zodat we niet afhankelijk zijn van
 * AudioWorklets (die in sommige WebView-omgevingen problematisch zijn).
 * De ScriptProcessor is deprecated maar in alle huidige browsers nog
 * functioneel; voor productie kan je dit later naar een AudioWorklet
 * porten zonder API-changes hier buiten.
 */
import { downsampleTo16k, floatsToInt16 } from './encode';
import { INPUT_SAMPLE_RATE } from '@/lib/bot/persona';

export interface RecorderOptions {
  onChunk: (pcm: Int16Array) => void;
  // Optioneel: genormaliseerd mic-niveau 0..1 (RMS) per chunk, voor een
  // live niveaumeter. Raakt de send-pipeline niet; puur informatief.
  onLevel?: (level: number) => void;
}

export class LiveRecorder {
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private buffer: Float32Array[] = [];
  private bufferLength = 0;
  private muted = false;
  private readonly chunkTarget = INPUT_SAMPLE_RATE / 4; // 250 ms bij 16 kHz

  constructor(private readonly options: RecorderOptions) {}

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
    });
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.context = new Ctor();
    this.source = this.context.createMediaStreamSource(this.stream);
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (event) => this.handleAudio(event);
    this.source.connect(this.processor);
    // Verbinden met destination is nodig voor onaudioprocess in sommige browsers,
    // maar we willen geen feedback. Daarom een gainNode op 0 ertussen.
    const sink = this.context.createGain();
    sink.gain.value = 0;
    this.processor.connect(sink);
    sink.connect(this.context.destination);
  }

  stop(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.processor = null;
    this.source = null;
    if (this.context && this.context.state !== 'closed') {
      this.context.close().catch(() => undefined);
    }
    this.context = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.buffer = [];
    this.bufferLength = 0;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.stream?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    // Bij muten zakt de meter direct naar nul; er komen geen chunks meer.
    if (muted) this.options.onLevel?.(0);
  }

  private handleAudio(event: AudioProcessingEvent): void {
    if (this.muted || !this.context) return;
    const channel = event.inputBuffer.getChannelData(0);
    const downsampled = downsampleTo16k(channel, this.context.sampleRate);
    if (downsampled.length === 0) return;
    this.buffer.push(downsampled);
    this.bufferLength += downsampled.length;
    while (this.bufferLength >= this.chunkTarget) {
      this.flushChunk();
    }
  }

  private flushChunk(): void {
    const merged = new Float32Array(this.chunkTarget);
    let written = 0;
    while (written < this.chunkTarget && this.buffer.length > 0) {
      const head = this.buffer[0];
      const need = this.chunkTarget - written;
      if (head.length <= need) {
        merged.set(head, written);
        written += head.length;
        this.buffer.shift();
      } else {
        merged.set(head.subarray(0, need), written);
        this.buffer[0] = head.subarray(need);
        written += need;
      }
    }
    this.bufferLength -= written;
    const pcm = floatsToInt16(merged);
    // Send-pipeline eerst, exact ongewijzigd. Daarna pas het niveau melden.
    this.options.onChunk(pcm);
    this.options.onLevel?.(rmsFromInt16(pcm));
  }
}

/**
 * Genormaliseerd RMS-niveau (0..1) uit 16-bit PCM. Spraak haalt zelden 1.0,
 * dus we schalen wat op zodat de meter prettig uitslaat zonder te clippen.
 */
function rmsFromInt16(pcm: Int16Array): number {
  if (pcm.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < pcm.length; i += 1) {
    const sample = pcm[i] / 0x8000;
    sum += sample * sample;
  }
  const rms = Math.sqrt(sum / pcm.length);
  return Math.min(1, rms * 4);
}
