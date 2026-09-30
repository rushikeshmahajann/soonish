import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * false during SSR and the hydration render, true after — without a
 * setState-in-effect round trip. For things that only exist in the browser
 * (portals to document.body, window.location).
 */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
