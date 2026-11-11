import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ResetModalProps {
  onClose: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ onClose }) => {
  const { resetAllData } = useApp();

  const handleReset = () => {
    resetAllData();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-8 ring-amber-50 dark:ring-amber-950/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 id="reset-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4">
          Reset Demo Data?
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          This restores the initial seeded courses, groups, assignments, and submission acknowledgements in{' '}
          <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">localStorage</code>.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>Any custom courses, groups, or submissions created will be cleared.</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/25 transition"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
};
