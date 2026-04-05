// pages/ItemDetail.tsx — Item detail view with inline editing
// Stage progress bar, classify/advance actions, module color border, connections

import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { useItemMutations } from '@/hooks/useItemMutations';
import { usePipeline } from '@/hooks/usePipeline';
import { useTriage } from '@/hooks/useTriage';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { MODULES, EMOTIONS } from '@/types/item';
import type { AtomType, AtomModule, AtomStatus, AtomRelation, AtomItem, Emotion } from '@/types/item';
import { shouldTriggerCheckIn } from '@/engine/soul';
import { toast } from '@/store/toast-store';
import { ALL_TYPES } from '@/config/types';
import { STAGE_COLORS, STAGE_GEOMETRIES, MODULE_COLORS } from '@/components/atoms/tokens';
import { ConnectionsSection } from '@/components/shared/ConnectionsSection';
import { getTypeColor } from '@/components/atoms/tokens';
import { getConfidenceBand } from '@/service/triage-service';
import { useConnections } from '@/hooks/useConnections';

const STATUS_OPTIONS: { key: AtomStatus; label: string }[] = [
  { key: 'active', label: 'ativo' },
  { key: 'paused', label: 'pausado' },
  { key: 'waiting', label: 'aguardando' },
  { key: 'someday', label: 'algum dia' },
  { key: 'completed', label: 'concluido' },
];

const ADVANCE_LABELS: Record<number, string> = {
  2: 'estruturar → stage 3',
  3: 'validar → stage 4',
  4: 'conectar → stage 5',
  5: 'propagar → stage 6',
  6: 'commitar → stage 7',
};

export function ItemDetailPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { items } = useItems();
  const { updateMutation, deleteMutation } = useItemMutations();
  const { classify: pipelineClassify, structure, validate, commit: pipelineCommit } = usePipeline();
  const { classify: aiClassify, isClassifying, result: triageResult, reset: resetTriage } = useTriage();
  const { morph, connect: pipelineConnect } = usePipeline();
  const { connections } = useConnections();
  const storeId = useAppStore((s) => s.selectedItemId);
  const { navigate, goBack } = useNav();
  const [checkInPrompt, setCheckInPrompt] = useState<string | null>(null);
  const [showConnectionPrompt, setShowConnectionPrompt] = useState(true);

  const itemId = urlId ?? storeId;
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="px-5 pt-8 text-center">
        <div className="text-3xl text-text-muted/40 mb-3">·</div>
        <p className="text-sm text-text-muted">item nao encontrado</p>
        <button onClick={() => navigate('home')} className="text-xs text-accent mt-4">← voltar</button>
      </div>
    );
  }

  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';

  const update = (updates: Record<string, unknown>) => {
    updateMutation.mutate({ id: item.id, updates });

    // Trigger soul check-in when completing a task
    if (updates.status === 'completed' && item.status !== 'completed') {
      const simulated = { ...item, status: 'completed' as const };
      const trigger = shouldTriggerCheckIn(simulated);
      if (trigger) {
        setCheckInPrompt(trigger.prompt);
      }
    }
  };

  const handleEmotionAfter = (emotion: Emotion) => {
    const existingBody = (item.body ?? {}) as Record<string, unknown>;
    const existingSoul = (existingBody.soul ?? {}) as Record<string, unknown>;
    updateMutation.mutate({
      id: item.id,
      updates: {
        body: { ...existingBody, soul: { ...existingSoul, emotion_after: emotion } } as Record<string, unknown>,
      },
    });
    setCheckInPrompt(null);
    toast.success('emotion registrada');
  };

  const handleAiClassify = async () => {
    if (!item.title.trim()) {
      toast.error('Item sem titulo');
      return;
    }
    try {
      const result = await aiClassify({ input: item.title });
      const band = getConfidenceBand(result);
      if (band === 'auto') {
        await pipelineClassify(item.id, result.type as AtomType, result.module as AtomModule);
        resetTriage();
      }
    } catch {
      toast.error('Erro na classificacao AI');
    }
  };

  const handleAcceptTriage = async () => {
    if (!triageResult) return;
    await pipelineClassify(item.id, triageResult.type as AtomType, triageResult.module as AtomModule);
    resetTriage();
  };

  const handleAdvance = async () => {
    const stage = item.genesis_stage;
    if (stage === 1) return; // must classify first
    if (stage === 2) {
      await structure(item.id, item.body ?? {}, item.notes ?? undefined);
    } else if (stage === 3) {
      await validate(item.id);
    } else if (stage >= 4 && stage < 7) {
      await pipelineCommit(item.id);
    }
  };

  const nextStage = item.genesis_stage + 1;
  const advanceLabel = ADVANCE_LABELS[item.genesis_stage] ?? null;
  const canAdvanceNow = item.genesis_stage >= 2 && item.genesis_stage < 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pb-8"
    >
      {/* Header */}
      <div className="pt-4 pb-3 flex items-center justify-between">
        <button onClick={() => goBack()} className="text-sm text-accent">← voltar</button>
      </div>

      {/* Module color bar */}
      <div className="h-[3px] rounded-sm mb-4" style={{ background: moduleColor }} />

      {/* Stage progress bar */}
      <StageProgressBar currentStage={item.genesis_stage} />

      {/* Title */}
      <EditableTitle item={item} onSave={(title) => update({ title })} />

      {/* Chips row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <TypeSelector value={item.type} onChange={(type) => {
          if (item.genesis_stage >= 3) {
            morph(item.id, type);
          } else {
            update({ type });
          }
        }} />
        <ModuleSelector value={item.module} onChange={(module) => update({ module })} />
        <StatusSelector value={item.status} onChange={(status) => update({ status })} />
      </div>

      {/* Soul check-in after completion */}
      {checkInPrompt && (
        <div className="mb-4 bg-accent-bg border border-accent/20 rounded-[14px] p-4">
          <p className="text-[13px] text-accent mb-2.5">{checkInPrompt}</p>
          <div className="flex flex-wrap gap-1.5">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                onClick={() => handleEmotionAfter(e)}
                className="px-2.5 py-1 rounded-2xl border border-border bg-card text-xs text-text-muted hover:border-accent-light hover:text-accent transition-all"
              >
                {e}
              </button>
            ))}
          </div>
          <button onClick={() => setCheckInPrompt(null)} className="text-[11px] text-text-muted mt-2">
            pular
          </button>
        </div>
      )}

      {/* Classify / Advance actions */}
      {item.genesis_stage === 1 && (
        <div className="mb-4">
          {triageResult ? (
            <div className="bg-surface rounded-[14px] p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ai-purple to-ai-blue flex items-center justify-center text-[10px] text-white font-medium shrink-0">
                  A
                </div>
                <span className="text-xs text-text-muted">sugestao do triage</span>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-2">
                <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: `${getTypeColor(triageResult.type as AtomType)}18`, color: getTypeColor(triageResult.type as AtomType) }}>
                  {triageResult.type}
                </span>
                <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: `${MODULE_COLORS[triageResult.module as AtomModule] ?? 'var(--color-mod-bridge)'}18`, color: MODULE_COLORS[triageResult.module as AtomModule] ?? 'var(--color-mod-bridge)' }}>
                  {triageResult.module}
                </span>
              </div>
              {triageResult.reasoning && (
                <p className="text-[11px] text-text-muted italic mb-2">"{triageResult.reasoning}"</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => resetTriage()} className="flex-1 py-2 text-center text-xs border border-border rounded-lg text-text-muted">descartar</button>
                <button onClick={handleAcceptTriage} className="flex-1 py-2 text-center text-xs bg-success text-white rounded-lg font-medium">aceitar</button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAiClassify}
              disabled={isClassifying}
              className="w-full bg-surface rounded-xl p-3.5 text-center text-[13px] text-text-muted hover:bg-border/50 transition-colors disabled:opacity-50"
            >
              {isClassifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-accent-light border-t-transparent animate-spin" />
                  classificando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ai-purple to-ai-blue flex items-center justify-center text-[10px] text-white font-medium shrink-0">
                    A
                  </div>
                  classificar com AI
                </span>
              )}
            </button>
          )}
        </div>
      )}

      {canAdvanceNow && advanceLabel && item.genesis_stage !== 4 && (
        <button
          onClick={handleAdvance}
          className="w-full mb-4 py-3 text-center text-sm font-medium bg-accent text-white rounded-xl"
        >
          {advanceLabel} → stage {nextStage}
        </button>
      )}

      {/* Connection prompt — Genesis gate 4 */}
      {item.genesis_stage === 4 && showConnectionPrompt && (
        <ConnectionPrompt
          item={item}
          allItems={items}
          connections={connections}
          onConnect={async (targetId, relation) => {
            await pipelineConnect(item.id, targetId, relation);
            setShowConnectionPrompt(false);
          }}
          onSkip={() => setShowConnectionPrompt(false)}
        />
      )}

      <Divider />

      {/* Notes */}
      <EditableNotes item={item} onSave={(notes) => update({ notes })} />

      <Divider />

      {/* Tags */}
      <TagsSection tags={item.tags} onAdd={(tag) => update({ tags: [...item.tags, tag] })} onRemove={(tag) => update({ tags: item.tags.filter((t) => t !== tag) })} />

      <Divider />

      {/* Connections */}
      <ConnectionsSection itemId={item.id} />

      <Divider />

      {/* Details */}
      <SectionLabel>detalhes</SectionLabel>
      <div className="space-y-1 mb-4">
        <DetailRow label="criado em" value={formatDate(item.created_at)} />
        <DetailRow label="atualizado" value={formatDate(item.updated_at)} />
        {item.source && <DetailRow label="fonte" value={item.source} />}
        {item.project_id && <DetailRow label="projeto" value={item.project_id.slice(0, 8)} />}
      </div>

      <Divider />

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => { update({ status: 'archived' }); goBack(); }}
          className="flex-1 py-2.5 text-center text-sm border border-border rounded-xl text-text-muted"
        >
          arquivar
        </button>
        <DeleteButton itemId={item.id} onDelete={() => goBack()} deleteMutation={deleteMutation} />
      </div>
    </motion.div>
  );
}

// ─── Stage Progress Bar ─────────────────────────────

function StageProgressBar({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {[1, 2, 3, 4, 5, 6, 7].map((stage) => {
        const geo = STAGE_GEOMETRIES[stage];
        const color = STAGE_COLORS[stage];
        const isActive = stage === currentStage;
        const isPast = stage < currentStage;
        return (
          <div key={stage} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-sm transition-all ${isPast || isActive ? '' : 'opacity-20'}`}
              style={{ background: isPast || isActive ? color : 'var(--color-border)' }}
            />
            <span
              className={`text-[10px] transition-all ${isActive ? 'font-medium' : 'opacity-40'}`}
              style={{ color: isActive || isPast ? color : undefined }}
            >
              {geo}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Editable Title ──────────────────────────────────

function EditableTitle({ item, onSave }: { item: { title: string }; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(item.title);
      setEditing(false);
      toast.error('Titulo nao pode ser vazio');
      return;
    }
    if (trimmed !== item.title) onSave(trimmed);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === 'Enter' && save()}
        autoFocus
        className="text-xl font-medium w-full bg-transparent outline-none border-b border-accent mb-4 pb-1"
      />
    );
  }

  return (
    <h1
      onClick={() => { setDraft(item.title); setEditing(true); }}
      className="text-xl font-medium mb-4 cursor-text"
    >
      {item.title}
    </h1>
  );
}

// ─── Editable Notes ──────────────────────────────────

function EditableNotes({ item, onSave }: { item: { notes: string | null }; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.notes ?? '');

  const save = () => {
    if (draft !== (item.notes ?? '')) onSave(draft);
    setEditing(false);
  };

  return (
    <>
      <SectionLabel>notas</SectionLabel>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          autoFocus
          rows={4}
          className="w-full text-sm bg-transparent outline-none border border-border rounded-xl p-3 mb-4 resize-none"
        />
      ) : (
        <div
          onClick={() => { setDraft(item.notes ?? ''); setEditing(true); }}
          className="text-sm text-text-muted mb-4 min-h-[40px] cursor-text"
        >
          {item.notes || 'toque pra adicionar notas...'}
        </div>
      )}
    </>
  );
}

// ─── Type Selector ───────────────────────────────────

function TypeSelector({ value, onChange }: { value: AtomType | null; onChange: (v: AtomType) => void }) {
  const [open, setOpen] = useState(false);
  const color = value ? getTypeColor(value) : 'var(--color-mod-bridge)';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-medium px-2.5 py-1 rounded-lg"
        style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
      >
        {value ?? 'tipo'}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto w-36">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { onChange(t as AtomType); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Module Selector ─────────────────────────────────

function ModuleSelector({ value, onChange }: { value: AtomModule | null; onChange: (v: AtomModule) => void }) {
  const [open, setOpen] = useState(false);
  const color = value ? MODULE_COLORS[value] : 'var(--color-mod-bridge)';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"
        style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        {value ?? 'modulo'}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-36">
          {MODULES.map((m) => (
            <button
              key={m.key}
              onClick={() => { onChange(m.key); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status Selector ─────────────────────────────────

function StatusSelector({ value, onChange }: { value: AtomStatus; onChange: (v: AtomStatus) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-surface text-text-muted"
      >
        {value}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-36">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => { onChange(s.key); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors ${value === s.key ? 'font-medium text-accent' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tags Section ────────────────────────────────────

function TagsSection({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (tag: string) => void; onRemove?: (tag: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const add = () => {
    if (draft.trim()) {
      onAdd(draft.trim());
      setDraft('');
      setAdding(false);
    }
  };

  return (
    <>
      <SectionLabel>tags</SectionLabel>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((t) => (
          <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-surface text-text-muted flex items-center gap-1">
            {t}
            {onRemove && (
              <button
                onClick={() => {
                  const isProtected = ['#domain:', '#raiz', '#mod_', '#ritual:', '#project:', '#seed'].some(p => t.startsWith(p) || t === p);
                  if (isProtected) {
                    if (window.confirm(`Remover tag "${t}"? Essa tag e usada pelo sistema.`)) onRemove(t);
                  } else {
                    onRemove(t);
                  }
                }}
                className="text-text-muted/60 hover:text-error ml-0.5"
                aria-label={`Remover tag ${t}`}
              >×</button>
            )}
          </span>
        ))}
        {adding ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={add}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            autoFocus
            placeholder="tag..."
            className="text-[11px] px-2.5 py-1 rounded-lg border border-accent bg-transparent outline-none w-20"
          />
        ) : (
          <button onClick={() => setAdding(true)} className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-text-muted">
            + tag
          </button>
        )}
      </div>
    </>
  );
}

// ─── Delete Button ───────────────────────────────────

function DeleteButton({ itemId, onDelete, deleteMutation }: { itemId: string; onDelete: () => void; deleteMutation: any }) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <div className="flex-1 flex items-center gap-2 justify-center py-2.5 border border-error/20 rounded-xl">
        <span className="text-xs text-error">certeza?</span>
        <button onClick={() => { deleteMutation.mutate(itemId); onDelete(); }} className="text-xs text-error font-medium">sim</button>
        <button onClick={() => setConfirm(false)} className="text-xs text-text-muted">nao</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex-1 py-2.5 text-center text-sm border border-error/20 rounded-xl text-error"
    >
      excluir
    </button>
  );
}

// ─── Connection Prompt (Genesis gate 4) ─────────────

function ConnectionPrompt({ item, allItems, connections, onConnect, onSkip }: {
  item: AtomItem;
  allItems: AtomItem[];
  connections: { source_id: string; target_id: string }[];
  onConnect: (targetId: string, relation: AtomRelation) => Promise<void>;
  onSkip: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [relation, setRelation] = useState<AtomRelation>('references');

  const connectedIds = new Set([
    ...connections.filter((c) => c.source_id === item.id).map((c) => c.target_id),
    ...connections.filter((c) => c.target_id === item.id).map((c) => c.source_id),
  ]);

  // Suggest items from same module or matching tags, excluding self and already connected
  const suggested = useMemo(() => {
    const candidates = allItems.filter((i) =>
      i.id !== item.id &&
      !connectedIds.has(i.id) &&
      i.status !== 'archived' &&
      (i.module === item.module || i.tags?.some((t) => item.tags?.includes(t)))
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      return candidates.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 6);
    }
    return candidates.slice(0, 6);
  }, [allItems, item, connectedIds, search]);

  const RELATIONS: { key: AtomRelation; label: string }[] = [
    { key: 'belongs_to', label: 'pertence a' },
    { key: 'references', label: 'referencia' },
    { key: 'feeds', label: 'alimenta' },
    { key: 'blocks', label: 'bloqueia' },
    { key: 'derives', label: 'deriva de' },
    { key: 'mirrors', label: 'espelha' },
  ];

  const target = selectedId ? allItems.find((i) => i.id === selectedId) : null;

  return (
    <div className="mb-4 bg-accent-bg border border-accent/20 rounded-[14px] p-4">
      <div className="text-[11px] font-medium tracking-wider uppercase text-accent mb-1">portao 4 · conexao</div>
      <p className="text-[13px] text-text mb-3">isso se conecta com algo?</p>

      {!selectedId ? (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="buscar item..."
            className="w-full text-[12px] bg-card border border-border rounded-lg px-3 py-2 outline-none focus:border-accent-light mb-2"
          />
          {suggested.length > 0 ? (
            <div className="space-y-1">
              {suggested.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full text-left px-3 py-2 text-[12px] bg-card border border-border rounded-lg hover:border-accent-light transition-colors truncate flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.module ? MODULE_COLORS[s.module] : 'var(--color-border)' }} />
                  <span className="truncate">{s.title}</span>
                  {s.type && <span className="text-[9px] text-text-muted ml-auto shrink-0">{s.type}</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-2 text-center">nenhum item encontrado</p>
          )}
          <button onClick={onSkip} className="text-[11px] text-text-muted mt-2">
            nao por agora
          </button>
        </>
      ) : (
        <>
          <div className="text-[12px] text-text-muted mb-2">→ <span className="font-medium text-text">{target?.title}</span></div>
          <div className="flex flex-wrap gap-1 mb-3">
            {RELATIONS.map((r) => (
              <button
                key={r.key}
                onClick={() => setRelation(r.key)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border ${
                  relation === r.key ? 'border-accent bg-accent-bg text-accent' : 'border-border text-text-muted'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelectedId(null)} className="flex-1 py-2 text-center text-xs border border-border rounded-lg text-text-muted">
              voltar
            </button>
            <button
              onClick={() => onConnect(selectedId!, relation)}
              className="flex-1 py-2 text-center text-xs bg-accent text-white rounded-lg font-medium"
            >
              conectar → stage 5
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared ──────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-medium tracking-wider uppercase text-text-muted mb-1.5">{children}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-b border-border my-4" />;
}

function formatDate(iso: string): string {
  try { return format(parseISO(iso), "d MMM yyyy", { locale: ptBR }); }
  catch { return iso; }
}
