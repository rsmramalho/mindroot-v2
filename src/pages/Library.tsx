// pages/Library.tsx — Library + Reflexões
// Wireframe: mindroot-wireframe-library-reflexoes.html
// Search, filter pills, library cards, reflexões tab

import { useState, useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AtomItem, AtomType } from '@/types/item';
import { getTypeColor, MODULE_COLORS } from '@/components/atoms/tokens';
import { RAIZ_DOMAINS } from '@/config/raiz';

const LIBRARY_TYPES: AtomType[] = ['recipe', 'workout', 'article', 'podcast', 'recommendation', 'resource'];
const FILTER_PILLS: { key: 'all' | 'library' | 'reflections'; label: string }[] = [
  { key: 'all', label: 'tudo' },
  { key: 'library', label: 'biblioteca' },
  { key: 'reflections', label: 'reflexoes' },
];

export function LibraryPage() {
  const { items } = useItems();
  const { selectItem, navigate } = useNav();
  const [filter, setFilter] = useState<'all' | 'library' | 'reflections'>('all');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = items.filter((i) => i.status !== 'archived');

    if (filter === 'library') result = result.filter((i) => i.type && LIBRARY_TYPES.includes(i.type));
    else if (filter === 'reflections') result = result.filter((i) => i.type === 'reflection' || i.type === 'checkpoint');

    if (domainFilter) {
      result = result.filter((i) => i.tags?.includes(`#domain:${domainFilter}`));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(q) || i.notes?.toLowerCase().includes(q));
    }

    return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [items, filter, search, domainFilter]);

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">biblioteca</h1>
        <button onClick={() => navigate('graph' as any)} className="text-xs text-accent">
          ver grafo →
        </button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl px-3.5 py-2.5 flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-text-muted">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="buscar por titulo, conteudo..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-text-muted"
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {FILTER_PILLS.map((p) => (
          <button
            key={p.key}
            onClick={() => setFilter(p.key)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              filter === p.key ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Domain filter */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto">
        <button
          onClick={() => setDomainFilter(null)}
          className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all ${
            !domainFilter ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
          }`}
        >
          todos
        </button>
        {RAIZ_DOMAINS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDomainFilter(domainFilter === d.key ? null : d.key)}
            className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all ${
              domainFilter === d.key ? 'bg-accent-bg text-accent font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Count + sort */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-text-muted">{filtered.length} items</span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">nenhum item encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 20).map((item) => (
            <LibraryCard key={item.id} item={item} onClick={() => selectItem(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCard({ item, onClick }: { item: AtomItem; onClick?: () => void }) {
  const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-3 px-3.5 cursor-pointer hover:border-accent-light/30 transition-colors"
      style={{ borderLeftWidth: '3px', borderLeftColor: moduleColor }}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium flex-1">{item.title}</span>
        {item.type && (
          <span className="text-[10px] font-medium px-2 py-px rounded-md shrink-0 ml-2"
            style={{ background: `${typeColor}18`, color: typeColor }}>
            {item.type}
          </span>
        )}
      </div>
      <TypeBody item={item} />
      {item.notes && (
        <p className="text-xs text-text-muted line-clamp-2 mb-1.5">{item.notes}</p>
      )}
      <div className="flex items-center gap-2 text-[10px] text-text-muted mt-1.5">
        <span>{format(parseISO(item.created_at), "d MMM", { locale: ptBR })}</span>
        {item.module && <span>· {item.module}</span>}
        {item.tags.length > 0 && <span>· {item.tags.slice(0, 2).join(', ')}</span>}
      </div>
    </div>
  );
}

function TypeBody({ item }: { item: AtomItem }) {
  const body = item.body ?? {};

  switch (item.type) {
    case 'recipe': {
      const stats = [
        body.prep_time && `${body.prep_time}`,
        body.serves && `serves ${body.serves}`,
        body.cuisine,
      ].filter(Boolean);
      if (stats.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-2 mb-1.5">
          {stats.map((s, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-surface text-text-muted">{s as string}</span>
          ))}
        </div>
      );
    }
    case 'workout': {
      const tags = [body.focus, body.level, body.duration && `${body.duration} min`].filter(Boolean);
      if (tags.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {tags.map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-success-bg text-success-text">{t as string}</span>
          ))}
        </div>
      );
    }
    case 'podcast':
    case 'article': {
      const source = body.show_name ?? body.publication ?? body.author;
      if (!source) return null;
      return <div className="text-[11px] text-text-muted mb-1 italic">{source as string}</div>;
    }
    case 'reflection':
    case 'checkpoint': {
      const soul = body.soul as Record<string, string> | undefined;
      if (!soul?.emotion_before && !soul?.emotion_after) return null;
      return (
        <div className="flex items-center gap-2 text-[11px] text-accent-light mb-1.5">
          {soul.emotion_before && <span>{soul.emotion_before}</span>}
          {soul.emotion_before && soul.emotion_after && <span>→</span>}
          {soul.emotion_after && <span>{soul.emotion_after}</span>}
        </div>
      );
    }
    case 'recommendation': {
      const rating = body.rating as number | undefined;
      if (!rating) return null;
      return <div className="text-[11px] text-warning mb-1">{'★'.repeat(Math.min(rating, 5))}</div>;
    }
    default:
      return null;
  }
}
