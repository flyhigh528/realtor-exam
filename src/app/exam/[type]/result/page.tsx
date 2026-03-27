'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExamType, ExamResult, WrongAnswer } from '@/lib/types';
import { getExamResult, addWrongAnswers, addHistory } from '@/lib/storage';
import { getSubjectById } from '@/lib/constants';
import QuestionCard from '@/components/exam/QuestionCard';

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const examType = params.type as ExamType;
  const [result, setResult] = useState<ExamResult | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [wrongSaved, setWrongSaved] = useState(false);

  useEffect(() => {
    const data = getExamResult();
    if (!data) {
      router.push('/');
      return;
    }
    setResult(data);
    addHistory(data);
  }, [router]);

  if (!result) return null;

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSaveWrong = () => {
    const wrongAnswers: WrongAnswer[] = result.answers
      .filter(a => !a.isCorrect && a.selectedChoice !== null)
      .map(a => {
        const question = result.questions.find(q => q.id === a.questionId)!;
        const prefix = question.id.split('-')[0];
        const subjectIdMap: Record<string, string> = {
          ri: 'real-estate-intro',
          cl: 'civil-law',
          bl: 'broker-law',
          pl: 'public-law',
          tl: 'tax-law',
        };
        const subjectId = subjectIdMap[prefix] as WrongAnswer['subjectId'];
        const subject = getSubjectById(subjectId);
        return {
          questionId: question.id,
          subjectId,
          subjectName: subject.name,
          question,
          selectedChoice: a.selectedChoice!,
          examDate: result.completedAt,
          reviewCount: 0,
        };
      });
    addWrongAnswers(wrongAnswers);
    setWrongSaved(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}분 ${s}초`;
  };

  const wrongCount = result.answers.filter(a => !a.isCorrect).length;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* 결과 헤더 */}
      <div className={`${result.isPassed ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-8`}>
        <div className="max-w-lg mx-auto text-center">
          <div className="text-4xl mb-2">{result.isPassed ? '🎉' : '😢'}</div>
          <h1 className="text-2xl font-bold mb-1">
            {result.isPassed ? '합격' : '불합격'}
          </h1>
          <p className="text-white/80 text-sm">
            평균 {result.totalScore}점 | 소요시간 {formatTime(result.timeSpent)}
          </p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* 과목별 점수 */}
        <div className="space-y-3 mb-6">
          {result.subjectResults.map((sr) => (
            <div
              key={sr.subjectId}
              className={`bg-white rounded-xl p-4 border ${
                sr.isPassed ? 'border-gray-100' : 'border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{sr.subjectName}</span>
                <span className={`text-sm font-bold ${sr.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {sr.score}점
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{sr.correctCount}/{sr.totalQuestions} 정답</span>
                <span className={`font-semibold ${sr.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {sr.isPassed ? '과락 통과' : '과락'}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${sr.isPassed ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${sr.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 오답 저장 */}
        {wrongCount > 0 && (
          <button
            onClick={handleSaveWrong}
            disabled={wrongSaved}
            className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-colors ${
              wrongSaved
                ? 'bg-gray-100 text-gray-400'
                : 'bg-amber-500 text-white active:bg-amber-600'
            }`}
          >
            {wrongSaved
              ? `오답 ${wrongCount}문항 저장 완료`
              : `오답 ${wrongCount}문항 오답노트에 저장`}
          </button>
        )}

        {/* 문제별 리뷰 */}
        <h2 className="text-base font-bold text-gray-900 mb-3">문제별 리뷰</h2>
        <div className="space-y-2">
          {result.questions.map((question, idx) => {
            const answer = result.answers[idx];
            const isExpanded = expandedQuestions.has(question.id);
            const isCorrect = answer.isCorrect;

            return (
              <div key={question.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 line-clamp-1">
                      {question.text}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0 ml-2">
                    {isExpanded ? '접기' : '펼치기'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <QuestionCard
                      question={question}
                      questionIndex={idx}
                      selectedChoice={answer.selectedChoice}
                      onSelect={() => {}}
                      disabled
                      showResult
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 space-y-3 pb-8">
          <Link
            href={`/exam/${examType}`}
            className="block w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white text-center active:bg-blue-700"
          >
            다시 시험보기
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 text-center active:bg-gray-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
