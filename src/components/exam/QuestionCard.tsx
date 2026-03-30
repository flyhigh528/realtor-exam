'use client';

import { Question } from '@/lib/types';
import ChoiceList from './ChoiceList';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedChoice: number | null;
  onSelect: (choice: number) => void;
  disabled?: boolean;
  showResult?: boolean;
}

export default function QuestionCard({
  question,
  questionIndex,
  selectedChoice,
  onSelect,
  disabled = false,
  showResult = false,
}: QuestionCardProps) {
  return (
    <div className="pb-4">
      <div className="mb-4">
        <span className="text-xs text-gray-400 font-medium">
          문제 {questionIndex + 1}
        </span>
        <p className="text-base leading-relaxed text-gray-900 mt-1 font-medium">
          {question.text}
        </p>
      </div>

      <ChoiceList
        choices={question.choices}
        selectedChoice={selectedChoice}
        onSelect={onSelect}
        disabled={disabled}
        correctAnswer={showResult ? question.answer : undefined}
        showResult={showResult}
      />

      {showResult && (
        <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="text-xs font-semibold text-blue-700 mb-1">✅ 정답 해설</div>
          <p className="text-sm text-blue-900 leading-relaxed">
            {question.detailedExplanation || question.explanation}
          </p>
          {question.lawReference && (
            <p className="text-xs text-blue-600 mt-2">
              관련 법조항: {question.lawReference}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
