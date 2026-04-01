// audit/AuditPanel.tsx — Full system health panel for Analytics
// 5 sections: pipeline funnel, below floor, orphans, stale, modules

import { useFullAudit } from '@/hooks/useAudit';
import { GENESIS_STAGES, MODULES } from '@/types/item';
import { STAGE_COLORS, MODULE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { StageBadge } from '@/components/atoms/StageBadge';
import { ListSkeleton } from '@/components/shared/Skeleton';

const GREEN = { bg: '#EAF3DE', text: '#3B6D11' };
const AMBER = { bg: '#FAEEDA', text: '#854F0B' };
const RED   = { bg: '#FAECE7', text: '#A32D2D' };

export function AuditPanel() {
  const { data: audit, isLoading, isError } = useFullAudit();

  if (isLoading) return <ListSkeleton count={5} />;

  if (isError || !audit) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl text-text-muted/40 mb-3">!</div>
        <p className="text-sm text-text-muted">nao foi possivel carregar audit</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PipelineFunnel byStage={audit.items_by_stage} />
      <BelowFloorSection items={audit.below_floor} />
      <OrphansSection items={audit.orphans} />
      <StaleSection items={audit.stale} />
      <ModulesOverview byModule={audit.items_by_module} />
    </div>
  );
}

// ─── Pipeline Funnel ──────────────────────────────────

function PipelineFunnel({ byStage }: { byStage: Record<number, number> }) {
  const max = Math.max(...Object.values(byStage), 1);

  return (
    <section>
      <SectionLabel>pipeline funnel</SectionLabel>
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {GENESIS_STAGES.map((s) => {
          const count = byStage[s.stage] ?? 0;
          const pct = (count / max) * 100;
          return (
            <div key={s.stage} className="flex items-center gap-2.5">
              <span
                className="w-4 text-xs text-center font-mono"
                style={{ color: STAGE_COLORS[s.stage] }}
              >
                {STAGE_GEOMETRIES[s.stage]}
              </span>
              <span className="w-[72px] text-[11px] text-text-muted truncate">{s.label}</span>
              <div className="flex-1 h-2 rounded-sm bg-surface overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${pct}%`, background: STAGE_COLORS[s.stage] }}
                />
              </div>
              <span className="text-xs text-text-muted w-6 text-right font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Below Floor ──────────────────────────────────────

function BelowFloorSection({ items }: { items: { id: string; title: string; type: string; genesis_stage: number; required_floor: number }[] }) {
  return (
    <section>
      <SectionLabel count={items.length} warn={items.length > 0}>abaixo do piso</SectionLabel>
      {items.length === 0 ? (
        <StatusBanner status="green" text="todos os items respeitam o piso" />
      ) : (
        <div className="bg-card border border-border rounded-xl p-3 space-y-0.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 py-2 border-b border-surface last:border-0">
              <span className="text-[13px] flex-1 truncate">{item.title}</span>
              <TypePill type={item.type} />
              <div className="flex items-center gap-1 text-[11px] text-text-muted shrink-0">
                <StageBadge stage={item.genesis_stage} />
                <span>→</span>
                <StageBadge stage={item.required_floor} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Orphans ──────────────────────────────────────────

function OrphansSection({ items }: { items: { id: string; title: string; type: string; state: string }[] }) {
  return (
    <section>
      <SectionLabel count={items.length} warn={items.length > 0}>orfaos</SectionLabel>
      {items.length === 0 ? (
        <StatusBanner status="green" text="sem orfaos" />
      ) : (
        <div className="bg-card border border-border rounded-xl p-3 space-y-0.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 py-2 border-b border-surface last:border-0">
              <span className="text-[13px] flex-1 truncate">{item.title}</span>
              <TypePill type={item.type} />
              <span className="text-[10px] text-text-muted">{item.state}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Stale ────────────────────────────────────────────

function StaleSection({ items }: { items: { id: string; title: string; created_at: string; days_in_inbox: number }[] }) {
  return (
    <section>
      <SectionLabel count={items.length} warn={items.length > 0}>inbox stale</SectionLabel>
      {items.length === 0 ? (
        <StatusBanner status="green" text="inbox limpo" />
      ) : (
        <div className="bg-card border border-border rounded-xl p-3 space-y-0.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 py-2 border-b border-surface last:border-0">
              <span className="text-[13px] flex-1 truncate">{item.title}</span>
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-lg shrink-0"
                style={{ background: RED.bg, color: RED.text }}
              >
                {item.days_in_inbox}d
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Modules Overview ─────────────────────────────────

function ModulesOverview({ byModule }: { byModule: Record<string, number> }) {
  const max = Math.max(...Object.values(byModule), 1);

  return (
    <section>
      <SectionLabel>por modulo</SectionLabel>
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {MODULES.map((m) => {
          const count = byModule[m.key] ?? 0;
          const pct = (count / max) * 100;
          return (
            <div key={m.key} className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: MODULE_COLORS[m.key] }}
              />
              <span className="w-14 text-[11px] text-text-muted truncate">{m.key}</span>
              <div className="flex-1 h-[6px] rounded-sm bg-surface overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${pct}%`, background: MODULE_COLORS[m.key] }}
                />
              </div>
              <span className="text-xs text-text-muted w-6 text-right font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Shared helpers ───────────────────────────────────

function SectionLabel({ children, count, warn }: { children: React.ReactNode; count?: number; warn?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[11px] font-medium tracking-wider uppercase text-text-muted">{children}</span>
      {count !== undefined && count > 0 && (
        <span
          className="text-[10px] font-medium px-1.5 py-px rounded-lg"
          style={{ background: warn ? AMBER.bg : GREEN.bg, color: warn ? AMBER.text : GREEN.text }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function StatusBanner({ status, text }: { status: 'green' | 'amber' | 'red'; text: string }) {
  const colors = status === 'green' ? GREEN : status === 'amber' ? AMBER : RED;
  const icon = status === 'green' ? '✓' : '!';
  return (
    <div
      className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl text-[12px] font-medium"
      style={{ background: colors.bg, color: colors.text }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function TypePill({ type }: { type: string }) {
  return (
    <span className="text-[9px] font-medium px-1.5 py-px rounded-lg bg-surface text-text-muted shrink-0">
      {type}
    </span>
  );
}
