import { useCallback, useRef, useEffect } from "react";

type DebouncedFunction<T extends unknown[]> = (
  ...args: T
) => void | Promise<void>;

export function useDebounce<T extends unknown[]>(
  callback: DebouncedFunction<T>,
  delay: number
): DebouncedFunction<T> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
