// features/raiz/builder-store.ts — Zustand store for Routine Builder

import { create } from 'zustand';
import type { AtomModule } from '@/types/item';
import type { BuilderAnswer, BuilderGeneratedItem } from './builder-types';
import { BUILDER_MODULE_MAP, BUILDER_QUESTION_MAP } from './builder-questions';
import { generateItems } from './builder-mapper';

interface BuilderState {
  activeModule: AtomModule | null;
  currentQuestionId: string | null;
  answers: BuilderAnswer[];
  generatedItems: BuilderGeneratedItem[];
  completedModules: AtomModule[];
  mindmateMode: boolean;

  startModule: (module: AtomModule) => void;
  answerQuestion: (questionId: string, value: string | boolean) => void;
  goBack: () => void;
  completeModule: () => void;
  checkMindmateTrigger: (text: string) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  activeModule: null,
  currentQuestionId: null,
  answers: [],
  generatedItems: [],
  completedModules: [],
  mindmateMode: false,

  startModule: (module) => {
    const mod = BUILDER_MODULE_MAP[module];
    if (!mod || mod.questions.length === 0) return;
    set({
      activeModule: module,
      currentQuestionId: mod.questions[0].id,
    });
  },

  answerQuestion: (questionId, value) => {
    const { answers, activeModule } = get();
    const question = BUILDER_QUESTION_MAP[questionId];
    if (!question) return;

    const newAnswers = [...answers, { questionId, value }];

    // Determine next question
    let nextId: string | null | undefined;
    if (question.branchOn) {
      const key = typeof value === 'boolean' ? String(value) : value;
      nextId = question.branchOn[key] ?? question.nextQuestionId;
    } else {
      nextId = question.nextQuestionId;
    }

    if (nextId && BUILDER_QUESTION_MAP[nextId]) {
      set({ answers: newAnswers, currentQuestionId: nextId });
    } else {
      // Module complete — generate items
      if (activeModule) {
        const newItems = generateItems(newAnswers.filter(a => {
          const q = BUILDER_QUESTION_MAP[a.questionId];
          return q?.module === activeModule;
        }), activeModule);

        set((s) => ({
          answers: newAnswers,
          activeModule: null,
          currentQuestionId: null,
          generatedItems: [...s.generatedItems, ...newItems],
          completedModules: [...s.completedModules, activeModule],
        }));
      }
    }
  },

  goBack: () => {
    const { answers, activeModule } = get();
    if (answers.length === 0 || !activeModule) return;

    const moduleAnswers = answers.filter(a => {
      const q = BUILDER_QUESTION_MAP[a.questionId];
      return q?.module === activeModule;
    });

    if (moduleAnswers.length === 0) {
      set({ activeModule: null, currentQuestionId: null });
      return;
    }

    const lastAnswer = moduleAnswers[moduleAnswers.length - 1];
    const newAnswers = answers.filter(a => a !== lastAnswer);
    set({
      answers: newAnswers,
      currentQuestionId: lastAnswer.questionId,
    });
  },

  completeModule: () => {
    set({ activeModule: null, currentQuestionId: null });
  },

  checkMindmateTrigger: (text) => {
    if (text.toLowerCase().includes('mindmate')) {
      set({ mindmateMode: true });
    }
  },

  reset: () => set({
    activeModule: null,
    currentQuestionId: null,
    answers: [],
    generatedItems: [],
    completedModules: [],
    mindmateMode: false,
  }),
}));
