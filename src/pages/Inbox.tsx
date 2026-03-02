// pages/Inbox.tsx
// Inbox: itens sem módulo — classificar, priorizar, arquivar, promover pra hoje
// Fase 1: InboxActions por item

import { useState, useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useItemMutations } from '../hooks/useItemMutations';
import { getInboxItems, sortItems } from '../engine/dashboard-filters';
import ItemRow from '../components/shared/ItemRow';
import InboxActions from '../components/inbox/InboxActions';
import EmptyState from '../components/shared/EmptyState';
import { startOfDay, formatISO } from 'date-fns';

export default function Inbox() {
  const { data: items = [], isLoading } = useItems();
  const { updateMutation, completeMutation, deleteMutation } = useItemMutations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inboxItems = useMemo(
    () => sortItems(getInboxItems(items), 'created_at', 'desc'),
    [items]
  );

  const handleSetModule = (id: string, module: string) => {
    updateMutation.mutate({ id, updates: { module } });
    setSelectedId(null);
  };

  const handleSetPriority = (id: string, priority: string) => {
    updateMutation.mutate({ id, updates: { priority } });
  };

  const handleArchive = (id: string) => {
    updateMutation.mutate({ id, updates: { status: 'archived' } });
    setSelectedId(null);
  };

  const handlePromote = (id: string) => {
    // Promover = definir due_date pra hoje
    updateMutation.mutate({
      id,
      updates: { due_date: formatISO(startOfDay(new Date())) },
    });
    setSelectedId(null);
  };

  const handleComplete = (id: string) => {
    completeMutation.mutate(id);
    setSelectedId(null);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    setSelectedId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <span
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '18px',
            color: '#a8947840',
            fontWeight: 300,
          }}
        >
          carregando...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" style={{ padding: '0 4px' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: '0 4px 8px' }}>
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '22px',
            fontWeight: 300,
            color: '#e8e0d4',
            letterSpacing: '-0.02em',
          }}
        >
          Inbox
        </h2>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: '#a8947860',
          }}
        >
          {inboxItems.length}
        </span>
      </div>

      {/* Empty */}
      {inboxItems.length === 0 && (
        <EmptyState
          message="Inbox vazio"
          submessage="Itens sem módulo aparecem aqui"
        />
      )}

      {/* Items */}
      {inboxItems.map((item) => (
        <div key={item.id}>
          <div
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
            className="cursor-pointer"
          >
            <ItemRow
              item={item}
              onComplete={handleComplete}
              onDelete={handleDelete}
              showActions={false}
            />
          </div>

          {/* Actions expanded */}
          {selectedId === item.id && (
            <div style={{ padding: '0 8px 8px 40px' }}>
              <InboxActions
                itemId={item.id}
                currentModule={item.module}
                currentPriority={item.priority}
                onSetModule={handleSetModule}
                onSetPriority={handleSetPriority}
                onArchive={handleArchive}
                onPromote={handlePromote}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
