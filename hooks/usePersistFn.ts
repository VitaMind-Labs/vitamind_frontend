import { useCallback, useEffect, useRef } from "react";

type noop = (...args: never[]) => unknown;

export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const persistFn = useCallback((...args: Parameters<T>) => fnRef.current(...args), []);
  return persistFn as T;
}
