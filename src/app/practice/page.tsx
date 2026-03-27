import Link from 'next/link';
import Header from '@/components/layout/Header';
import { SUBJECTS } from '@/lib/constants';

const colors: Record<string, string> = {
  'real-estate-intro': 'bg-blue-50 border-blue-100 text-blue-700',
  'civil-law': 'bg-emerald-50 border-emerald-100 text-emerald-700',
  'broker-law': 'bg-purple-50 border-purple-100 text-purple-700',
  'public-law': 'bg-amber-50 border-amber-100 text-amber-700',
  'tax-law': 'bg-rose-50 border-rose-100 text-rose-700',
};

const examLabels: Record<string, string> = {
  first: '1차',
  second: '2차',
};

export default function PracticePage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Link href="/" className="text-sm text-gray-500 mb-4 inline-block">← 홈으로</Link>
        <h1 className="text-xl font-bold text-gray-900 mb-2">과목별 연습</h1>
        <p className="text-sm text-gray-500 mb-6">원하는 과목을 선택하여 연습하세요</p>

        <div className="space-y-3">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={`/practice/${subject.id}`}
              className={`block rounded-xl p-4 border ${colors[subject.id]} active:opacity-80 transition-opacity`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium opacity-70">
                    {examLabels[subject.examType]} 시험
                  </span>
                  <h2 className="text-sm font-bold mt-0.5">{subject.name}</h2>
                  <p className="text-xs opacity-70 mt-1">{subject.questionCount}문항</p>
                </div>
                <span className="text-lg opacity-50">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
