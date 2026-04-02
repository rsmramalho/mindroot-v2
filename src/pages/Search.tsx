// pages/Search.tsx — Global search with filter chips
// Uses engine/search.ts for client-side search + filtering

import { useState, useMemo, useRef, useEffect } from 'react';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { parseSearchQuery, searchItems, hasActiveFilters, getFilterLabels } from '@/engine/search';
import { MODULES } from '@/types/item';
import type { AtomModule } from '@/types/item';
import { MODULE_COLORS, STAGE_GEOMETRIES } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';

export function SearchPage() {
  const { items } = useItems();
  const { navigate, selectItem } = useNav();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<AtomModule | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filters = useMemo(() => {
    const parsed = parseSearchQuery(query);
    if (moduleFilter) parsed.module = moduleFilter;
    return parsed;
  }, [query, moduleFilter]);

  const results = useMemo(
    () => searchItems(items, filters),
    [items, filters],
  );

  const filterLabels = useMemo(() => getFilterLabels(filters), [filters]);
  const showFilters = hasActiveFilters(filters);

  return (
    <div className="px-5 pb-4">
      {/* Header */}
      <div className="pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('home')} className="text-sm text-accent">←</button>
        <h1 className="text-lg font-medium tracking-tight">buscar</h1>
      </div>

      {/* Search input */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5 mb-3">
        <span className="text-text-muted text-xs">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="buscar items... (mod:work prio:high)"
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-text-muted"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-xs text-text-muted">✕</button>
        )}
      </div>

      {/* Module filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {MODULES.map((m) => (
          <button
            key={m.key}
            onClick={() => setModuleFilter(moduleFilter === m.key ? null : m.key)}
            className={`shrink-0 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
              moduleFilter === m.key
                ? 'bg-accent-bg text-accent border-accent-light'
                : 'bg-card text-text-muted border-border'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Active filter labels */}
      {showFilters && (
        <div className="flex flex-wrap gap-1 mb-3">
          {filterLabels.map((f) => (
            <span
              key={f.key}
              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-surface text-text-muted"
            >
              {f.label}
            </span>
          ))}
        </div>
      )}

      {/* Result count */}
      {(query || moduleFilter) && (
        <p className="text-[11px] text-text-muted mb-2">{results.length} resultados</p>
      )}

      {/* Results */}
      <div className="space-y-1">
        {results.map(({ item, matchField }) => {
          const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';
          const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
          const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';

          return (
            <div key={item.id} onClick={() => selectItem(item.id)} className="flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl cursor-pointer">
              <div className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: moduleColor }} />
              <span className="text-xs text-text-muted">{geo}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] truncate">{item.title}</div>
                {matchField === 'notes' && item.notes && (
                  <div className="text-[11px] text-text-muted truncate mt-0.5">{item.notes.slice(0, 60)}...</div>
                )}
              </div>
              {item.type && (
                <span
                  className="text-[9px] font-medium px-1.5 py-px rounded shrink-0"
                  style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}
                >
                  {item.type}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {query && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted/40 mb-3">⌕</div>
          <p className="text-sm text-text-muted">nenhum resultado para "{query}"</p>
        </div>
      )}

      {/* Initial state */}
      {!query && !moduleFilter && (
        <div className="text-center py-12">
          <div className="text-3xl text-text-muted/40 mb-3">·</div>
          <p className="text-sm text-text-muted">digite pra buscar</p>
          <p className="text-[11px] text-text-muted mt-1">prefixos: mod: emo: prio: tipo: tag: data:</p>
        </div>
      )}
    </div>
  );
}
