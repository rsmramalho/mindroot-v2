// hooks/useTriage.ts — AI Triage hook
import { useMutation } from '@tanstack/react-query';
import { triageService } from '@/service/triage-service';
import type { TriageResult } from '@/service/triage-service';

export type { TriageResult };

export function useTriage() {
  const mutation = useMutation<TriageResult, Error, { input: string; context?: string }>({
    mutationFn: ({ input, context }) => triageService.classify(input, context),
  });

  return {
    classify: mutation.mutateAsync,
    result: mutation.data ?? null,
    isClassifying: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
