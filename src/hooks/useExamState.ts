'use client';

import { useState, useCallback } from 'react';
import { ExamType, Question } from '@/lib/types';
import { getQuestionsByExamType } from '@/lib/questions';
import { EXAM_CONFIG } from '@/lib/constants';
import { gradeExam } from '@/lib/scoring';
import { saveExamResult } from '@/lib/storage';

export function useExamState(examType: ExamType, round?: number) {
  const config = EXAM_CONFIG[examType];
  const [questions] = useState<Question[]>(() => {
    if (round === -1) {
      // 랜덤 모드: 전체 문제에서 시험 문항수만큼 랜덤 선택
      const all = getQuestionsByExamType(examType);
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, config.totalQuestions);
    }
    return getQuestionsByExamType(examType, round);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.values(answers).filter(v => v !== null).length;

  const setAnswer = useCallback((questionId: string, choice: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  }, []);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  }, [totalQuestions]);

  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const submit = useCallback((elapsed: number) => {
    const result = gradeExam(examType, questions, answers, elapsed);
    saveExamResult(result);
    setIsSubmitted(true);
    return result;
  }, [examType, questions, answers]);

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    answers,
    isSubmitted,
    timeLimit: config.timeLimit,
    setAnswer,
    goTo,
    next,
    prev,
    submit,
  };
}
