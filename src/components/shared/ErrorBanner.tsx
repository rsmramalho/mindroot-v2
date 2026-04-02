// shared/ErrorBanner.tsx — Offline/error banner
// Discrete banner at top of content area

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-warning-bg text-warning-text text-xs font-medium px-4 py-2.5 flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-warning-text/60 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Fechar">✕</button>
      )}
    </div>
  );
}
