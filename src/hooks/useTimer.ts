'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(timeLimit: number, onTimeUp: () => void) {
  const [remaining, setRemaining] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const onTimeUpRef = useRef(onTimeUp);

  onTimeUpRef.current = onTimeUp;

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (isRunning) {
      elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      setIsRunning(false);
    }
  }, [isRunning]);

  const getElapsed = useCallback(() => {
    if (isRunning) {
      return elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
    }
    return elapsedBeforePauseRef.current;
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const elapsed = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, timeLimit - elapsed);
      setRemaining(Math.ceil(left));

      if (left <= 0) {
        setIsRunning(false);
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLimit]);

  return { remaining, isRunning, start, pause, getElapsed };
}
