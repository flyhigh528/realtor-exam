'use client';

interface QuestionNavProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, number | null>;
  questionIds: string[];
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function QuestionNav({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  onSelect,
  onClose,
}: QuestionNavProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8 safe-bottom animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">문항 선택</h3>
          <button onClick={onClose} className="text-gray-400 text-lg p-1">✕</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const questionId = questionIds[i];
            const isAnswered = answers[questionId] != null;
            const isCurrent = i === currentIndex;

            let className = 'w-full aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-all ';

            if (isCurrent) {
              className += 'bg-blue-600 text-white ring-2 ring-blue-300';
            } else if (isAnswered) {
              className += 'bg-blue-100 text-blue-700';
            } else {
              className += 'bg-gray-100 text-gray-500';
            }

            return (
              <button
                key={i}
                onClick={() => {
                  onSelect(i);
                  onClose();
                }}
                className={className}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> 현재
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-100 inline-block" /> 풀음
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 inline-block" /> 안풀음
          </span>
        </div>
      </div>
    </div>
  );
}
