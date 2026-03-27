'use client';

import { Choice } from '@/lib/types';

const circledNumbers = ['①', '②', '③', '④', '⑤'];

interface ChoiceListProps {
  choices: Choice[];
  selectedChoice: number | null;
  onSelect: (choice: number) => void;
  disabled?: boolean;
  correctAnswer?: number;
  showResult?: boolean;
}

export default function ChoiceList({
  choices,
  selectedChoice,
  onSelect,
  disabled = false,
  correctAnswer,
  showResult = false,
}: ChoiceListProps) {
  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const isSelected = selectedChoice === choice.number;
        const isCorrect = showResult && choice.number === correctAnswer;
        const isWrong = showResult && isSelected && choice.number !== correctAnswer;

        let className = 'flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all min-h-12 ';

        if (showResult) {
          if (isCorrect) {
            className += 'border-green-500 bg-green-50 text-green-800';
          } else if (isWrong) {
            className += 'border-red-500 bg-red-50 text-red-800';
          } else {
            className += 'border-gray-100 bg-white text-gray-600';
          }
        } else if (isSelected) {
          className += 'border-blue-500 bg-blue-50 text-blue-800';
        } else {
          className += 'border-gray-100 bg-white text-gray-700 active:border-blue-300 active:bg-blue-50/50';
        }

        return (
          <button
            key={choice.number}
            onClick={() => !disabled && onSelect(choice.number)}
            disabled={disabled}
            className={className}
          >
            <span className="text-base font-medium shrink-0 mt-0.5">
              {circledNumbers[choice.number - 1]}
            </span>
            <span className="text-sm leading-relaxed">{choice.text}</span>
            {showResult && isCorrect && (
              <span className="ml-auto text-green-600 shrink-0">✓</span>
            )}
            {showResult && isWrong && (
              <span className="ml-auto text-red-600 shrink-0">✗</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
