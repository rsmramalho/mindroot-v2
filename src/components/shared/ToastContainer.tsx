// shared/ToastContainer.tsx — Renders toast notifications from toast-store
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/store/toast-store';

const TOAST_STYLES = {
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-accent',
} as const;

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] z-50 flex flex-col items-center gap-2 pointer-events-none" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`${TOAST_STYLES[t.type]} text-white rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg pointer-events-auto flex items-center gap-3 w-full`}
          >
            <span className="flex-1">{t.message}</span>
            {t.undoAction && (
              <button
                onClick={() => { t.undoAction?.(); dismiss(t.id); }}
                className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100 shrink-0"
              >
                {t.undoLabel ?? 'desfazer'}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
