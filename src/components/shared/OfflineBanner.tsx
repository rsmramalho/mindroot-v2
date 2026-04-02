// shared/OfflineBanner.tsx — Shows banner when device goes offline
import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning-bg text-warning-text text-xs font-medium text-center py-2 px-4">
      sem conexao — dados podem estar desatualizados
    </div>
  );
}
