import { useEffect } from 'react';

/**
 * Calls `onEscape` whenever the Escape key is pressed.
 * Only active when `enabled` is true (e.g. when a modal is open).
 */
export function useEscapeKey(onEscape: () => void, enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onEscape();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [enabled, onEscape]);
}
