// pages/Library.tsx — Library + Reflexões
// Wireframe: mindroot-wireframe-library-reflexoes.html
// Search, filter pills, library cards, reflexões tab

import { useState, useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AtomItem, AtomType } from '@/types/item';
import { getTypeColor } from '@/components/atoms/tokens';

const LIBRARY_TYPES: AtomType[] = ['recipe', 'workout', 'article', 'podcast', 'recommendation', 'resource'];
const FILTER_PILLS: { key: 'all' | 'library' | 'reflections'; label: string }[] = [
  { key: 'all', label: 'tudo' },
  { key: 'library', label: 'biblioteca' },
  { key: 'reflections', label: 'reflexoes' },
];

export function LibraryPage() {
  const { items } = useItems();
  const [filter, setFilter] = useState<'all' | 'library' | 'reflections'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = items.filter((i) => i.status !== 'archived');

    if (filter === 'library') result = result.filter((i) => i.type && LIBRARY_TYPES.includes(i.type));
    else if (filter === 'reflections') result = result.filter((i) => i.type === 'reflection' || i.type === 'checkpoint');

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(q) || i.notes?.toLowerCase().includes(q));
    }

    return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [items, filter, search]);

  return (
    <div className="px-5 pb-4">
      <div className="pt-4 pb-3">
        <h1 className="text-2xl font-medium tracking-tight">biblioteca</h1>
      </div>

      {/* Search */}
      <div className="bg-white border border-border rounded-xl px-3.5 py-2.5 flex items-center gap-2 mb-3">
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
              filter === p.key ? 'bg-[#EEEDFE] text-[#534AB7] font-medium' : 'bg-surface text-text-muted'
            }`}
          >
            {p.label}
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
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCard({ item }: { item: AtomItem }) {
  const typeColor = item.type ? getTypeColor(item.type) : '#8a8a8a';

  return (
    <div className="bg-white border border-[#e8e6df] rounded-xl p-3 px-3.5">
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium flex-1">{item.title}</span>
        {item.type && (
          <span className="text-[10px] font-medium px-2 py-px rounded-md shrink-0 ml-2"
            style={{ background: `${typeColor}18`, color: typeColor }}>
            {item.type}
          </span>
        )}
      </div>
      {item.notes && (
        <p className="text-xs text-text-muted line-clamp-2 mb-1.5">{item.notes}</p>
      )}
      <div className="flex items-center gap-2 text-[10px] text-text-muted">
        <span>{format(parseISO(item.created_at), "d MMM", { locale: ptBR })}</span>
        {item.module && <span>· {item.module}</span>}
        {item.tags.length > 0 && <span>· {item.tags.slice(0, 2).join(', ')}</span>}
      </div>
    </div>
  );
}
