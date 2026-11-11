import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../common/EmptyState';
import {
  BookOpen,
  ArrowRight,
  Users,
  AlertCircle,
  CheckCircle2,
  Crown,
  Sparkles,
} from 'lucide-react';

const ACCENT_CLASSES = {
  indigo: 'from-indigo-600 to-brand-600',
  emerald: 'from-emerald-600 to-teal-600',
  violet: 'from-violet-600 to-purple-600',
  amber: 'from-amber-600 to-orange-600',
  rose: 'from-rose-600 to-pink-600',
};

export const StudentDashboard: React.FC = () => {
  const { currentUser, users, courses, assignments, getStudentGroupInCourse, getStudentAssignmentState } =
    useApp();
  const navigate = useNavigate();

  const enrolledCourses = useMemo(() => {
    if (!currentUser) return [];
    return courses.filter((c) => c.enrolledStudentIds.includes(currentUser.id));
  }, [courses, currentUser]);

  const overallSummary = useMemo(() => {
    if (!currentUser) return { total: 0, acknowledged: 0, overdue: 0 };
    const enrolledIds = new Set(enrolledCourses.map((c) => c.id));
    const myAssignments = assignments.filter((a) => enrolledIds.has(a.courseId));
    let acknowledged = 0;
    let overdue = 0;
    myAssignments.forEach((a) => {
      const state = getStudentAssignmentState(a, currentUser.id);
      if (state.isAcknowledged) acknowledged++;
      if (state.isOverdue) overdue++;
    });
    return { total: myAssignments.length, acknowledged, overdue };
  }, [enrolledCourses, assignments, currentUser, getStudentAssignmentState]);

  if (!currentUser) return null;

  const overallPercent =
    overallSummary.total > 0 ? Math.round((overallSummary.acknowledged / overallSummary.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-indigo-600 via-brand-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-indigo-100">
              <BookOpen className="w-3.5 h-3.5" />
              Fall 2026 Semester &bull; Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl leading-relaxed">
              Select an enrolled course below to view assignments, manage your course groups, and submit acknowledgements.
            </p>
          </div>

          {/* Semester Progress Summary */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Semester Completion
              </span>
              <span className="text-lg font-black text-white">{overallPercent}%</span>
            </div>
            <p className="text-sm font-bold text-white">
              {overallSummary.acknowledged} of {overallSummary.total} assignments acknowledged
            </p>
            <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            {overallSummary.overdue > 0 && (
              <p className="text-[11px] font-bold text-rose-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {overallSummary.overdue} overdue assignment{overallSummary.overdue > 1 ? 's' : ''} require attention
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Enrolled Courses ({enrolledCourses.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any course card to open its Assignments &amp; Groups workspace
            </p>
          </div>
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No enrolled courses"
            description="You are not enrolled in any courses for this semester yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map((course) => {
              const professor = users.find((u) => u.id === course.professorId);
              const courseAssignments = assignments.filter((a) => a.courseId === course.id);
              let ackCount = 0;
              let overdueCount = 0;
              courseAssignments.forEach((a) => {
                const st = getStudentAssignmentState(a, currentUser.id);
                if (st.isAcknowledged) ackCount++;
                if (st.isOverdue) overdueCount++;
              });
              const pct =
                courseAssignments.length > 0
                  ? Math.round((ackCount / courseAssignments.length) * 100)
                  : 0;
              const myGroup = getStudentGroupInCourse(course.id, currentUser.id);

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                  className="group text-left bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Accent Bar */}
                    <div className={`h-2.5 w-full bg-gradient-to-r ${ACCENT_CLASSES[course.accentColor]}`} />

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {course.code}
                        </span>
                        {overdueCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                            <AlertCircle className="w-3 h-3" /> {overdueCount} Overdue
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400">
                            {course.semester}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {professor && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <img
                            src={professor.avatar}
                            alt={professor.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium truncate">{professor.name}</span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-slate-600 dark:text-slate-300">Course Progress</span>
                          <span className="text-brand-600 dark:text-brand-400">
                            {ackCount}/{courseAssignments.length} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              pct === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Group Status & Open CTA */}
                  <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {myGroup ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 truncate">
                        {myGroup.leaderId === currentUser.id ? (
                          <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span className="truncate">{myGroup.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>No group joined</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      <span>Open Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
