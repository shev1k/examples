import { useEffect, useRef } from 'react';

const useDidUpdate = (fn: (...args: any[]) => any, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    // ignore first render
    if (didMount.current) {
      const cleanup = fn();
      if (typeof cleanup === 'function') {
        return cleanup;
      }
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useDidUpdate;
