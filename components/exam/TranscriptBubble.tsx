/**
 * Enkele transcript-bubble. Bot links, paarse achtergrond met witte tekst.
 * Docent rechts, lichtpaarse achtergrond met donkere tekst.
 */

export interface TranscriptBubbleProps {
  speaker: 'bot' | 'docent';
  text: string;
  finished: boolean;
}

export function TranscriptBubble({ speaker, text, finished }: TranscriptBubbleProps) {
  const isBot = speaker === 'bot';
  const wrapperAlign = isBot ? 'justify-start' : 'justify-end';
  const bubbleClass = isBot
    ? 'bg-purple-primary text-white rounded-2xl rounded-bl-sm'
    : 'bg-purple-light-bg text-text-body rounded-2xl rounded-br-sm border border-purple-primary/15';

  return (
    <div className={`flex ${wrapperAlign}`}>
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleClass}`}
        aria-live={finished ? 'polite' : 'off'}
      >
        <span className="block whitespace-pre-wrap">{text}</span>
        {finished ? null : <span className="ml-1 inline-block animate-pulse">.</span>}
      </div>
    </div>
  );
}
