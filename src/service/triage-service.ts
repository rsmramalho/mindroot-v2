// service/triage-service.ts — AI Triage (calls Supabase edge function)
import { supabase } from './supabase';

export interface TriageResult {
  title: string;
  type: string;
  module: string;
  confidence: number;     // 0-100
  reasoning: string;
  tags: string[];
  due_date: string | null;
  emotion: string | null;
}

const ACTIONABLE_TYPES = new Set(['task', 'project', 'spec', 'habit']);

export function getConfidenceBand(result: TriageResult): 'auto' | 'suggest' | 'manual' {
  const isActionable = ACTIONABLE_TYPES.has(result.type);
  const threshold = isActionable ? 95 : 90;
  if (result.confidence >= threshold) return 'auto';
  if (result.confidence >= 60) return 'suggest';
  return 'manual';
}

export const triageService = {
  async classify(input: string, context?: string): Promise<TriageResult> {
    const { data, error } = await supabase.functions.invoke('triage-classify', {
      body: { input, context },
    });
    if (error) throw error;
    return data as TriageResult;
  },
};
