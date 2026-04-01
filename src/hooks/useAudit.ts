// hooks/useAudit.ts — Audit data hooks
// Wraps auditService with TanStack Query for caching + refetch.

import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/service/audit-service';
import type { AuditReport } from '@/service/audit-service';

export type { AuditReport };

export type AuditLight = { inbox: number; stale: number; orphans: number };

/** Full audit — Analytics + Wrap */
export function useFullAudit() {
  return useQuery<AuditReport>({
    queryKey: ['audit', 'full'],
    queryFn: () => auditService.getFullReport(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

/** Light audit — Home health bar */
export function useLightAudit() {
  return useQuery<AuditLight>({
    queryKey: ['audit', 'light'],
    queryFn: () => auditService.getLightAudit(),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
