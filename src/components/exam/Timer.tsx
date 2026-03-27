'use client';

interface TimerProps {
  remaining: number;
}

export default function Timer({ remaining }: TimerProps) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isWarning = remaining <= 600; // 10분 이하
  const isDanger = remaining <= 300;  // 5분 이하

  return (
    <div
      className={`font-mono text-sm font-bold tabular-nums ${
        isDanger
          ? 'text-red-600 animate-pulse'
          : isWarning
          ? 'text-red-500'
          : 'text-gray-700'
      }`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
