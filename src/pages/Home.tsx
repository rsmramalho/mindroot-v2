// pages/Home.tsx
// Dashboard principal — usa DashboardView
// Fase 1: seções por módulo, focus, overdue


import { useItems } from '../hooks/useItems';
import { useItemMutations } from '../hooks/useItemMutations';
import DashboardView from '../components/dashboard/DashboardView';
import AtomInput from '../components/input/AtomInput';

export default function Home() {
  const { data: items = [], isLoading } = useItems();
  const { completeMutation, uncompleteMutation, updateMutation, deleteMutation } = useItemMutations();

  const handleComplete = (id: string) => completeMutation.mutate(id);
  const handleUncomplete = (id: string) => uncompleteMutation.mutate(id);
  const handleDelete = (id: string) => deleteMutation.mutate(id);

  const handleArchive = (id: string) => {
    updateMutation.mutate({ id, updates: { status: 'archived' } });
  };

  const handleEdit = (id: string, updates: Record<string, any>) => {
    updateMutation.mutate({ id, updates });
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
    <div className="flex flex-col gap-4" style={{ padding: '0 4px' }}>
      {/* Input natural */}
      <AtomInput />

      {/* Dashboard */}
      <DashboardView
        items={items}
        onComplete={handleComplete}
        onUncomplete={handleUncomplete}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
