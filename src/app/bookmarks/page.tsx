'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Bookmark, SubjectId } from '@/lib/types';
import { getBookmarks, removeBookmark } from '@/lib/storage';
import { SUBJECTS } from '@/lib/constants';
import QuestionCard from '@/components/exam/QuestionCard';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const filtered = selectedSubject === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.subjectId === selectedSubject);

  const subjectCounts = SUBJECTS.reduce((acc, s) => {
    acc[s.id] = bookmarks.filter(b => b.subjectId === s.id).length;
    return acc;
  }, {} as Record<string, number>);

  const handleRemove = (questionId: string) => {
    removeBookmark(questionId);
    setBookmarks(getBookmarks());
    setExpandedId(null);
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">북마크</h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔖</div>
            <p className="text-gray-500 text-sm">저장된 북마크가 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">시험 중 문제를 북마크하여 나중에 복습하세요.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSubject === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                전체 ({bookmarks.length})
              </button>
              {SUBJECTS.map(s => (
                subjectCounts[s.id] > 0 && (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSubject === s.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s.name.split(' ')[0]} ({subjectCounts[s.id]})
                  </button>
                )
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map((bm) => {
                const isExpanded = expandedId === bm.questionId;
                return (
                  <div key={bm.questionId} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : bm.questionId)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">{bm.question.text}</p>
                        <span className="text-xs text-gray-400">{bm.subjectName}</span>
                      </div>
                      <span className="text-amber-500 text-lg shrink-0 ml-2">🔖</span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-50">
                        <QuestionCard
                          question={bm.question}
                          questionIndex={0}
                          selectedChoice={null}
                          onSelect={() => {}}
                          disabled
                          showResult
                        />
                        <button
                          onClick={() => handleRemove(bm.questionId)}
                          className="w-full mt-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-700 active:bg-red-100"
                        >
                          북마크 삭제
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
