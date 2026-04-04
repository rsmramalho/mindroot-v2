import { describe, it, expect, beforeEach } from 'vitest';
import { useBuilderStore } from '@/features/raiz/builder-store';

describe('AGENTE LOGICA — builder-store', () => {
  beforeEach(() => {
    useBuilderStore.getState().reset();
  });

  it('startModule define activeModule e primeira pergunta', () => {
    useBuilderStore.getState().startModule('body');
    const state = useBuilderStore.getState();
    expect(state.activeModule).toBe('body');
    expect(state.currentQuestionId).toBe('body-1');
  });

  it('answerQuestion avanca para proxima pergunta', () => {
    useBuilderStore.getState().startModule('body');
    useBuilderStore.getState().answerQuestion('body-1', true);
    expect(useBuilderStore.getState().currentQuestionId).toBe('body-2');
  });

  it('answerQuestion com branch segue branch correto', () => {
    useBuilderStore.getState().startModule('body');
    useBuilderStore.getState().answerQuestion('body-1', false);
    expect(useBuilderStore.getState().currentQuestionId).toBe('body-4');
  });

  it('ultima pergunta completa modulo e gera items', () => {
    const store = useBuilderStore.getState();
    store.startModule('finance');
    store.answerQuestion('finance-1', true);
    store.answerQuestion('finance-2', 'app');
    store.answerQuestion('finance-3', 'guardar 10k');
    store.answerQuestion('finance-4', 'monthly');

    const state = useBuilderStore.getState();
    expect(state.activeModule).toBeNull();
    expect(state.completedModules).toContain('finance');
    expect(state.generatedItems.length).toBeGreaterThan(0);
  });

  it('goBack volta pra pergunta anterior', () => {
    const store = useBuilderStore.getState();
    store.startModule('body');
    store.answerQuestion('body-1', true);
    expect(useBuilderStore.getState().currentQuestionId).toBe('body-2');
    store.goBack();
    expect(useBuilderStore.getState().currentQuestionId).toBe('body-1');
  });

  it('reset limpa tudo', () => {
    const store = useBuilderStore.getState();
    store.startModule('body');
    store.answerQuestion('body-1', true);
    store.reset();
    const state = useBuilderStore.getState();
    expect(state.activeModule).toBeNull();
    expect(state.answers.length).toBe(0);
    expect(state.generatedItems.length).toBe(0);
  });

  it('mindmate trigger ativa modo mindmate', () => {
    useBuilderStore.getState().checkMindmateTrigger('quero usar o mindmate');
    expect(useBuilderStore.getState().mindmateMode).toBe(true);
  });

  it('texto sem mindmate nao ativa', () => {
    useBuilderStore.getState().checkMindmateTrigger('quero fazer exercicio');
    expect(useBuilderStore.getState().mindmateMode).toBe(false);
  });
});
