'use client';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'blue' | 'red';
}

export default function Modal({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  confirmColor = 'blue',
}: ModalProps) {
  if (!isOpen) return null;

  const confirmClass =
    confirmColor === 'red'
      ? 'bg-red-600 active:bg-red-700 text-white'
      : 'bg-blue-600 active:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
