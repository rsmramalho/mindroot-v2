import { describe, it, expect, beforeEach } from 'vitest';
import { useSoulStore } from '@/store/soul-store';

describe('AGENTE LOGICA — soul-store', () => {
  beforeEach(() => useSoulStore.getState().reset());

  it('setAurora registra emotion + energy + intention', () => {
    useSoulStore.getState().setAurora('ansioso', 'high', 'fechar a spec');
    const s = useSoulStore.getState();
    expect(s.auroraCheckedToday).toBe(true);
    expect(s.emotion).toBe('ansioso');
    expect(s.energy).toBe('high');
    expect(s.intention).toBe('fechar a spec');
  });

  it('skipAurora marca como checked sem dados', () => {
    useSoulStore.getState().skipAurora();
    const s = useSoulStore.getState();
    expect(s.auroraCheckedToday).toBe(true);
    expect(s.emotion).toBeNull();
  });

  it('reset limpa tudo', () => {
    useSoulStore.getState().setAurora('calmo', 'medium', 'dia leve');
    useSoulStore.getState().reset();
    expect(useSoulStore.getState().auroraCheckedToday).toBe(false);
  });
});
