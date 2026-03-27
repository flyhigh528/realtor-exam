'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useWrongAnswers } from '@/hooks/useWrongAnswers';
import { SUBJECTS } from '@/lib/constants';
import { SubjectId } from '@/lib/types';
import QuestionCard from '@/components/exam/QuestionCard';

export default function WrongAnswersPage() {
  const { wrongAnswers, remove, markReviewed, clear } = useWrongAnswers();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedSubject === 'all'
    ? wrongAnswers
    : wrongAnswers.filter(w => w.subjectId === selectedSubject);

  const subjectCounts = SUBJECTS.reduce((acc, s) => {
    acc[s.id] = wrongAnswers.filter(w => w.subjectId === s.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">오답노트</h1>

        {wrongAnswers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500 text-sm">아직 저장된 오답이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">시험 후 결과 화면에서 오답을 저장할 수 있습니다.</p>
          </div>
        ) : (
          <>
            {/* 과목 필터 칩 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSubject === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                전체 ({wrongAnswers.length})
              </button>
              {SUBJECTS.map(s => (
                subjectCounts[s.id] > 0 && (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSubject === s.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s.name.split(' ')[0]} ({subjectCounts[s.id]})
                  </button>
                )
              ))}
            </div>

            {/* 오답 목록 */}
            <div className="space-y-3">
              {filtered.map((wrong) => {
                const isExpanded = expandedId === wrong.questionId;
                return (
                  <div key={wrong.questionId} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : wrong.questionId)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">{wrong.question.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{wrong.subjectName}</span>
                          {wrong.reviewCount > 0 && (
                            <span className="text-xs text-green-600">복습 {wrong.reviewCount}회</span>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs shrink-0 ml-2">
                        {isExpanded ? '접기' : '보기'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-50">
                        <QuestionCard
                          question={wrong.question}
                          questionIndex={0}
                          selectedChoice={wrong.selectedChoice}
                          onSelect={() => {}}
                          disabled
                          showResult
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              markReviewed(wrong.questionId);
                            }}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-green-50 text-green-700 active:bg-green-100"
                          >
                            복습 완료
                          </button>
                          <button
                            onClick={() => {
                              remove(wrong.questionId);
                              setExpandedId(null);
                            }}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-700 active:bg-red-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {wrongAnswers.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('모든 오답을 삭제하시겠습니까?')) {
                    clear();
                  }
                }}
                className="w-full mt-6 py-3 rounded-xl text-xs text-gray-400 active:text-gray-600"
              >
                전체 삭제
              </button>
            )}
          </>
        )}
      </main>
    </>
  );
}
