import React, { useState, useMemo } from 'react';
import { Assignment, Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { AssignmentFormModal } from './AssignmentFormModal';
import { DeleteAssignmentModal } from './DeleteAssignmentModal';
import {
  Calendar,
  FolderOpen,
  ExternalLink,
  Users,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Crown,
  BarChart2,
} from 'lucide-react';

interface ProfessorAssignmentCardProps {
  assignment: Assignment;
  course: Course;
}

export const ProfessorAssignmentCard: React.FC<ProfessorAssignmentCardProps> = ({
  assignment,
  course,
}) => {
  const { users, groups } = useApp();
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [drillFilter, setDrillFilter] = useState<'all' | 'submitted' | 'pending'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isGroup = assignment.submissionType === 'group';
  const deadlineObj = new Date(assignment.deadline);
  const isPastDeadline = deadlineObj.getTime() < Date.now();
  const formattedDeadline = deadlineObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Enrolled students & course groups
  const enrolledStudents = useMemo(
    () => users.filter((u) => course.enrolledStudentIds.includes(u.id)),
    [users, course.enrolledStudentIds]
  );

  const courseGroups = useMemo(
    () => groups.filter((g) => g.courseId === course.id),
    [groups, course.id]
  );

  // Tracking totals
  const totalCount = isGroup ? courseGroups.length : enrolledStudents.length;
  const submittedCount = isGroup
    ? courseGroups.filter((g) => Boolean(assignment.groupAcknowledgements[g.id])).length
    : enrolledStudents.filter((s) => Boolean(assignment.individualAcknowledgements[s.id])).length;
  const pendingCount = Math.max(0, totalCount - submittedCount);
  const completionPct = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  // Ungrouped students warning for group assignments
  const ungroupedStudents = useMemo(() => {
    if (!isGroup) return [];
    const groupedIds = new Set(courseGroups.flatMap((g) => g.memberIds));
    return enrolledStudents.filter((s) => !groupedIds.has(s.id));
  }, [isGroup, courseGroups, enrolledStudents]);

  // Filtered Drilldown rows
  const filteredStudents = useMemo(() => {
    if (isGroup) return [];
    if (drillFilter === 'submitted') {
      return enrolledStudents.filter((s) => Boolean(assignment.individualAcknowledgements[s.id]));
    }
    if (drillFilter === 'pending') {
      return enrolledStudents.filter((s) => !assignment.individualAcknowledgements[s.id]);
    }
    return enrolledStudents;
  }, [isGroup, enrolledStudents, assignment.individualAcknowledgements, drillFilter]);

  const filteredGroups = useMemo(() => {
    if (!isGroup) return [];
    if (drillFilter === 'submitted') {
      return courseGroups.filter((g) => Boolean(assignment.groupAcknowledgements[g.id]));
    }
    if (drillFilter === 'pending') {
      return courseGroups.filter((g) => !assignment.groupAcknowledgements[g.id]);
    }
    return courseGroups;
  }, [isGroup, courseGroups, assignment.groupAcknowledgements, drillFilter]);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          {/* Top Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isGroup
                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60'
                    : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60'
                }`}
              >
                {isGroup ? <Users className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                <span>{isGroup ? 'Group Assignment' : 'Individual Assignment'}</span>
              </span>

              {isPastDeadline && pendingCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  <AlertCircle className="w-3 h-3" /> Past Deadline
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                aria-label="Edit assignment"
                title="Edit assignment"
                className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                aria-label="Delete assignment"
                title="Delete assignment"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {assignment.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {assignment.description}
          </p>

          {/* Deadline & OneDrive Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isPastDeadline ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className="text-slate-500 dark:text-slate-400">Deadline:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
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
                <span>OneDrive Folder</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tracking Summary Counts & Progress Bar */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-brand-500" />
                {isGroup ? 'Group Submissions' : 'Student Submissions'}
              </span>
              <span className="font-extrabold text-brand-600 dark:text-brand-400">
                {submittedCount} of {totalCount} {isGroup ? 'groups' : 'students'} ({completionPct}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completionPct === 100
                    ? 'bg-emerald-500'
                    : completionPct >= 50
                    ? 'bg-brand-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${completionPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">
                {submittedCount} Submitted
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                {pendingCount} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Expandable Drill-down Roster */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsDrilldownOpen(!isDrilldownOpen)}
            className="w-full flex items-center justify-between py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            <span>
              Drill-down: Who Submitted &amp; Who Hasn&apos;t ({submittedCount}/{totalCount})
            </span>
            {isDrilldownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isDrilldownOpen && (
            <div className="mt-3 space-y-3">
              {/* Sub-filter Pills */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                {(
                  [
                    { id: 'all', label: `All (${totalCount})` },
                    { id: 'submitted', label: `Submitted (${submittedCount})` },
                    { id: 'pending', label: `Not Submitted (${pendingCount})` },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDrillFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      drillFilter === f.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Drilldown Items */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {isGroup ? (
                  filteredGroups.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">
                      {courseGroups.length === 0
                        ? 'No student groups have been formed in this course yet.'
                        : 'No groups match this filter.'}
                    </p>
                  ) : (
                    filteredGroups.map((group) => {
                      const ack = assignment.groupAcknowledgements[group.id];
                      const leader = users.find((u) => u.id === group.leaderId);
                      return (
                        <div
                          key={group.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {group.name}
                            </span>
                            {ack ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Submitted
                              </span>
                            ) : isPastDeadline ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                <AlertCircle className="w-3 h-3" /> Overdue
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-500" />
                            Leader: <strong>{leader?.name || 'Unknown'}</strong> &bull; {group.memberIds.length} member(s)
                          </p>

                          {ack && (
                            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                              Acknowledged by {ack.acknowledgedByName} on{' '}
                              {new Date(ack.acknowledgedAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )
                ) : filteredStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No students match this filter.</p>
                ) : (
                  filteredStudents.map((student) => {
                    const ack = assignment.individualAcknowledgements[student.id];
                    return (
                      <div
                        key={student.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                              {student.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{student.email}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {ack ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Submitted
                              </span>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(ack.acknowledgedAt).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          ) : isPastDeadline ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                              <AlertCircle className="w-3 h-3" /> Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              <Clock className="w-3 h-3" /> Not Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {isGroup && ungroupedStudents.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>Note:</strong> {ungroupedStudents.map((s) => s.name).join(', ')} ha
                    {ungroupedStudents.length === 1 ? 's' : 've'} not joined a group in {course.code} yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditOpen && (
        <AssignmentFormModal
          courseId={course.id}
          assignment={assignment}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isDeleteOpen && (
        <DeleteAssignmentModal
          assignment={assignment}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
};
