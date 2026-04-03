// features/raiz/builder-questions.ts — 5 modules, ~35 questions with branching

import type { BuilderModuleConfig, BuilderQuestion } from './builder-types';
import type { AtomModule } from '@/types/item';

// ─── Module definitions ─────────────────────────────────

export const BUILDER_MODULES: BuilderModuleConfig[] = [
  {
    id: 'body',
    label: 'Corpo',
    description: 'Movimento, sono, alimentacao',
    icon: '💪',
    questions: [],
  },
  {
    id: 'mind',
    label: 'Mente',
    description: 'Leitura, aprendizado, foco',
    icon: '🧠',
    questions: [],
  },
  {
    id: 'family',
    label: 'Familia',
    description: 'Tempo junto, rituais, presenca',
    icon: '🏡',
    questions: [],
  },
  {
    id: 'work',
    label: 'Trabalho',
    description: 'Projetos, foco, entregas',
    icon: '⚡',
    questions: [],
  },
  {
    id: 'finance',
    label: 'Financas',
    description: 'Controle, investimentos, metas',
    icon: '💰',
    questions: [],
  },
];

// ─── Questions ─────────────────────────────────────────

const BODY_QUESTIONS: BuilderQuestion[] = [
  { id: 'body-1', module: 'body', text: 'Voce faz exercicio fisico?', inputType: 'yesno', branchOn: { 'true': 'body-2', 'false': 'body-4' } },
  { id: 'body-2', module: 'body', text: 'Que tipo de exercicio?', subtext: 'Pode ser qualquer coisa — caminhada, academia, yoga, natacao...', inputType: 'freetext', nextQuestionId: 'body-3' },
  { id: 'body-3', module: 'body', text: 'Quantas vezes por semana?', inputType: 'frequency', nextQuestionId: 'body-4' },
  { id: 'body-4', module: 'body', text: 'Que horas voce acorda e dorme?', subtext: 'Nao precisa ser exato — uma media.', inputType: 'time', nextQuestionId: 'body-5' },
  { id: 'body-5', module: 'body', text: 'Toma agua de manha como primeira coisa?', inputType: 'yesno', nextQuestionId: 'body-6' },
  { id: 'body-6', module: 'body', text: 'Tem algum habito de saude que quer manter?', subtext: 'Medicacao, suplemento, alongamento, meditacao...', inputType: 'freetext', nextQuestionId: null },
];

const MIND_QUESTIONS: BuilderQuestion[] = [
  { id: 'mind-1', module: 'mind', text: 'Voce le com regularidade?', inputType: 'yesno', branchOn: { 'true': 'mind-2', 'false': 'mind-3' } },
  { id: 'mind-2', module: 'mind', text: 'O que esta lendo agora?', inputType: 'freetext', nextQuestionId: 'mind-3' },
  { id: 'mind-3', module: 'mind', text: 'Tem algum habito de aprendizado?', subtext: 'Podcast, curso, idioma, pratica de algo...', inputType: 'freetext', nextQuestionId: 'mind-4' },
  { id: 'mind-4', module: 'mind', text: 'Voce escreve ou reflete sobre o dia?', inputType: 'yesno', branchOn: { 'true': 'mind-5', 'false': 'mind-6' } },
  { id: 'mind-5', module: 'mind', text: 'Quando prefere refletir?', inputType: 'choice', choices: [
    { value: 'aurora', label: 'De manha (aurora)' },
    { value: 'crepusculo', label: 'De noite (crepusculo)' },
    { value: 'both', label: 'Manha e noite' },
  ], nextQuestionId: 'mind-6' },
  { id: 'mind-6', module: 'mind', text: 'Algo que quer aprender esse ano?', inputType: 'freetext', nextQuestionId: null },
];

const FAMILY_QUESTIONS: BuilderQuestion[] = [
  { id: 'family-1', module: 'family', text: 'Mora com alguem?', inputType: 'yesno', branchOn: { 'true': 'family-2', 'false': 'family-4' } },
  { id: 'family-2', module: 'family', text: 'Com quem voce mora?', inputType: 'freetext', nextQuestionId: 'family-3' },
  { id: 'family-3', module: 'family', text: 'Tem algum ritual em familia?', subtext: 'Jantar junto, passeio de domingo, game night...', inputType: 'freetext', nextQuestionId: 'family-4' },
  { id: 'family-4', module: 'family', text: 'Tem alguem que voce quer falar com mais frequencia?', inputType: 'freetext', nextQuestionId: 'family-5' },
  { id: 'family-5', module: 'family', text: 'Quantas vezes por semana dedica tempo pra familia?', inputType: 'frequency', nextQuestionId: null },
];

const WORK_QUESTIONS: BuilderQuestion[] = [
  { id: 'work-1', module: 'work', text: 'Qual o seu projeto principal agora?', inputType: 'freetext', nextQuestionId: 'work-2' },
  { id: 'work-2', module: 'work', text: 'Voce tem bloco de foco no dia?', subtext: 'Periodo sem interrupcoes pra trabalho profundo.', inputType: 'yesno', branchOn: { 'true': 'work-3', 'false': 'work-4' } },
  { id: 'work-3', module: 'work', text: 'Quando e o seu bloco de foco?', inputType: 'choice', choices: [
    { value: 'aurora', label: 'Manha (aurora)' },
    { value: 'zenite', label: 'Tarde (zenite)' },
    { value: 'crepusculo', label: 'Noite (crepusculo)' },
  ], nextQuestionId: 'work-4' },
  { id: 'work-4', module: 'work', text: 'Tem reunioes recorrentes?', inputType: 'yesno', branchOn: { 'true': 'work-5', 'false': 'work-6' } },
  { id: 'work-5', module: 'work', text: 'Quais reunioes?', subtext: 'Ex: standup diaria, planning semanal...', inputType: 'freetext', nextQuestionId: 'work-6' },
  { id: 'work-6', module: 'work', text: 'O que te trava no trabalho?', subtext: 'Nao precisa ter resposta — so despejar.', inputType: 'freetext', nextQuestionId: null },
];

const FINANCE_QUESTIONS: BuilderQuestion[] = [
  { id: 'finance-1', module: 'finance', text: 'Voce acompanha seus gastos?', inputType: 'yesno', branchOn: { 'true': 'finance-2', 'false': 'finance-3' } },
  { id: 'finance-2', module: 'finance', text: 'Como acompanha?', inputType: 'choice', choices: [
    { value: 'app', label: 'App ou planilha' },
    { value: 'bank', label: 'Pelo banco mesmo' },
    { value: 'head', label: 'De cabeca' },
  ], nextQuestionId: 'finance-3' },
  { id: 'finance-3', module: 'finance', text: 'Tem uma meta financeira esse ano?', inputType: 'freetext', nextQuestionId: 'finance-4' },
  { id: 'finance-4', module: 'finance', text: 'Faz review financeiro com que frequencia?', inputType: 'choice', choices: [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'rarely', label: 'Quase nunca' },
    { value: 'never', label: 'Nunca fiz' },
  ], nextQuestionId: null },
];

// Attach questions to modules
BUILDER_MODULES[0].questions = BODY_QUESTIONS;
BUILDER_MODULES[1].questions = MIND_QUESTIONS;
BUILDER_MODULES[2].questions = FAMILY_QUESTIONS;
BUILDER_MODULES[3].questions = WORK_QUESTIONS;
BUILDER_MODULES[4].questions = FINANCE_QUESTIONS;

// ─── Lookup maps ─────────────────────────────────────────

const ALL_QUESTIONS = [...BODY_QUESTIONS, ...MIND_QUESTIONS, ...FAMILY_QUESTIONS, ...WORK_QUESTIONS, ...FINANCE_QUESTIONS];

export const BUILDER_QUESTION_MAP: Record<string, BuilderQuestion> = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q]),
);

export const BUILDER_MODULE_MAP: Record<AtomModule, BuilderModuleConfig> = Object.fromEntries(
  BUILDER_MODULES.map((m) => [m.id, m]),
) as Record<AtomModule, BuilderModuleConfig>;
