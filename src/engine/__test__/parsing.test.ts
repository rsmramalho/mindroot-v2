import { describe, it, expect } from 'vitest';
import { parseInput } from '../parsing';

describe('parseInput', () => {
  it('extracts module token', () => {
    const result = parseInput('buy groceries #mod_body');
    expect(result.module).toBe('body');
    expect(result.title).toBe('buy groceries');
  });

  it('extracts priority token', () => {
    const result = parseInput('urgent task #prio_high');
    expect(result.priority).toBe('high');
  });

  it('extracts type token', () => {
    const result = parseInput('my reflection #type_reflection');
    expect(result.type).toBe('reflection');
    expect(result.title).toBe('my reflection');
  });

  it('extracts emotion tokens', () => {
    const result = parseInput('feeling good #emo_calmo');
    expect(result.emotion_before).toBe('calmo');
  });

  it('extracts post-emotion token', () => {
    const result = parseInput('after session #emob_grato');
    expect(result.emotion_after).toBe('grato');
  });

  it('detects @hoje as today due date', () => {
    const result = parseInput('do laundry @hoje');
    expect(result.due_date).not.toBeNull();
    expect(result.title).toBe('do laundry');
  });

  it('detects @amanha as tomorrow due date', () => {
    const result = parseInput('meeting @amanha');
    expect(result.due_date).not.toBeNull();
  });

  it('cleans title by removing all tokens', () => {
    const result = parseInput('buy milk #mod_body #prio_low @hoje');
    expect(result.title).toBe('buy milk');
    expect(result.module).toBe('body');
    expect(result.priority).toBe('low');
    expect(result.due_date).not.toBeNull();
  });

  it('handles input with no tokens', () => {
    const result = parseInput('just a plain note');
    expect(result.title).toBe('just a plain note');
    expect(result.module).toBeNull();
    expect(result.priority).toBeNull();
    expect(result.tokens).toHaveLength(0);
  });

  it('extracts energy token', () => {
    const result = parseInput('workout #energy_high');
    expect(result.energy_cost).toBe(1); // high = index 0 + 1 = 1
  });

  it('preserves non-system tags', () => {
    const result = parseInput('study react #frontend #mod_work');
    expect(result.tags).toContain('frontend');
    expect(result.module).toBe('work');
  });

  it('detects chore token', () => {
    const result = parseInput('clean desk #chore');
    expect(result.is_chore).toBe(true);
    expect(result.needs_checkin).toBe(true);
    expect(result.tags).toContain('chore');
  });

  it('preserves original input as context', () => {
    const raw = 'hello #mod_mind @hoje';
    const result = parseInput(raw);
    expect(result.context).toBe(raw);
  });
});
