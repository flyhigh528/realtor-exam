'use client';

import { useState, useEffect, useCallback } from 'react';
import { WrongAnswer, SubjectId } from '@/lib/types';
import { getWrongAnswers, saveWrongAnswers, addWrongAnswers as addToStorage, removeWrongAnswer as removeFromStorage, markReviewed as markInStorage } from '@/lib/storage';

export function useWrongAnswers() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  useEffect(() => {
    setWrongAnswers(getWrongAnswers());
  }, []);

  const refresh = useCallback(() => {
    setWrongAnswers(getWrongAnswers());
  }, []);

  const add = useCallback((newWrongs: WrongAnswer[]) => {
    addToStorage(newWrongs);
    refresh();
  }, [refresh]);

  const remove = useCallback((questionId: string) => {
    removeFromStorage(questionId);
    refresh();
  }, [refresh]);

  const markReviewed = useCallback((questionId: string) => {
    markInStorage(questionId);
    refresh();
  }, [refresh]);

  const getBySubject = useCallback((subjectId: SubjectId) => {
    return wrongAnswers.filter(w => w.subjectId === subjectId);
  }, [wrongAnswers]);

  const clear = useCallback(() => {
    saveWrongAnswers([]);
    refresh();
  }, [refresh]);

  return { wrongAnswers, add, remove, markReviewed, getBySubject, clear, refresh };
}
