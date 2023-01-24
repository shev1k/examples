import { useRef, useEffect } from 'react';

type Fn = (...args: any[]) => void;

/**
 *
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */
const useDebounceFn = (fn: Fn, delay = 500) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      fn(...args);
    }, delay);
    clearTimeout(timer.current);
    timer.current = newTimer;
  }) as Fn;

  return debouncedFunction;
};

export default useDebounceFn;
