// features/raiz/components/BuilderModuleSelect.tsx
import { motion } from 'framer-motion';
import { useBuilderStore } from '../builder-store';
import { BUILDER_MODULES } from '../builder-questions';
import { MODULE_COLORS } from '@/components/atoms/tokens';
import type { AtomModule } from '@/types/item';

interface Props {
  onClose: () => void;
}

export function BuilderModuleSelect({ onClose }: Props) {
  const startModule = useBuilderStore((s) => s.startModule);
  const completedModules = useBuilderStore((s) => s.completedModules);
  const generatedItems = useBuilderStore((s) => s.generatedItems);
  const hasItems = generatedItems.length > 0;

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-medium text-text-heading">Construir rotina</h1>
        <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text transition-colors">
          <span className="text-sm">x</span>
        </button>
      </div>
      <p className="text-sm text-text-muted mb-6">Escolha um modulo. Uma pergunta de cada vez.</p>

      {/* Module grid */}
      <div className="grid grid-cols-2 gap-3">
        {BUILDER_MODULES.map((mod, i) => {
          const isComplete = completedModules.includes(mod.id);
          const color = MODULE_COLORS[mod.id as AtomModule];

          return (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => startModule(mod.id)}
              className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all active:scale-95 ${isComplete ? 'opacity-60' : ''}`}
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
              }}
            >
              {isComplete && (
                <div className="absolute top-3 right-3 text-xs" style={{ color }}>✓</div>
              )}
              <span className="text-2xl mb-2">{mod.icon}</span>
              <span className="text-sm font-medium" style={{ color }}>{mod.label}</span>
              <span className="text-xs text-text-muted mt-0.5 leading-snug">{mod.description}</span>
            </motion.button>
          );
        })}

        {/* "Revisar rotina" card */}
        {hasItems && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              if (completedModules.length === 0) {
                // Force wrap screen
                useBuilderStore.setState({ completedModules: ['work' as AtomModule] });
              }
            }}
            className="flex flex-col items-start p-4 rounded-2xl border border-dashed border-border text-left transition-all active:scale-95"
          >
            <span className="text-2xl mb-2">✓</span>
            <span className="text-sm font-medium text-text-heading">Revisar rotina</span>
            <span className="text-xs text-text-muted mt-0.5">
              {generatedItems.length} {generatedItems.length === 1 ? 'item criado' : 'itens criados'}
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
