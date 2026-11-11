import React, { useState } from 'react';
import { Assignment, CourseGroup } from '../../types';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FolderOpen,
  Users,
  User as UserIcon,
  Clock,
} from 'lucide-react';

interface TwoStepAckModalProps {
  assignment: Assignment;
  group?: CourseGroup;
  onClose: () => void;
}

export const TwoStepAckModal: React.FC<TwoStepAckModalProps> = ({ assignment, group, onClose }) => {
  const { currentUser, acknowledgeIndividual, acknowledgeGroup } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [note, setNote] = useState('');

  const isGroup = assignment.submissionType === 'group';

  const handleFinalConfirm = () => {
    if (isGroup && group) {
      acknowledgeGroup(assignment.id, group.id, { submissionLink, note });
    } else {
      acknowledgeIndividual(assignment.id, { submissionLink, note });
    }

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore in non-browser tests
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ack-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Stepper Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 1 ? 'bg-brand-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 2 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
            </span>
            <span className="text-slate-700 dark:text-slate-200">Yes, I have submitted</span>
            <div className="w-5 h-px bg-slate-300 dark:bg-slate-700" />
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 2
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}>
              Confirm
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                  {isGroup ? <Users className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                  {isGroup ? `Group Acknowledgement • ${group?.name}` : 'Individual Acknowledgement'}
                </span>
                <h2 id="ack-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                  {assignment.title}
                </h2>
              </div>

              {/* OneDrive Box */}
              <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    OneDrive Submission Folder
                  </p>
                  <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 mt-0.5">
                    Ensure your deliverables are uploaded to OneDrive before acknowledging.
                  </p>
                  <a
                    href={assignment.oneDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 shadow-sm hover:bg-sky-50 transition"
                  >
                    <span>Open OneDrive Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="ack-file-link" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct File Link (Optional)
                  </label>
                  <input
                    id="ack-file-link"
                    type="url"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://onedrive.live.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="ack-note" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Note for Professor (Optional)
                  </label>
                  <textarea
                    id="ack-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any remarks about your submission..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
              </div>

              {/* Mandatory Step 1 Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConfirmedCheckbox}
                  onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  &ldquo;Yes, I have submitted&rdquo; &mdash; I confirm the files are uploaded to OneDrive
                  {isGroup && group ? ` for group "${group.name}"` : ''}.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!hasConfirmedCheckbox}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span>Continue to Confirm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center pt-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3 ring-8 ring-amber-50 dark:ring-amber-950/20">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Confirm Submission Acknowledgement
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {isGroup && group
                    ? `Confirming will mark this assignment as submitted for all ${group.memberIds.length} member(s) in "${group.name}".`
                    : 'Your acknowledgement timestamp will be recorded for your professor.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assignment:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[220px]">
                    {assignment.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Acknowledged By:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {currentUser?.name} {isGroup ? '(Group Leader)' : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3.5 h-3.5" /> Recorded immediately
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Acknowledgement</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
