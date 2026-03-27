'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { EXAM_CONFIG, getSubjectsByExamType } from '@/lib/constants';
import { ExamType } from '@/lib/types';
import { getAvailableRounds } from '@/lib/questions';

export default function ExamInfoPage() {
  const params = useParams();
  const router = useRouter();
  const examType = params.type as ExamType;
  const config = EXAM_CONFIG[examType];
  const [selectedRound, setSelectedRound] = useState(0);

  if (!config) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 text-center">
          <p className="text-gray-500">잘못된 시험 유형입니다.</p>
          <Link href="/" className="text-blue-600 text-sm mt-2 inline-block">홈으로 돌아가기</Link>
        </main>
      </>
    );
  }

  const subjects = getSubjectsByExamType(examType);
  const minutes = config.timeLimit / 60;
  const maxRounds = Math.max(...config.subjects.map(s => getAvailableRounds(s)));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Link href="/" className="text-sm text-gray-500 mb-4 inline-block">← 홈으로</Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{config.label}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{config.description}</p>

          {/* 회차 선택 */}
          {maxRounds > 1 && (
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-2">회차 선택</label>
              <div className="flex gap-2">
                {Array.from({ length: maxRounds }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRound(i)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      selectedRound === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {i + 1}회
                  </button>
                ))}
                <button
                  onClick={() => setSelectedRound(-1)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    selectedRound === -1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  랜덤
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">시험 과목</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{subjects.length}과목</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">총 문항 수</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{config.totalQuestions}문항</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">시험 시간</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{minutes}분</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">문항당 배점</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">2.5점</span>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">시험 과목</h3>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-gray-700 dark:text-gray-300">{subject.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">{subject.questionCount}문항</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 mb-6 border border-amber-100 dark:border-amber-800">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">유의사항</h3>
          <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
            <li>• 시험 시작 후 타이머가 작동합니다</li>
            <li>• 시간 초과 시 자동으로 제출됩니다</li>
            <li>• 과목당 40점 이상 + 평균 60점 이상 시 합격</li>
            <li>• 브라우저를 닫으면 진행 상황이 초기화됩니다</li>
          </ul>
        </div>

        <button
          onClick={() => {
            const roundParam = selectedRound >= 0 ? `?round=${selectedRound}` : '?round=random';
            router.push(`/exam/${examType}/test${roundParam}`);
          }}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl text-base active:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          시험 시작하기
        </button>
      </main>
    </>
  );
}
