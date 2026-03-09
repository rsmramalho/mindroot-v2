// components/shared/TagChip.tsx
// Chip visual para tags genéricas
// Standalone — usado em ItemRow, detalhes



interface TagChipProps {
  tag: string;
  onRemove?: () => void;
}

export default function TagChip({ tag, onRemove }: TagChipProps) {
  // Limpar # do início se presente
  const display = tag.startsWith('#') ? tag : `#${tag}`;

  return (
    <span
      className="inline-flex items-center gap-1 rounded"
      style={{
        padding: '1px 6px',
        fontSize: '11px',
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 400,
        color: '#a89478',
        backgroundColor: '#a8947815',
        border: '1px solid #a8947825',
        letterSpacing: '-0.02em',
      }}
    >
      {display}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remover tag ${display}`}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          style={{ color: '#a89478', fontSize: '10px', lineHeight: 1 }}
        >
          ×
        </button>
      )}
    </span>
  );
}
