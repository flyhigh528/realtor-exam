'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SubjectId, Question } from '@/lib/types';
import { getSubjectById } from '@/lib/constants';
import { getRandomQuestions } from '@/lib/questions';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNav from '@/components/exam/QuestionNav';
import { useRef } from 'react';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = params.subject as SubjectId;
  const subject = getSubjectById(subjectId);

  const count = parseInt(searchParams.get('count') || '20', 10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [showNav, setShowNav] = useState(false);
  const [done, setDone] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestions(getRandomQuestions(subjectId, count));
  }, [subjectId, count]);

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
  const isAnswered = answered.has(currentQuestion.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const totalQuestions = questions.length;
  const answeredCount = answered.size;
  const correctCount = questions.filter(q => answered.has(q.id) && answers[q.id] === q.answer).length;

  const handleSelect = (choice: number) => {
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }));
    setAnswered(prev => new Set(prev).add(currentQuestion.id));

    // 마지막 문제 답변 완료 시 완료 처리
    if (isLastQuestion && answered.size === totalQuestions - 1) {
      setTimeout(() => setDone(true), 1500);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1);
      scrollRef.current?.scrollTo({ top: 0 });
    }
  };

  // 완료 화면
  if (done) {
    const wrongQuestions = questions.filter(q => answers[q.id] !== q.answer);
    return (
      <div className="flex flex-col h-dvh bg-gray-50">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{subject.name}</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              학습 완료
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 mb-1">{correctCount}<span className="text-2xl text-gray-400">/{totalQuestions}</span></p>
              <p className="text-sm text-gray-500">정답</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-bold text-green-700">{correctCount}</p>
                  <p className="text-green-600 text-xs mt-0.5">정답</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="font-bold text-red-700">{totalQuestions - correctCount}</p>
                  <p className="text-red-600 text-xs mt-0.5">오답</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="font-bold text-blue-700">{Math.round(correctCount / totalQuestions * 100)}%</p>
                  <p className="text-blue-600 text-xs mt-0.5">정답률</p>
                </div>
              </div>
            </div>

            {wrongQuestions.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-sm font-semibold text-gray-800 mb-3">틀린 문제 ({wrongQuestions.length}개)</p>
                <div className="space-y-2">
                  {wrongQuestions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold shrink-0">✗</span>
                      <p className="text-gray-700 line-clamp-2">{q.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 safe-bottom">
          <div className="max-w-lg mx-auto px-4 py-3 flex gap-3">
            <button
              onClick={() => router.push(`/practice/${subjectId}`)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 active:bg-gray-200"
            >
              다시 설정
            </button>
            <button
              onClick={() => {
                setQuestions(getRandomQuestions(subjectId, count));
                setAnswers({});
                setAnswered(new Set());
                setCurrentIndex(0);
                setDone(false);
              }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white active:bg-green-700"
            >
              다시 학습
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* 상단 바 */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{subject.name}</span>
          <div className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{currentIndex + 1}</span>
            <span> / {totalQuestions}</span>
          </div>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            학습 모드
          </span>
        </div>
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 문제 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedChoice={answers[currentQuestion.id] ?? null}
            onSelect={handleSelect}
            disabled={isAnswered}
            showResult={isAnswered}
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
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-green-50 text-green-600"
          >
            {currentIndex + 1}/{totalQuestions}
          </button>
          {isLastQuestion && isAnswered ? (
            <button
              onClick={() => setDone(true)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white active:bg-green-700"
            >
              학습 완료
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered || isLastQuestion}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 disabled:opacity-30 active:bg-gray-200"
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
    </div>
  );
}
