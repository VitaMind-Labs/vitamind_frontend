import { useRef } from "react";
import { usePersistFn } from "./usePersistFn";

export interface UseCompositionReturn<T extends HTMLInputElement | HTMLTextAreaElement> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<T extends HTMLInputElement | HTMLTextAreaElement> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

type TimerResponse = ReturnType<typeof setTimeout>;

function useRefMethod<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const persistFn = useRef<T>(null as unknown as T);
  if (!persistFn.current) {
    persistFn.current = ((...args: any[]) => fnRef.current(...args)) as T;
  }
  return persistFn.current;
}

export function useComposition<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(
  options: UseCompositionOptions<T> = {}
): UseCompositionReturn<T> {
  const composingRef = useRef(false);
  const composingTimerRef = useRef<TimerResponse>(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const isComposing = useRefMethod(() => composingRef.current);

  const onCompositionStart: React.CompositionEventHandler<T> = usePersistFn((e) => {
    composingRef.current = true;
    if (composingTimerRef.current) {
      clearTimeout(composingTimerRef.current);
      composingTimerRef.current = undefined;
    }
    optionsRef.current.onCompositionStart?.(e);
  });

  const onCompositionEnd: React.CompositionEventHandler<T> = usePersistFn((e) => {
    if (composingTimerRef.current) {
      clearTimeout(composingTimerRef.current);
    }
    composingTimerRef.current = setTimeout(() => {
      composingRef.current = false;
    }, 0);
    optionsRef.current.onCompositionEnd?.(e);
  });

  const onKeyDown: React.KeyboardEventHandler<T> = usePersistFn((e) => {
    if (composingRef.current && (e.key === "Enter" || e.key === "Escape")) {
      e.preventDefault();
      return;
    }
    optionsRef.current.onKeyDown?.(e);
  });

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}
