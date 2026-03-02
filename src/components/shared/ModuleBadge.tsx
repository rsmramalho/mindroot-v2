// components/shared/ModuleBadge.tsx
// Badge visual do módulo (área da vida)
// Standalone — usado em ItemRow, Dashboard, Inbox



const MODULE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  purpose: { label: 'Propósito', color: '#c4a882', icon: '◇' },
  work:    { label: 'Trabalho', color: '#8a9e7a', icon: '▪' },
  family:  { label: 'Família',  color: '#d4856a', icon: '♡' },
  body:    { label: 'Corpo',    color: '#b8c4a8', icon: '○' },
  mind:    { label: 'Mente',    color: '#a89478', icon: '◎' },
  soul:    { label: 'Alma',     color: '#8a6e5a', icon: '✦' },
  home:    { label: 'Casa',     color: '#a89478', icon: '⌂' },
};

interface ModuleBadgeProps {
  module: string | null | undefined;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function ModuleBadge({ module, size = 'sm', showLabel = true }: ModuleBadgeProps) {
  if (!module) return null;

  const config = MODULE_CONFIG[module];
  if (!config) return null;

  const isSmall = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border"
      style={{
        borderColor: `${config.color}40`,
        backgroundColor: `${config.color}15`,
        color: config.color,
        padding: isSmall ? '1px 8px' : '2px 10px',
        fontSize: isSmall ? '11px' : '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: isSmall ? '9px' : '10px' }}>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export { MODULE_CONFIG };
