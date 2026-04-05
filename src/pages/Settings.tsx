// pages/Settings.tsx — Profile, rituals, modules, theme, export
// Wireframe: mindroot-wireframe-settings.html

import { useAppStore } from '@/store/app-store';
import { useNav } from '@/hooks/useNav';
import { useItems } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useConnectors } from '@/hooks/useConnectors';
import { MODULES } from '@/types/item';
import { RITUAL_PERIODS } from '@/types/ui';
import { exportService } from '@/service/export-service';
import { toast } from '@/store/toast-store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const { navigate } = useNav();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const { items } = useItems();
  const { signOut } = useAuth();
  const { getStatus, syncCalendar, syncGmail, disconnect, syncState } = useConnectors();
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  const email = user?.email ?? '';
  const name = user?.user_metadata?.full_name ?? email.split('@')[0];

  const handleExportJSON = async () => {
    await exportService.exportAsJSON(items);
    toast.success('Backup JSON baixado');
  };

  const handleExportObsidian = async () => {
    await exportService.exportBatchObsidian(items, items);
    toast.success('Vault Obsidian baixado');
  };

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4 flex items-center justify-between">
        <h1 className="text-[24px] font-medium tracking-tight">settings</h1>
        <button onClick={() => navigate('home')} className="text-xs text-accent">fechar</button>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-[14px] p-4 mb-4">
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

      {/* Theme */}
      <SectionLabel>aparencia</SectionLabel>
      <div className="bg-card border border-border rounded-[14px] overflow-hidden mb-4">
        {(['system', 'light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`w-full flex items-center justify-between px-4 py-3 border-b border-surface last:border-0 ${
              theme === t ? 'text-accent font-medium' : 'text-text'
            }`}
          >
            <span className="text-[13px]">
              {t === 'system' ? 'Sistema' : t === 'light' ? 'Claro' : 'Escuro'}
            </span>
            {theme === t && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>

      {/* Ritual times */}
      <SectionLabel>rituais</SectionLabel>
      <div className="bg-card border border-border rounded-[14px] overflow-hidden mb-4">
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
      <div className="bg-card border border-border rounded-[14px] overflow-hidden mb-4">
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

      {/* Export */}
      <SectionLabel>exportar</SectionLabel>
      <div className="bg-card border border-border rounded-[14px] overflow-hidden mb-4">
        <ExportRow label="Backup JSON" description="todos os items como JSON" onClick={handleExportJSON} />
        <ExportRow label="Obsidian vault" description="todos os items como .md" onClick={handleExportObsidian} />
      </div>

      {/* Connectors */}
      <SectionLabel>conectores</SectionLabel>
      <div className="bg-card border border-border rounded-[14px] overflow-hidden mb-4">
        {!isGoogleUser && (
          <div className="px-4 py-3 text-[12px] text-text-muted border-b border-surface">
            Faca login com Google para conectar Calendar e Gmail
          </div>
        )}
        <ConnectorRow
          icon="cal"
          name="Google Calendar"
          status={getStatus('google')}
          syncing={syncState === 'syncing'}
          onSync={isGoogleUser ? syncCalendar : undefined}
          onDisconnect={isGoogleUser ? () => disconnect('google') : undefined}
        />
        <ConnectorRow
          icon="mail"
          name="Gmail"
          status={getStatus('google')}
          syncing={syncState === 'syncing'}
          onSync={isGoogleUser ? syncGmail : undefined}
          onDisconnect={isGoogleUser ? () => disconnect('google') : undefined}
        />
        <ConnectorRow
          icon="drive"
          name="Google Drive"
          comingSoon
        />
      </div>

      {/* About */}
      <SectionLabel>sobre</SectionLabel>
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <div className="text-sm font-medium mb-0.5">MindRoot v2</div>
        <div className="text-xs text-text-muted">Genesis v5.0.1 · PHI spiral</div>
      </div>

      {/* Logout */}
      <div className="mt-8 mb-4">
        <button
          onClick={() => signOut()}
          className="w-full py-3 text-center text-sm text-error border border-error/20 rounded-xl hover:bg-error/5 transition-colors"
        >
          sair da conta
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-2">{children}</div>;
}

function ExportRow({ label, description, onClick }: { label: string; description: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3 border-b border-surface last:border-0 text-left">
      <div>
        <div className="text-[13px]">{label}</div>
        <div className="text-[11px] text-text-muted">{description}</div>
      </div>
      <span className="text-xs text-accent">↓</span>
    </button>
  );
}

function ConnectorRow({
  icon, name, status, syncing, comingSoon,
  onSync, onDisconnect,
}: {
  icon: string;
  name: string;
  status?: { provider: string; status: string; lastSyncAt: string | null; metadata: Record<string, unknown> };
  syncing?: boolean;
  comingSoon?: boolean;
  onSync?: () => void;
  onDisconnect?: () => void;
}) {
  const isConnected = status?.status === 'connected';
  const lastSync = status?.lastSyncAt
    ? formatDistanceToNow(parseISO(status.lastSyncAt), { addSuffix: true, locale: ptBR })
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-surface last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-lg">{icon}</span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium">{name}</div>
          {comingSoon ? (
            <div className="text-[11px] text-text-muted">em breve</div>
          ) : isConnected ? (
            <div className="text-[11px] text-success">
              conectado{lastSync ? ` · sync ${lastSync}` : ''}
            </div>
          ) : (
            <div className="text-[11px] text-text-muted">desconectado</div>
          )}
        </div>
      </div>
      {!comingSoon && (
        <div className="flex items-center gap-2">
          {isConnected && onSync && (
            <button
              onClick={onSync}
              disabled={syncing}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-accent-bg text-accent disabled:opacity-50"
            >
              {syncing ? 'sincronizando...' : 'sincronizar'}
            </button>
          )}
          {isConnected && onDisconnect && (
            <button onClick={onDisconnect} className="text-[11px] text-error">
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
