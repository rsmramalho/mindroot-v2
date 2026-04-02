// config/raiz.ts — 9 Raiz life domains + session doors
// Raiz = the Genesis applied to life. Not just productivity — everything.
// Philosophy: "uma gaveta por vez" — see what exists before changing anything.
// Zero new schema. Existing types + tags #domain:* + #raiz.

import type { AtomModule } from '@/types/item';

export interface RaizDomain {
  key: string;
  label: string;
  emoji: string;
  module: AtomModule;
  prompt: string;
  examples: string[];
}

export const RAIZ_DOMAINS: RaizDomain[] = [
  {
    key: 'identidade',
    label: 'identidade',
    emoji: '🔑',
    module: 'bridge',
    prompt: 'quais contas e logins voce tem?',
    examples: ['email pessoal', 'email do trabalho', 'gmail antigo', 'conta apple', 'login do banco'],
  },
  {
    key: 'documentos',
    label: 'documentos',
    emoji: '📄',
    module: 'bridge',
    prompt: 'onde estao seus documentos importantes?',
    examples: ['passaporte', 'contrato do aluguel', 'certidao', 'receitas medicas', 'diploma'],
  },
  {
    key: 'saude',
    label: 'saude',
    emoji: '❤️',
    module: 'body',
    prompt: 'como esta seu corpo e sua saude agora?',
    examples: ['academia', 'exame pendente', 'remedio que tomo', 'dentista atrasado', 'sono ruim'],
  },
  {
    key: 'financas',
    label: 'financas',
    emoji: '💰',
    module: 'finance',
    prompt: 'onde esta o seu dinheiro?',
    examples: ['conta corrente', 'cartao de credito', 'investimento', 'divida', 'assinatura mensal'],
  },
  {
    key: 'arquivos',
    label: 'arquivos',
    emoji: '☁️',
    module: 'bridge',
    prompt: 'onde voce guarda seus arquivos digitais?',
    examples: ['google drive', 'icloud', 'hd externo', 'dropbox', 'fotos no celular'],
  },
  {
    key: 'memorias',
    label: 'memorias',
    emoji: '📸',
    module: 'family',
    prompt: 'onde estao suas fotos e memorias?',
    examples: ['google photos', 'icloud photos', 'fotos no whatsapp', 'album fisico', 'videos antigos'],
  },
  {
    key: 'tempo',
    label: 'tempo',
    emoji: '📅',
    module: 'bridge',
    prompt: 'como voce organiza seu tempo?',
    examples: ['google calendar', 'agenda fisica', 'alarmes', 'nenhum sistema', 'monday.com'],
  },
  {
    key: 'comunicacao',
    label: 'comunicacao',
    emoji: '💬',
    module: 'social',
    prompt: 'por onde voce se comunica?',
    examples: ['whatsapp', 'email', 'instagram', 'telegram', 'slack', 'linkedin'],
  },
  {
    key: 'projetos',
    label: 'projetos',
    emoji: '🚀',
    module: 'work',
    prompt: 'quais projetos estao na sua cabeca agora?',
    examples: ['projeto do trabalho', 'ideia de negocio', 'reforma', 'curso', 'side project'],
  },
];

// 3 doors for guided sessions — different APPROACHES, not quantities
export interface RaizDoor {
  key: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
  recommended?: boolean;
  domainKeys: string[];
}

export const RAIZ_DOORS: RaizDoor[] = [
  {
    key: 'easy',
    emoji: '✨',
    title: 'o mais facil',
    description: 'comunicacao ou calendario — quick win pra criar momentum.',
    tag: 'pra quem precisa de uma vitoria rapida',
    domainKeys: ['comunicacao', 'tempo', 'projetos'],
  },
  {
    key: 'pain',
    emoji: '🎯',
    title: 'o que mais incomoda',
    description: 'o que tira sono. resolver alivia rapido — e o alivio move o resto.',
    tag: 'pra quem sabe onde doi',
    domainKeys: ['financas', 'saude', 'identidade', 'documentos', 'arquivos'],
  },
  {
    key: 'guide',
    emoji: '○',
    title: 'me guia',
    description: 'identidade primeiro — contas, emails, logins. de dentro pra fora.',
    tag: 'pra quem ta perdido',
    recommended: true,
    domainKeys: ['identidade', 'documentos', 'saude', 'financas', 'arquivos', 'memorias', 'tempo', 'comunicacao', 'projetos'],
  },
];

export type RaizDoorKey = (typeof RAIZ_DOORS)[number]['key'];
