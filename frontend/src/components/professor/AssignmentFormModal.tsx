import React, { useState } from 'react';
import { Assignment, SubmissionType } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  FolderOpen,
  Users,
  User as UserIcon,
  AlertCircle,
  FileEdit,
  Plus,
} from 'lucide-react';

interface AssignmentFormModalProps {
  courseId: string;
  assignment?: Assignment | null;
  onClose: () => void;
}

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  courseId,
  assignment,
  onClose,
}) => {
  const { createAssignment, updateAssignment } = useApp();
  const isEditing = Boolean(assignment);

  const [title, setTitle] = useState(assignment?.title || '');
  const [description, setDescription] = useState(assignment?.description || '');
  const [deadline, setDeadline] = useState(() => {
    if (assignment?.deadline) {
      const d = new Date(assignment.deadline);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    const def = new Date();
    def.setDate(def.getDate() + 7);
    def.setHours(23, 59, 0, 0);
    return new Date(def.getTime() - def.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [oneDriveLink, setOneDriveLink] = useState(
    assignment?.oneDriveLink || 'https://onedrive.live.com/?id=joineazy_submission'
  );
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    assignment?.submissionType || 'individual'
  );

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    deadline?: string;
    oneDriveLink?: string;
  }>({});

  const setPresetDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    setDeadline(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (!deadline) errs.deadline = 'Deadline date and time are required.';
    if (!oneDriveLink.trim()) {
      errs.oneDriveLink = 'OneDrive link is required.';
    } else if (!/^https?:\/\//i.test(oneDriveLink.trim())) {
      errs.oneDriveLink = 'Must be a valid URL starting with https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const isoDeadline = new Date(deadline).toISOString();

    if (isEditing && assignment) {
      updateAssignment(assignment.id, {
        title: title.trim(),
        description: description.trim(),
        deadline: isoDeadline,
        oneDriveLink: oneDriveLink.trim(),
        submissionType,
      });
    } else {
      createAssignment({
        courseId,
        title: title.trim(),
        description: description.trim(),
        deadline: isoDeadline,
        oneDriveLink: oneDriveLink.trim(),
        submissionType,
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prof-asg-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              {isEditing ? <FileEdit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="prof-asg-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configure submission requirements, OneDrive folder, and deadline.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Submission Type */}
          <div>
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Submission Type <span className="text-rose-500">*</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSubmissionType('individual')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  submissionType === 'individual'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <UserIcon className="w-5 h-5 flex-shrink-0 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-xs font-bold">Individual</p>
                  <p className="text-[10px] opacity-80">Each student submits solo</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionType('group')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  submissionType === 'group'
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200 ring-1 ring-purple-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs font-bold">Group</p>
                  <p className="text-[10px] opacity-80">Group leader acknowledges</p>
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="asg-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="asg-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Microservices Architecture & Load Balancing Lab"
              className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.title ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="asg-desc" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="asg-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain deliverables, rubric, and OneDrive folder naming conventions..."
              className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="asg-deadline" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Deadline (Date &amp; Time) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPresetDays(3)}
                  className="px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(7)}
                  className="px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold"
                >
                  +1w
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDays(14)}
                  className="px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold"
                >
                  +2w
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="asg-deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.deadline ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.deadline}
              </p>
            )}
          </div>

          {/* OneDrive Link */}
          <div>
            <label htmlFor="asg-onedrive" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              OneDrive Link <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="asg-onedrive"
                type="url"
                value={oneDriveLink}
                onChange={(e) => setOneDriveLink(e.target.value)}
                placeholder="https://onedrive.live.com/..."
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.oneDriveLink ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.oneDriveLink && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.oneDriveLink}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/25"
            >
              {isEditing ? 'Save Changes' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
