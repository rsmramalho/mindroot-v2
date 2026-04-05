// hooks/useBreakpoint.ts — Responsive breakpoint detection via matchMedia
// Mobile: <768px | Desktop: ≥768px | Wide: ≥1280px

import { useState, useEffect } from 'react';

interface Breakpoint {
  isMobile: boolean;
  isDesktop: boolean;
  isWide: boolean;
}

const DESKTOP_QUERY = '(min-width: 768px)';
const WIDE_QUERY = '(min-width: 1280px)';

export function useBreakpoint(): Breakpoint {
  const [state, setState] = useState<Breakpoint>(() => ({
    isMobile: typeof window !== 'undefined' ? !window.matchMedia(DESKTOP_QUERY).matches : true,
    isDesktop: typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : false,
    isWide: typeof window !== 'undefined' ? window.matchMedia(WIDE_QUERY).matches : false,
  }));

  useEffect(() => {
    const desktopMql = window.matchMedia(DESKTOP_QUERY);
    const wideMql = window.matchMedia(WIDE_QUERY);

    const update = () => {
      setState({
        isMobile: !desktopMql.matches,
        isDesktop: desktopMql.matches,
        isWide: wideMql.matches,
      });
    };

    desktopMql.addEventListener('change', update);
    wideMql.addEventListener('change', update);
    return () => {
      desktopMql.removeEventListener('change', update);
      wideMql.removeEventListener('change', update);
    };
  }, []);

  return state;
}
