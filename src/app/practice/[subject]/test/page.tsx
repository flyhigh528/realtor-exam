'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SubjectId, Question } from '@/lib/types';
import { getSubjectById } from '@/lib/constants';
import { getRandomQuestions } from '@/lib/questions';
import { useTimer } from '@/hooks/useTimer';
import Timer from '@/components/exam/Timer';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNav from '@/components/exam/QuestionNav';
import Modal from '@/components/common/Modal';

export default function PracticeTestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = params.subject as SubjectId;
  const subject = getSubjectById(subjectId);

  const count = parseInt(searchParams.get('count') || '20', 10);
  const timerEnabled = searchParams.get('timer') === '1';
  const timeLimit = timerEnabled ? Math.round(count * 1.25) * 60 : 0;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const startedRef = useRef(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(subjectId, count));
  }, [subjectId, count]);

  const handleTimeUp = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const { remaining, start } = useTimer(
    timeLimit || 999999,
    handleTimeUp
  );

  useEffect(() => {
    if (timerEnabled && !startedRef.current && questions.length > 0) {
      start();
      startedRef.current = true;
    }
  }, [timerEnabled, start, questions.length]);

  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
      else if (diff < 0 && currentIndex > 0) setCurrentIndex(i => i - 1);
    }
  };

  if (!subject || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter(v => v !== null).length;
  const totalQuestions = questions.length;
  const correctCount = isSubmitted
    ? questions.filter(q => answers[q.id] === q.answer).length
    : 0;

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* 상단 바 */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {timerEnabled && !isSubmitted ? (
            <Timer remaining={remaining} />
          ) : (
            <span className="text-sm font-medium text-gray-500">{subject.name}</span>
          )}
          <div className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{currentIndex + 1}</span>
            <span> / {totalQuestions}</span>
          </div>
          {!isSubmitted ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full"
            >
              채점
            </button>
          ) : (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              {correctCount}/{totalQuestions} 정답
            </span>
          )}
        </div>
        {!isSubmitted && (
          <div className="max-w-lg mx-auto mt-2">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 문제 영역 */}
      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedChoice={answers[currentQuestion.id] ?? null}
            onSelect={(choice) => {
              if (!isSubmitted) {
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
              }
            }}
            disabled={isSubmitted}
            showResult={isSubmitted}
          />
        </div>
      </div>

      {/* 하단 바 */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 disabled:opacity-30 active:bg-gray-200"
          >
            ← 이전
          </button>
          <button
            onClick={() => setShowNav(true)}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600"
          >
            {currentIndex + 1}/{totalQuestions}
          </button>
          <button
            onClick={() => setCurrentIndex(i => Math.min(totalQuestions - 1, i + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 disabled:opacity-30 active:bg-gray-200"
          >
            다음 →
          </button>
        </div>
      </div>

      {showNav && (
        <QuestionNav
          totalQuestions={totalQuestions}
          currentIndex={currentIndex}
          answers={answers}
          questionIds={questions.map(q => q.id)}
          onSelect={(i) => setCurrentIndex(i)}
          onClose={() => setShowNav(false)}
        />
      )}

      <Modal
        isOpen={showSubmitModal}
        title="채점하시겠습니까?"
        onConfirm={() => {
          setIsSubmitted(true);
          setShowSubmitModal(false);
          setCurrentIndex(0);
        }}
        onCancel={() => setShowSubmitModal(false)}
        confirmText="채점하기"
      >
        <p>{answeredCount}/{totalQuestions}문항 응답 완료</p>
      </Modal>
    </div>
  );
}
