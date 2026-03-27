'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ExamType, Bookmark } from '@/lib/types';
import { EXAM_CONFIG, getSubjectById } from '@/lib/constants';
import { useExamState } from '@/hooks/useExamState';
import { useTimer } from '@/hooks/useTimer';
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/storage';
import Timer from '@/components/exam/Timer';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNav from '@/components/exam/QuestionNav';
import Modal from '@/components/common/Modal';

export default function ExamTestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = params.type as ExamType;
  const config = EXAM_CONFIG[examType];

  const roundParam = searchParams.get('round');
  const round = roundParam === 'random' ? -1 : roundParam !== null ? parseInt(roundParam, 10) : undefined;

  const {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    answers,
    isSubmitted,
    timeLimit,
    setAnswer,
    goTo,
    next,
    prev,
    submit,
  } = useExamState(examType, round);

  const handleTimeUp = useCallback(() => {
    if (!isSubmitted) {
      const elapsed = timeLimit;
      submit(elapsed);
      router.push(`/exam/${examType}/result`);
    }
  }, [isSubmitted, timeLimit, submit, router, examType]);

  const { remaining, isRunning, start, getElapsed } = useTimer(timeLimit, handleTimeUp);
  const [showNav, setShowNav] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const startedRef = useRef(false);

  const toggleBookmark = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    if (bookmarkedIds.has(questionId)) {
      removeBookmark(questionId);
      setBookmarkedIds(prev => { const n = new Set(prev); n.delete(questionId); return n; });
    } else {
      const prefix = question.id.split('-')[0];
      const subjectIdMap: Record<string, string> = { ri: 'real-estate-intro', cl: 'civil-law', bl: 'broker-law', pl: 'public-law', tl: 'tax-law' };
      const subjectId = subjectIdMap[prefix] as Bookmark['subjectId'];
      const subject = getSubjectById(subjectId);
      addBookmark({ questionId, subjectId, subjectName: subject.name, question, addedAt: new Date().toISOString() });
      setBookmarkedIds(prev => new Set(prev).add(questionId));
    }
  };

  // 스와이프 처리
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  useEffect(() => {
    if (!startedRef.current) {
      start();
      startedRef.current = true;
    }
  }, [start]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isSubmitted) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isSubmitted]);

  const handleSubmit = () => {
    const elapsed = getElapsed();
    submit(elapsed);
    router.push(`/exam/${examType}/result`);
  };

  if (!config || !currentQuestion) return null;

  const unanswered = totalQuestions - answeredCount;

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* 상단 sticky 바 */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Timer remaining={remaining} />
          <div className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{currentIndex + 1}</span>
            <span> / {totalQuestions}</span>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full"
          >
            제출
          </button>
        </div>
        {/* 진행도 바 */}
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 문제 영역 */}
      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* 북마크 버튼 */}
          <div className="flex justify-end mb-1">
            <button
              onClick={() => toggleBookmark(currentQuestion.id)}
              className="text-lg p-1"
            >
              {bookmarkedIds.has(currentQuestion.id) ? '🔖' : '🏷️'}
            </button>
          </div>
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedChoice={answers[currentQuestion.id] ?? null}
            onSelect={(choice) => setAnswer(currentQuestion.id, choice)}
          />
        </div>
      </div>

      {/* 하단 sticky 바 */}
      <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 disabled:opacity-30 active:bg-gray-200 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={() => setShowNav(true)}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 active:bg-blue-100 transition-colors"
          >
            {currentIndex + 1}/{totalQuestions}
          </button>
          <button
            onClick={next}
            disabled={currentIndex === totalQuestions - 1}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 disabled:opacity-30 active:bg-gray-200 transition-colors"
          >
            다음 →
          </button>
        </div>
      </div>

      {/* 문항 네비게이션 바텀시트 */}
      {showNav && (
        <QuestionNav
          totalQuestions={totalQuestions}
          currentIndex={currentIndex}
          answers={answers}
          questionIds={questions.map(q => q.id)}
          onSelect={goTo}
          onClose={() => setShowNav(false)}
        />
      )}

      {/* 제출 확인 모달 */}
      <Modal
        isOpen={showSubmitModal}
        title="시험을 제출하시겠습니까?"
        onConfirm={handleSubmit}
        onCancel={() => setShowSubmitModal(false)}
        confirmText="제출하기"
        confirmColor="blue"
      >
        {unanswered > 0 ? (
          <p>
            아직 <span className="font-bold text-red-600">{unanswered}문항</span>이
            미응답입니다. 제출하면 되돌릴 수 없습니다.
          </p>
        ) : (
          <p>모든 문항을 풀었습니다. 제출하면 되돌릴 수 없습니다.</p>
        )}
      </Modal>
    </div>
  );
}
