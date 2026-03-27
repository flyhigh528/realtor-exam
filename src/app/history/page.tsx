'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { ExamHistory } from '@/lib/types';
import { getHistory, clearHistory } from '@/lib/storage';
import { EXAM_CONFIG } from '@/lib/constants';

export default function HistoryPage() {
  const [history, setHistory] = useState<ExamHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}분 ${s}초`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 통계 계산
  const totalExams = history.length;
  const passCount = history.filter(h => h.isPassed).length;
  const avgScore = totalExams > 0
    ? Math.round(history.reduce((sum, h) => sum + h.totalScore, 0) / totalExams * 10) / 10
    : 0;
  const bestScore = totalExams > 0
    ? Math.max(...history.map(h => h.totalScore))
    : 0;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Link href="/" className="text-sm text-gray-500 mb-4 inline-block">← 홈으로</Link>
        <h1 className="text-xl font-bold text-gray-900 mb-4">성적 히스토리</h1>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500 text-sm">아직 응시 기록이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">모의시험을 풀면 자동으로 기록됩니다.</p>
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalExams}</div>
                <div className="text-xs text-gray-500 mt-1">총 응시</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalExams > 0 ? Math.round(passCount / totalExams * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">합격률</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-purple-600">{avgScore}</div>
                <div className="text-xs text-gray-500 mt-1">평균 점수</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-amber-600">{bestScore}</div>
                <div className="text-xs text-gray-500 mt-1">최고 점수</div>
              </div>
            </div>

            {/* 점수 추이 차트 (간이 바 차트) */}
            {history.length > 1 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">점수 추이</h3>
                <div className="flex items-end gap-1 h-24">
                  {[...history].reverse().slice(-10).map((h, i) => {
                    const height = Math.max(4, (h.totalScore / 100) * 96);
                    return (
                      <div key={h.id} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t-sm transition-all ${
                            h.isPassed ? 'bg-green-400' : 'bg-red-400'
                          }`}
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-[10px] text-gray-400">{Math.round(h.totalScore)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 border-t border-gray-100 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>이전</span>
                    <span>최근</span>
                  </div>
                </div>
              </div>
            )}

            {/* 기록 목록 */}
            <div className="space-y-2">
              {history.map((h) => {
                const config = EXAM_CONFIG[h.examType];
                return (
                  <div key={h.id} className={`bg-white rounded-xl p-4 border ${h.isPassed ? 'border-gray-100' : 'border-red-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          h.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {h.isPassed ? '합' : '불'}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{config?.label}</div>
                          <div className="text-xs text-gray-400">{formatDate(h.completedAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${h.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                          {h.totalScore}점
                        </div>
                        <div className="text-xs text-gray-400">{formatTime(h.timeSpent)}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {h.subjectResults.map(sr => (
                        <div key={sr.subjectId} className="flex-1">
                          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${sr.isPassed ? 'bg-green-400' : 'bg-red-400'}`}
                              style={{ width: `${sr.score}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 text-center">{sr.score}점</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (confirm('모든 성적 기록을 삭제하시겠습니까?')) {
                  clearHistory();
                  setHistory([]);
                }
              }}
              className="w-full mt-6 py-3 rounded-xl text-xs text-gray-400 active:text-gray-600"
            >
              전체 기록 삭제
            </button>
          </>
        )}
      </main>
    </>
  );
}
