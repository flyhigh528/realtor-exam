import Link from 'next/link';
import Header from '@/components/layout/Header';

const examCards = [
  {
    type: 'first',
    label: '1차 시험',
    subjects: '부동산학개론 + 민법 및 민사특별법',
    questions: 80,
    time: 100,
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    icon: '📘',
  },
  {
    type: 'second-1',
    label: '2차 시험 1교시',
    subjects: '중개사법/중개실무 + 부동산공법',
    questions: 80,
    time: 100,
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    icon: '📗',
  },
  {
    type: 'second-2',
    label: '2차 시험 2교시',
    subjects: '부동산공시법령 및 세법',
    questions: 40,
    time: 50,
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    icon: '📕',
  },
];

const quickLinks = [
  { href: '/practice', icon: '📚', label: '과목별 연습', desc: '원하는 과목만' },
  { href: '/wrong-answers', icon: '✏️', label: '오답노트', desc: '틀린 문제 복습' },
  { href: '/bookmarks', icon: '🔖', label: '북마크', desc: '저장한 문제' },
  { href: '/history', icon: '📊', label: '성적 기록', desc: '점수 추이 확인' },
];

export default function HomePage() {
  const examDate = new Date('2026-10-24T00:00:00+09:00');
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  today.setHours(0, 0, 0, 0);
  const diffMs = examDate.getTime() - today.getTime();
  const dDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* 히어로 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-3">
            <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              다혜&apos;s중개사패스
            </span>
          </h1>
          {/* D-day 배너 */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl px-5 py-3 mb-3">
            <div className="text-center">
              <div className="text-xs text-pink-500 font-medium">제37회 시험까지</div>
              <div className="text-2xl font-black text-rose-600 leading-tight">
                {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : '시험 종료'}
              </div>
              <div className="text-[10px] text-pink-400">2026. 10. 24</div>
            </div>
            <div className="h-10 w-px bg-pink-200" />
            <div className="text-left">
              <div className="text-xs text-gray-500">남은 시간</div>
              <div className="text-sm font-bold text-gray-800">
                {dDay > 0 ? `${Math.floor(dDay / 30)}개월 ${dDay % 30}일` : '-'}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">파이팅! 🔥</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            실전과 동일한 환경에서 연습하세요
          </p>
        </div>

        {/* 시험 카드 */}
        <div className="space-y-3 mb-8">
          {examCards.map((card) => (
            <Link
              key={card.type}
              href={`/exam/${card.type}`}
              className="block group"
            >
              <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg shadow-gray-200 active:scale-[0.98] transition-all duration-200`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white/70 mb-0.5">모의시험</div>
                    <h2 className="text-lg font-bold mb-1">{card.label}</h2>
                    <p className="text-sm text-white/80 mb-3">{card.subjects}</p>
                    <div className="flex gap-3 text-xs text-white/70">
                      <span className="bg-white/15 rounded-full px-2.5 py-0.5">{card.questions}문항</span>
                      <span className="bg-white/15 rounded-full px-2.5 py-0.5">{card.time}분</span>
                    </div>
                  </div>
                  <div className="text-3xl opacity-80 group-active:scale-110 transition-transform">{card.icon}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 퀵 링크 그리드 */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className="text-xl mb-1">{link.icon}</div>
              <div className="text-xs font-semibold text-gray-800">{link.label}</div>
            </Link>
          ))}
        </div>

        {/* 합격 기준 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">합격 기준</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-gray-700">40점</div>
              <div className="text-[10px] text-gray-500">과목 최저</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-700">60점</div>
              <div className="text-[10px] text-gray-500">평균 이상</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-700">2.5점</div>
              <div className="text-[10px] text-gray-500">문항당</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
