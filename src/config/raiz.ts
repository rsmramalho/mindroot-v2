// config/raiz.ts — 9 Raiz domains + prompts
// Used in onboarding (Raiz inventory) and Raiz dashboard.

import type { AtomModule } from '@/types/item';

export interface RaizDomain {
  key: string;
  label: string;
  module: AtomModule;
  prompt: string;
  examples: string[];
}

export const RAIZ_DOMAINS: RaizDomain[] = [
  {
    key: 'carreira',
    label: 'Carreira',
    module: 'work',
    prompt: 'O que voce quer construir profissionalmente?',
    examples: ['Mudar de area', 'Conseguir promocao', 'Comecar negocio proprio'],
  },
  {
    key: 'projetos',
    label: 'Projetos',
    module: 'work',
    prompt: 'Quais projetos estao na sua cabeca?',
    examples: ['App pessoal', 'Reformar a casa', 'Curso online'],
  },
  {
    key: 'saude',
    label: 'Saude',
    module: 'body',
    prompt: 'Como esta seu corpo e sua energia?',
    examples: ['Voltar a treinar', 'Melhorar sono', 'Cuidar da alimentacao'],
  },
  {
    key: 'mente',
    label: 'Mente',
    module: 'mind',
    prompt: 'O que voce quer aprender ou entender melhor?',
    examples: ['Ler mais', 'Estudar filosofia', 'Meditar regularmente'],
  },
  {
    key: 'relacoes',
    label: 'Relacoes',
    module: 'family',
    prompt: 'Como estao suas relacoes mais importantes?',
    examples: ['Mais tempo com familia', 'Reconectar com amigos', 'Resolver conflito'],
  },
  {
    key: 'financas',
    label: 'Financas',
    module: 'finance',
    prompt: 'Qual a sua relacao com dinheiro agora?',
    examples: ['Montar reserva', 'Quitar divida', 'Investir melhor'],
  },
  {
    key: 'proposito',
    label: 'Proposito',
    module: 'purpose',
    prompt: 'O que da sentido pra voce?',
    examples: ['Contribuir com comunidade', 'Encontrar vocacao', 'Criar algo duradouro'],
  },
  {
    key: 'social',
    label: 'Social',
    module: 'social',
    prompt: 'Como voce se conecta com o mundo?',
    examples: ['Participar de grupos', 'Fazer networking', 'Voluntariado'],
  },
  {
    key: 'ponte',
    label: 'Ponte',
    module: 'bridge',
    prompt: 'O que conecta as diferentes areas da sua vida?',
    examples: ['Rotina matinal', 'Planejamento semanal', 'Ritual de encerramento'],
  },
];

export const RAIZ_ENTRY_MODES = [
  { key: 'micro', label: 'Rapido', description: '3 dominios, 1 item cada', domains: 3 },
  { key: 'padrao', label: 'Padrao', description: '6 dominios, 2-3 items cada', domains: 6 },
  { key: 'deep', label: 'Profundo', description: 'Todos os 9 dominios', domains: 9 },
] as const;

export type RaizEntryMode = (typeof RAIZ_ENTRY_MODES)[number]['key'];
