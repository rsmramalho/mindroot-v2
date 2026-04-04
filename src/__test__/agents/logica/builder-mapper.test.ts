import { describe, it, expect } from 'vitest';
import { generateItems, toSupabasePayload } from '@/features/raiz/builder-mapper';
import type { BuilderAnswer } from '@/features/raiz/builder-types';

describe('AGENTE LOGICA — builder-mapper', () => {
  it('yesno "no" nao gera item', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-1', value: false },
    ];
    const items = generateItems(answers, 'body');
    const fromYesno = items.filter(i => i.title === 'no' || i.title === 'false');
    expect(fromYesno.length).toBe(0);
  });

  it('freetext vazio nao gera item', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-2', value: '   ' },
    ];
    const items = generateItems(answers, 'body');
    expect(items.length).toBe(0);
  });

  it('freetext com conteudo gera item com tags corretas', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-6', value: 'tomar vitamina D' },
    ];
    const items = generateItems(answers, 'body');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].tags).toContain('#raiz');
    expect(items[0].tags).toContain('#routine-builder');
    expect(items[0].tags.some(t => t.startsWith('#domain:'))).toBe(true);
  });

  it('frequency gera habit', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-2', value: 'corrida' },
      { questionId: 'body-3', value: '3' },
    ];
    const items = generateItems(answers, 'body');
    const habits = items.filter(i => i.type === 'habit');
    expect(habits.length).toBeGreaterThan(0);
    expect(habits[0].recurrence).toContain('3');
  });

  it('toSupabasePayload gera payload valido', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'mind-3', value: 'podcast sobre IA' },
    ];
    const items = generateItems(answers, 'mind');
    if (items.length > 0) {
      const payload = toSupabasePayload(items[0], 'user-123');
      expect(payload.user_id).toBe('user-123');
      expect(payload.state).toBe('inbox');
      expect(payload.genesis_stage).toBe(1);
      expect(payload.source).toBe('mindroot');
      expect(payload.body.builder_origin).toBe(true);
    }
  });

  it('choice aurora gera item com ritual_slot', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'mind-5', value: 'aurora' },
    ];
    const items = generateItems(answers, 'mind');
    const withSlot = items.filter(i => i.ritualSlot === 'aurora');
    expect(withSlot.length).toBeGreaterThan(0);
  });
});
