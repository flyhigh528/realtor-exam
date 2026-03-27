'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { SubjectId } from '@/lib/types';
import { getSubjectById } from '@/lib/constants';

const questionCounts = [10, 20, 40];

export default function PracticeSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as SubjectId;
  const subject = getSubjectById(subjectId);

  const [count, setCount] = useState(20);
  const [timerEnabled, setTimerEnabled] = useState(false);

  if (!subject) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 text-center">
          <p className="text-gray-500">잘못된 과목입니다.</p>
        </main>
      </>
    );
  }

  const handleStart = () => {
    const query = new URLSearchParams({ count: String(count), timer: timerEnabled ? '1' : '0' });
    router.push(`/practice/${subjectId}/test?${query.toString()}`);
  };

  const handleLearn = () => {
    const query = new URLSearchParams({ count: String(count) });
    router.push(`/practice/${subjectId}/learn?${query.toString()}`);
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Link href="/practice" className="text-sm text-gray-500 mb-4 inline-block">← 과목 선택</Link>

        <h1 className="text-xl font-bold text-gray-900 mb-1">{subject.name}</h1>
        <p className="text-sm text-gray-500 mb-6">연습 모드 설정</p>

        <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-6">
          {/* 문항 수 선택 */}
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-3">문항 수</label>
            <div className="flex gap-2">
              {questionCounts.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    count === n
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  }`}
                >
                  {n}문항
                </button>
              ))}
            </div>
          </div>

          {/* 타이머 설정 */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-800">타이머</span>
              <p className="text-xs text-gray-500 mt-0.5">
                {timerEnabled ? `${Math.round(count * 1.25)}분` : '시간제한 없음'}
              </p>
            </div>
            <button
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                timerEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  timerEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-6 bg-blue-600 text-white font-semibold py-4 rounded-xl text-base active:bg-blue-700 transition-colors shadow-lg"
        >
          연습 시작
        </button>
        <button
          onClick={handleLearn}
          className="w-full mt-3 bg-green-600 text-white font-semibold py-4 rounded-xl text-base active:bg-green-700 transition-colors"
        >
          학습 모드
        </button>
      </main>
    </>
  );
}
