'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Question } from '@/lib/types';
import { getWrongAnswers } from '@/lib/storage';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNav from '@/components/exam/QuestionNav';
import Modal from '@/components/common/Modal';

function WrongAnswersTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get('subject') || 'all';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const wrongAnswers = getWrongAnswers();
    const filtered = subjectFilter === 'all'
      ? wrongAnswers
      : wrongAnswers.filter(w => w.subjectId === subjectFilter);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.map(w => w.question));
  }, [subjectFilter]);

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

  if (questions.length === 0) {
    return (
      <div className="flex flex-col h-dvh bg-gray-50 dark:bg-gray-900 items-center justify-center px-4">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">저장된 오답이 없습니다</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-pink-600 font-semibold">
          돌아가기
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter(v => v !== null).length;
  const totalQuestions = questions.length;
  const correctCount = isSubmitted
    ? questions.filter(q => answers[q.id] === q.answer).length
    : 0;

  return (
    <div className="flex flex-col h-dvh bg-gray-50 dark:bg-gray-900">
      {/* 상단 바 */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-orange-500">오답 재시험</span>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100">{currentIndex + 1}</span>
            <span> / {totalQuestions}</span>
          </div>
          {!isSubmitted ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-full"
            >
              채점
            </button>
          ) : (
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-full">
              {correctCount}/{totalQuestions} 정답
            </span>
          )}
        </div>
        {!isSubmitted && (
          <div className="max-w-lg mx-auto mt-2">
            <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 문제 영역 */}
      <div className="flex-1 overflow-y-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedChoice={answers[currentQuestion.id] ?? null}
            onSelect={(choice) => {
              if (!isSubmitted) setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
            }}
            disabled={isSubmitted}
            showResult={isSubmitted}
          />
        </div>
      </div>

      {/* 하단 바 */}
      <div className="sticky bottom-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30"
          >
            ← 이전
          </button>
          <button
            onClick={() => setShowNav(true)}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600"
          >
            {currentIndex + 1}/{totalQuestions}
          </button>
          {isSubmitted && currentIndex === totalQuestions - 1 ? (
            <button
              onClick={() => router.push('/wrong-answers')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-orange-500 text-white"
            >
              완료
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(i => Math.min(totalQuestions - 1, i + 1))}
              disabled={currentIndex === totalQuestions - 1}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30"
            >
              다음 →
            </button>
          )}
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
        onConfirm={() => { setIsSubmitted(true); setShowSubmitModal(false); setCurrentIndex(0); }}
        onCancel={() => setShowSubmitModal(false)}
        confirmText="채점하기"
      >
        <p>{answeredCount}/{totalQuestions}문항 응답 완료</p>
      </Modal>
    </div>
  );
}

export default function WrongAnswersTestPage() {
  return (
    <Suspense fallback={<div className="flex h-dvh items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="text-gray-400 text-sm">로딩 중...</div></div>}>
      <WrongAnswersTest />
    </Suspense>
  );
}
