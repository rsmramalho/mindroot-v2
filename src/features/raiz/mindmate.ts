// features/raiz/mindmate.ts — MindMate easter egg
// Triggered when user types "mindmate" in any freetext input.

import type { AtomModule } from '@/types/item';

export const MINDMATE_ACTIVATION = {
  trigger: 'mindmate',
  badge: '✦ mindmate',
};

export function detectsMindmateTrigger(text: string): boolean {
  return text.toLowerCase().includes(MINDMATE_ACTIVATION.trigger);
}

interface MindmateQuote {
  text: string;
  author: string;
}

const QUOTES: Record<string, MindmateQuote[]> = {
  body: [
    { text: 'O corpo e a unica casa que voce nunca vai sair.', author: 'Jim Rohn' },
    { text: 'Cuide do seu corpo. E o unico lugar que voce tem pra viver.', author: 'Jim Rohn' },
  ],
  mind: [
    { text: 'A mente que se abre a uma nova ideia jamais volta ao tamanho original.', author: 'Einstein' },
    { text: 'Ler e sonhar de olhos abertos.', author: 'Borges' },
  ],
  family: [
    { text: 'O tempo que voce nao passa com quem ama, voce nao recupera.', author: 'anon' },
  ],
  work: [
    { text: 'Foco nao e dizer sim ao importante. E dizer nao a tudo mais.', author: 'Steve Jobs' },
  ],
  finance: [
    { text: 'Riqueza nao e ter muito. E precisar de pouco.', author: 'anon' },
  ],
};

export function getMindmateQuote(module: AtomModule): MindmateQuote | null {
  const pool = QUOTES[module];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const MINDMATE_SUBTEXT_OVERRIDES: Record<string, string> = {
  'body-6': 'mindmate mode: o que seu corpo precisa que voce nao esta dando?',
  'mind-6': 'mindmate mode: o que voce aprenderia se nao tivesse medo?',
  'work-6': 'mindmate mode: o que voce evita enfrentar no trabalho?',
};
