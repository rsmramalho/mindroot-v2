// pages/Projects.tsx — Projects list + detail
// Wireframe: mindroot-wireframe-projects.html
// List: grouped by module, card with progress, next action, stage, connections
// Detail: back button, items list, connections, links

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { usePipeline } from '@/hooks/usePipeline';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import type { AtomItem, AtomModule } from '@/types/item';
import { MODULES } from '@/types/item';
import { MODULE_COLORS, STAGE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';

export function ProjectsPage() {
  const { items } = useItems();
  const { capture } = usePipeline();
  const { classify } = usePipeline();
  const { selectItem } = useNav();
  const user = useAppStore((s) => s.user);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState<AtomModule>('work');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  const projects = useMemo(
    () => items.filter((i) => i.type === 'project' && i.status !== 'archived'),
    [items],
  );

  const projectChildren = useMemo(() => {
    const map: Record<string, AtomItem[]> = {};
    projects.forEach((p) => { map[p.id] = []; });
    items.forEach((i) => {
      if (i.project_id && map[i.project_id]) map[i.project_id].push(i);
    });
    return map;
  }, [items, projects]);

  const connectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((i) => {
      if (i.project_id) counts[i.project_id] = (counts[i.project_id] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) : null;
  const totalItems = projects.reduce((sum, p) => sum + (projectChildren[p.id]?.length ?? 0), 0);
  const activeCount = projects.filter((p) => p.status === 'active').length;

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  const filteredByModule = useMemo(() => {
    const grouped: Record<string, AtomItem[]> = {};
    filteredProjects.forEach((p) => {
      const key = p.module ?? 'bridge';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });
    return grouped;
  }, [filteredProjects]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !user) return;
    const item = await capture(newTitle.trim());
    if (item) {
      await classify(item.id, 'project', newModule);
      setCreating(false);
      setNewTitle('');
      selectItem(item.id);
    }
  };

  if (selected) {
    return <ProjectDetail project={selected} children={projectChildren[selected.id] ?? []} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium">projects</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{projects.length} projetos · {activeCount} ativos · {totalItems} items</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-lg shadow-lg shadow-accent/20"
          aria-label="Criar projeto"
        >
          +
        </button>
      </div>

      {/* Create modal */}
      {creating && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-2">novo projeto</div>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
            placeholder="titulo do projeto..."
            className="w-full text-sm bg-transparent border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent-light mb-2"
          />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {MODULES.map((m) => (
              <button
                key={m.key}
                onClick={() => setNewModule(m.key)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  newModule === m.key ? 'border-accent bg-accent-bg text-accent font-medium' : 'border-border text-text-muted'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setCreating(false); setNewTitle(''); }} className="flex-1 py-2.5 text-center text-xs border border-border rounded-lg text-text-muted">cancelar</button>
            <button onClick={handleCreate} disabled={!newTitle.trim()} className="flex-1 py-2.5 text-center text-xs bg-accent text-white rounded-lg font-medium disabled:opacity-40">criar</button>
          </div>
        </motion.div>
      )}

      {/* Filter chips */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {([['all', 'todos'], ['active', 'ativos'], ['paused', 'pausados'], ['completed', 'completos']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              filter === key ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted mb-3">□</div>
          <p className="text-sm text-text-muted">nenhum projeto ainda</p>
          <button onClick={() => setCreating(true)} className="text-xs text-accent mt-2">+ criar primeiro projeto</button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-text-muted">nenhum projeto {filter}</p>
        </div>
      ) : (
        Object.entries(filteredByModule).map(([mod, projs]) => (
          <div key={mod}>
            <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4 first:mt-0">
              mod-{mod} · {projs.length}
            </div>
            {projs.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                childCount={projectChildren[p.id]?.length ?? 0}
                connectionCount={connectionCounts[p.id] ?? 0}
                onClick={() => setSelectedId(p.id)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function ProjectCard({ project, childCount, connectionCount, onClick }: { project: AtomItem; childCount: number; connectionCount: number; onClick: () => void }) {
  const moduleColor = project.module ? MODULE_COLORS[project.module] : 'var(--color-mod-bridge)';
  const progress = project.body?.operations?.progress ?? 0;
  const stage = project.genesis_stage;
  const geometry = STAGE_GEOMETRIES[stage] ?? '·';
  const statusLabel = project.status === 'active' ? 'active' : project.status;
  const statusBg = project.status === 'active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-xl p-3.5 px-4 mb-2 relative overflow-hidden"
      style={{ borderLeftWidth: '3px', borderLeftColor: moduleColor }}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[15px] font-medium">{project.title}</span>
        <span className={`text-[10px] px-2 py-px rounded-lg font-medium ${statusBg}`}>{statusLabel}</span>
      </div>
      <div className="text-[11px] text-text-muted mb-2">
        {childCount} items · {geometry} stage {stage}{connectionCount > 0 ? ` · ${connectionCount} connections` : ''}
      </div>
      <div className="h-1 rounded-sm bg-surface overflow-hidden">
        <div className="h-full rounded-sm" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${moduleColor}, ${moduleColor}88)` }} />
      </div>
    </button>
  );
}

function ProjectDetail({ project, children, onBack }: { project: AtomItem; children: AtomItem[]; onBack: () => void }) {
  const { selectItem } = useNav();
  const moduleColor = project.module ? MODULE_COLORS[project.module] : 'var(--color-mod-bridge)';
  const progress = project.body?.operations?.progress ?? 0;
  const stage = project.genesis_stage;
  const geometry = STAGE_GEOMETRIES[stage] ?? '·';
  const statusBg = project.status === 'active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-5 pb-4">
      <button onClick={onBack} className="text-[13px] text-accent pt-4 pb-2">← projects</button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium mb-1.5">{project.title}</h1>
        <button onClick={() => selectItem(project.id)} className="text-xs text-accent">editar</button>
      </div>
      <div className="text-[13px] text-text-muted mb-4 flex items-center gap-2">
        <span className={`text-[10px] px-2 py-px rounded-lg font-medium ${statusBg}`}>{project.status}</span>
        mod-{project.module} · {geometry} stage {stage}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="flex-1 h-1.5 rounded-sm bg-surface overflow-hidden">
          <div className="h-full rounded-sm" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${moduleColor}, ${moduleColor}88)` }} />
        </div>
        <span className="text-base font-medium" style={{ color: moduleColor }}>{progress}%</span>
      </div>

      {project.notes && (
        <p className="text-xs text-text-muted mb-4">{project.notes}</p>
      )}

      {/* Items */}
      <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4">items · {children.length}</div>
      {children.length === 0 ? (
        <p className="text-xs text-text-muted py-4 text-center">nenhum item conectado</p>
      ) : (
        children.map((item) => {
          const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
          const stageColor = STAGE_COLORS[item.genesis_stage] ?? 'var(--color-stage-1)';
          const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
          return (
            <div key={item.id} onClick={() => selectItem(item.id)} className="bg-card border border-border rounded-lg p-2.5 px-3 mb-1.5 flex items-center gap-2.5 text-[13px] cursor-pointer hover:border-accent-light/30 transition-colors">
              <span style={{ color: stageColor }}>{geo}</span>
              <span className="flex-1 truncate">{item.title}</span>
              {item.type && (
                <span className="text-[9px] font-medium px-1.5 py-px rounded-md" style={{ background: `${typeColor}18`, color: typeColor }}>
                  {item.type}
                </span>
              )}
            </div>
          );
        })
      )}
    </motion.div>
  );
}
