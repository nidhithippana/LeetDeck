import { useEffect } from 'react';

const BASE_TITLE = 'LeetDeck';

/**
 * Sets `document.title` to "<prefix> · LeetDeck" while the component is mounted,
 * and restores the base title on unmount.
 *
 * Pass `null` for the bare base title.
 */
export function usePageTitle(prefix: string | null) {
  useEffect(() => {
    const previous = document.title;
    document.title = prefix ? `${prefix} · ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = previous;
    };
  }, [prefix]);
}
