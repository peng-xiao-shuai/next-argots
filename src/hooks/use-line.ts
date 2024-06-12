import { useEffect } from 'react';
export const useLine = (cb: (e: Event) => void) => {
  useEffect(() => {
    window.addEventListener('online', cb);
    window.addEventListener('offline', cb);

    return () => {
      window.removeEventListener('offline', cb);
      window.removeEventListener('online', cb);
    };
  }, [cb]);
};
