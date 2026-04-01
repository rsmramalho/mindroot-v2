// pages/Projects.tsx — Projects list + detail
// Wireframe: mindroot-wireframe-projects.html
// List: grouped by module, card with progress, next action, stage, connections
// Detail: back button, items list, connections, links

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import type { AtomItem } from '@/types/item';
import { MODULE_COLORS, STAGE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';

export function ProjectsPage() {
  const { items } = useItems();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const byModule = useMemo(() => {
    const grouped: Record<string, AtomItem[]> = {};
    projects.forEach((p) => {
      const key = p.module ?? 'bridge';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });
    return grouped;
  }, [projects]);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) : null;
  const totalItems = projects.reduce((sum, p) => sum + (projectChildren[p.id]?.length ?? 0), 0);
  const activeCount = projects.filter((p) => p.status === 'active').length;

  if (selected) {
    return <ProjectDetail project={selected} children={projectChildren[selected.id] ?? []} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-4">
        <h1 className="text-[22px] font-medium">projects</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{projects.length} projetos · {activeCount} ativos · {totalItems} items</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted mb-3">□</div>
          <p className="text-sm text-text-muted">nenhum projeto ainda</p>
          <p className="text-xs text-text-muted mt-1">projetos sao items type=project</p>
        </div>
      ) : (
        Object.entries(byModule).map(([mod, projs]) => (
          <div key={mod}>
            <div className="text-[11px] text-text-muted tracking-wider uppercase mb-2 mt-4 first:mt-0">
              mod-{mod} · {projs.length}
            </div>
            {projs.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                childCount={projectChildren[p.id]?.length ?? 0}
                onClick={() => setSelectedId(p.id)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function ProjectCard({ project, childCount, onClick }: { project: AtomItem; childCount: number; onClick: () => void }) {
  const moduleColor = project.module ? MODULE_COLORS[project.module] : '#8a8a8a';
  const progress = project.body?.operations?.progress ?? 0;
  const stage = project.genesis_stage;
  const geometry = STAGE_GEOMETRIES[stage] ?? '·';
  const statusLabel = project.status === 'active' ? 'active' : project.status;
  const statusBg = project.status === 'active' ? 'bg-[#EAF3DE] text-[#3B6D11]' : 'bg-surface text-text-muted';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-[#e8e6df] rounded-xl p-3.5 px-4 mb-2 relative overflow-hidden"
      style={{ borderLeftWidth: '3px', borderLeftColor: moduleColor }}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[15px] font-medium">{project.title}</span>
        <span className={`text-[10px] px-2 py-px rounded-lg font-medium ${statusBg}`}>{statusLabel}</span>
      </div>
      <div className="text-[11px] text-text-muted mb-2">
        {childCount} items · {geometry} stage {stage}
      </div>
      <div className="h-1 rounded-sm bg-surface overflow-hidden">
        <div className="h-full rounded-sm" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${moduleColor}, ${moduleColor}88)` }} />
      </div>
    </button>
  );
}

function ProjectDetail({ project, children, onBack }: { project: AtomItem; children: AtomItem[]; onBack: () => void }) {
  const moduleColor = project.module ? MODULE_COLORS[project.module] : '#8a8a8a';
  const progress = project.body?.operations?.progress ?? 0;
  const stage = project.genesis_stage;
  const geometry = STAGE_GEOMETRIES[stage] ?? '·';
  const statusBg = project.status === 'active' ? 'bg-[#EAF3DE] text-[#3B6D11]' : 'bg-surface text-text-muted';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-5 pb-4">
      <button onClick={onBack} className="text-[13px] text-[#534AB7] pt-4 pb-2">← projects</button>
      <h1 className="text-2xl font-medium mb-1.5">{project.title}</h1>
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
          const stageColor = STAGE_COLORS[item.genesis_stage] ?? '#6b6b6b';
          const typeColor = item.type ? getTypeColor(item.type) : '#8a8a8a';
          return (
            <div key={item.id} className="bg-white border border-[#e8e6df] rounded-lg p-2.5 px-3 mb-1.5 flex items-center gap-2.5 text-[13px]">
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
