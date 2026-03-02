// components/shared/PriorityDot.tsx
// Indicador visual de prioridade
// Standalone — usado em ItemRow, Dashboard, Inbox



const PRIORITY_CONFIG: Record<string, { color: string; label: string; pulse?: boolean }> = {
  urgente:    { color: '#e85d5d', label: 'Urgente', pulse: true },
  importante: { color: '#e8a84c', label: 'Importante' },
  manutencao: { color: '#8a9e7a', label: 'Manutenção' },
  futuro:     { color: '#6b7280', label: 'Futuro' },
};

interface PriorityDotProps {
  priority: string | null | undefined;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function PriorityDot({ priority, size = 'sm', showLabel = false }: PriorityDotProps) {
  if (!priority) return null;

  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  const dotSize = size === 'sm' ? 8 : 10;

  return (
    <span className="inline-flex items-center gap-1.5" title={config.label}>
      <span
        className="rounded-full inline-block flex-shrink-0"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: config.color,
          boxShadow: config.pulse ? `0 0 6px ${config.color}80` : 'none',
          animation: config.pulse ? 'priorityPulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {showLabel && (
        <span
          style={{
            color: config.color,
            fontSize: size === 'sm' ? '11px' : '12px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {config.label}
        </span>
      )}
      {config.pulse && (
        <style>{`
          @keyframes priorityPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      )}
    </span>
  );
}

export { PRIORITY_CONFIG };
