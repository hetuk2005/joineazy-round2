import React from 'react';
import { Assignment } from '../../types';
import { useApp } from '../../context/AppContext';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const DeleteAssignmentModal: React.FC<DeleteAssignmentModalProps> = ({
  assignment,
  onClose,
}) => {
  const { deleteAssignment } = useApp();

  const handleConfirm = () => {
    deleteAssignment(assignment.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-asg-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-8 ring-rose-50 dark:ring-rose-950/20">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 id="del-asg-title" className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4">
          Delete Assignment?
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Are you sure you want to delete{' '}
          <strong className="text-slate-800 dark:text-slate-200">&ldquo;{assignment.title}&rdquo;</strong>? All student or group acknowledgements for this assignment will be permanently removed.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>This action cannot be undone.</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/25"
          >
            Delete Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
