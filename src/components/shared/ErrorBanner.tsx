// shared/ErrorBanner.tsx — Offline/error banner
// Discrete banner at top of content area

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-[#FAEEDA] text-[#854F0B] text-xs font-medium px-4 py-2.5 flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-[#854F0B]/60 ml-2">✕</button>
      )}
    </div>
  );
}
