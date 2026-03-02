// components/shared/EmptyState.tsx
// Empty state com mensagem customizável



interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export default function EmptyState({
  message = 'Nada aqui ainda',
  submessage = 'Use o input acima para adicionar algo',
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ padding: '48px 24px', gap: '8px' }}
    >
      <span
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '20px',
          fontWeight: 300,
          color: '#a8947840',
          letterSpacing: '-0.02em',
        }}
      >
        {message}
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: '#a8947825',
        }}
      >
        {submessage}
      </span>
    </div>
  );
}
