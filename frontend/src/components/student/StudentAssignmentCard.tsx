import React, { useState } from 'react';
import { Assignment } from '../../types';
import { useApp } from '../../context/AppContext';
import { TwoStepAckModal } from './TwoStepAckModal';
import {
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Users,
  User as UserIcon,
  Crown,
  UserPlus,
  Lock,
} from 'lucide-react';

interface StudentAssignmentCardProps {
  assignment: Assignment;
  onOpenGroupsTab: () => void;
}

export const StudentAssignmentCard: React.FC<StudentAssignmentCardProps> = ({
  assignment,
  onOpenGroupsTab,
}) => {
  const { currentUser, users, getStudentAssignmentState } = useApp();
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);

  if (!currentUser) return null;

  const { isAcknowledged, isOverdue, acknowledgement, group, isLeader } = getStudentAssignmentState(
    assignment,
    currentUser.id
  );

  const isGroup = assignment.submissionType === 'group';
  const groupLeader = group ? users.find((u) => u.id === group.leaderId) : undefined;

  const deadlineDate = new Date(assignment.deadline);
  const formattedDeadline = deadlineDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedAckTime = acknowledgement
    ? new Date(acknowledgement.acknowledgedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
          isAcknowledged
            ? 'border-emerald-200 dark:border-emerald-900/60'
            : isOverdue
            ? 'border-rose-300 dark:border-rose-900/70 ring-1 ring-rose-500/15'
            : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
        }`}
      >
        <div>
          {/* Top Row: Submission Type & Acknowledgement Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            {/* Submission Type Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                isGroup
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60'
                  : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60'
              }`}
            >
              {isGroup ? <Users className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
              <span>{isGroup ? 'Group Submission' : 'Individual Submission'}</span>
            </span>

            {/* Status Pill */}
            {isAcknowledged ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Acknowledged
              </span>
            ) : isOverdue ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                Overdue
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </span>
            )}
          </div>

          {/* Name & Description */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {assignment.title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {assignment.description}
          </p>

          {/* Deadline & OneDrive Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className="text-slate-500 dark:text-slate-400">Deadline:</span>
              <span
                className={`font-semibold ${
                  isOverdue
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {formattedDeadline}
              </span>
            </div>

            <div>
              <a
                href={assignment.oneDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold hover:underline"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Open OneDrive Submission Folder</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer: Acknowledgement Controls / Status */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {isAcknowledged && acknowledgement ? (
            <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/35 border border-emerald-200/80 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="flex items-start gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  {isGroup
                    ? `Acknowledged by ${acknowledgement.acknowledgedByName} on ${formattedAckTime}`
                    : `Acknowledged on ${formattedAckTime}`}
                </span>
              </div>
              {acknowledgement.note && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 pl-6 italic">
                  &ldquo;{acknowledgement.note}&rdquo;
                </p>
              )}
            </div>
          ) : isGroup && !group ? (
            /* No Group Message Requirement */
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
              <p className="text-xs font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
                You are not part of any group. Create or join one to submit this assignment.
              </p>
              <button
                type="button"
                onClick={onOpenGroupsTab}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create or Join a Group</span>
              </button>
            </div>
          ) : isGroup && group && !isLeader ? (
            /* Non-Leader Group Member View */
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Group: {group.name}
                </p>
                <p className="text-[11px] mt-0.5">
                  Only your group leader (<strong>{groupLeader?.name || 'Leader'}</strong>) can acknowledge this group assignment.
                </p>
              </div>
            </div>
          ) : (
            /* Individual OR Group Leader Acknowledge CTA */
            <button
              type="button"
              onClick={() => setIsAckModalOpen(true)}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition ${
                isOverdue
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
              }`}
            >
              {isGroup && <Crown className="w-3.5 h-3.5 text-amber-300" />}
              <span>
                {isGroup
                  ? `Yes, I have submitted (Leader • ${group?.name})`
                  : 'Yes, I have submitted'}
              </span>
            </button>
          )}
        </div>
      </div>

      {isAckModalOpen && (
        <TwoStepAckModal
          assignment={assignment}
          group={group}
          onClose={() => setIsAckModalOpen(false)}
        />
      )}
    </>
  );
};
