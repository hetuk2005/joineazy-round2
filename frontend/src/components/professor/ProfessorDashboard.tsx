import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CreateCourseModal } from './CreateCourseModal';
import { EmptyState } from '../common/EmptyState';
import {
  ShieldCheck,
  Plus,
  Users,
  ClipboardList,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const ACCENT_CLASSES = {
  indigo: 'from-indigo-600 to-brand-600',
  emerald: 'from-emerald-600 to-teal-600',
  violet: 'from-violet-600 to-purple-600',
  amber: 'from-amber-600 to-orange-600',
  rose: 'from-rose-600 to-pink-600',
};

export const ProfessorDashboard: React.FC = () => {
  const { currentUser, courses, assignments, groups } = useApp();
  const navigate = useNavigate();
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  const myCourses = useMemo(() => {
    if (!currentUser) return [];
    return courses.filter((c) => c.professorId === currentUser.id);
  }, [courses, currentUser]);

  const totalAssignmentsCount = useMemo(() => {
    const myCourseIds = new Set(myCourses.map((c) => c.id));
    return assignments.filter((a) => myCourseIds.has(a.courseId)).length;
  }, [myCourses, assignments]);

  if (!currentUser) return null;

  return (
    <div className="space-y-8">
      {/* Professor Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-amber-300/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Professor Teaching Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Select a course you teach to publish assignments, configure OneDrive links, and track student or group submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <p className="text-slate-400">Courses Taught</p>
              <p className="text-lg font-extrabold text-white">{myCourses.length}</p>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <p className="text-slate-400">Active Assignments</p>
              <p className="text-lg font-extrabold text-white">{totalAssignmentsCount}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateCourseOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>
        </div>
      </section>

      {/* Courses Taught Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Your Courses ({myCourses.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click a course card to open its Assignments &amp; Submission Tracking page
            </p>
          </div>
        </div>

        {myCourses.length === 0 ? (
          <EmptyState
            title="No courses created yet"
            description="Create your first course to start publishing individual or group assignments for your students."
            actionText="Create Your First Course"
            onAction={() => setIsCreateCourseOpen(true)}
            showPlusIcon={true}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCourses.map((course) => {
              const courseAsgs = assignments.filter((a) => a.courseId === course.id);
              const courseGroups = groups.filter((g) => g.courseId === course.id);

              // Calculate average submission rate across course assignments
              let totalSlots = 0;
              let filledSlots = 0;
              courseAsgs.forEach((asg) => {
                if (asg.submissionType === 'individual') {
                  totalSlots += course.enrolledStudentIds.length;
                  filledSlots += course.enrolledStudentIds.filter(
                    (sId) => Boolean(asg.individualAcknowledgements[sId])
                  ).length;
                } else {
                  totalSlots += courseGroups.length;
                  filledSlots += courseGroups.filter(
                    (g) => Boolean(asg.groupAcknowledgements[g.id])
                  ).length;
                }
              });

              const avgCompletion = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => navigate(`/professor/courses/${course.id}`)}
                  className="group text-left bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-2.5 w-full bg-gradient-to-r ${ACCENT_CLASSES[course.accentColor]}`} />

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {course.code}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {course.semester}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-500" />
                          {course.enrolledStudentIds.length} Students
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                          {courseAsgs.length} Assignments
                        </span>
                      </div>

                      <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-slate-600 dark:text-slate-300">Overall Submissions</span>
                          <span className="text-brand-600 dark:text-brand-400">{avgCompletion}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all duration-500"
                            style={{ width: `${avgCompletion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {courseGroups.length} group{courseGroups.length === 1 ? '' : 's'} formed
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                      <span>Manage Assignments</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {isCreateCourseOpen && <CreateCourseModal onClose={() => setIsCreateCourseOpen(false)} />}
    </div>
  );
};
