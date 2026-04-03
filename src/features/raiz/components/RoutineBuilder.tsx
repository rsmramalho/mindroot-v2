// features/raiz/components/RoutineBuilder.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useBuilderStore } from '../builder-store';
import { BuilderModuleSelect } from './BuilderModuleSelect';
import { BuilderQuestionFlow } from './BuilderQuestionFlow';
import { BuilderMiniWrap } from './BuilderMiniWrap';

type Screen = 'modules' | 'questions' | 'wrap';

export function RoutineBuilder({ onClose }: { onClose: () => void }) {
  const activeModule = useBuilderStore((s) => s.activeModule);
  const generatedItems = useBuilderStore((s) => s.generatedItems);
  const completedModules = useBuilderStore((s) => s.completedModules);

  const screen: Screen =
    activeModule !== null ? 'questions'
    : generatedItems.length > 0 && completedModules.length > 0 ? 'wrap'
    : 'modules';

  const handleWrapDone = () => {
    useBuilderStore.getState().reset();
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'modules' && (
          <motion.div key="modules" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="flex-1 overflow-y-auto">
            <BuilderModuleSelect onClose={onClose} />
          </motion.div>
        )}
        {screen === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }} className="flex-1 overflow-hidden">
            <BuilderQuestionFlow />
          </motion.div>
        )}
        {screen === 'wrap' && (
          <motion.div key="wrap" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex-1 overflow-y-auto">
            <BuilderMiniWrap onDone={handleWrapDone} onBack={() => useBuilderStore.getState().reset()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
