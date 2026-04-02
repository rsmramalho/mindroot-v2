// pages/Settings.tsx — Profile, rituals, modules, integrations
// Wireframe: mindroot-wireframe-settings.html

import { useAppStore } from '@/store/app-store';
import { MODULES } from '@/types/item';
import { RITUAL_PERIODS } from '@/types/ui';

export function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const navigate = useAppStore((s) => s.navigate);

  const email = user?.email ?? '';
  const name = user?.user_metadata?.full_name ?? email.split('@')[0];

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">settings</h1>
        <button onClick={() => navigate('home')} className="text-xs text-accent">fechar</button>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-bg flex items-center justify-center text-lg text-accent font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-text-muted">{email}</div>
          </div>
        </div>
      </div>

      {/* Ritual times */}
      <SectionLabel>rituais</SectionLabel>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {RITUAL_PERIODS.map((p) => (
          <div key={p.key} className="flex items-center justify-between px-4 py-3 border-b border-surface last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              <span className="text-[13px]">{p.label}</span>
            </div>
            <span className="text-xs text-text-muted">{p.hours.start}h – {p.hours.end}h</span>
          </div>
        ))}
      </div>

      {/* Modules */}
      <SectionLabel>modulos</SectionLabel>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        {MODULES.map((m) => (
          <div key={m.key} className="flex items-center justify-between px-4 py-3 border-b border-surface last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
              <span className="text-[13px]">{m.label}</span>
            </div>
            <span className="text-xs text-text-muted">{m.key}</span>
          </div>
        ))}
      </div>

      {/* Integrations placeholder */}
      <SectionLabel>integracoes</SectionLabel>
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px]">Google Calendar</span>
          <span className="text-[10px] px-2 py-px rounded-lg bg-surface text-text-muted">em breve</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px]">Google Drive</span>
          <span className="text-[10px] px-2 py-px rounded-lg bg-surface text-text-muted">em breve</span>
        </div>
      </div>

      {/* About */}
      <SectionLabel>sobre</SectionLabel>
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <div className="text-sm font-medium mb-0.5">MindRoot v2</div>
        <div className="text-xs text-text-muted">Genesis v5.0.1 · PHI spiral</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-2">{children}</div>;
}
