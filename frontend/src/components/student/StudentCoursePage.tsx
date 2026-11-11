import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  AssignmentStatusFilter,
  SubmissionTypeFilter,
  SortOption,
} from '../../types';
import { StudentAssignmentCard } from './StudentAssignmentCard';
import { CourseGroupsSection } from '../groups/CourseGroupsSection';
import { EmptyState } from '../common/EmptyState';
import {
  ArrowLeft,
  Users,
  Search,
  X,
  ArrowUpDown,
  ClipboardList,
  Crown,
} from 'lucide-react';

export const StudentCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    currentUser,
    users,
    courses,
    assignments,
    getStudentGroupInCourse,
    getStudentAssignmentState,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assignments' | 'groups'>('assignments');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<SubmissionTypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadlineAsc');

  const course = courses.find((c) => c.id === courseId);
  const professor = course ? users.find((u) => u.id === course.professorId) : undefined;
  const myGroup =
    course && currentUser ? getStudentGroupInCourse(course.id, currentUser.id) : undefined;

  const courseAssignments = useMemo(() => {
    if (!course) return [];
    return assignments.filter((a) => a.courseId === course.id);
  }, [assignments, course]);

  const counts = useMemo(() => {
    if (!currentUser) return { all: 0, pending: 0, acknowledged: 0, overdue: 0 };
    let pending = 0;
    let acknowledged = 0;
    let overdue = 0;
    courseAssignments.forEach((a) => {
      const st = getStudentAssignmentState(a, currentUser.id);
      if (st.isAcknowledged) acknowledged++;
      else if (st.isOverdue) overdue++;
      else pending++;
    });
    return { all: courseAssignments.length, pending, acknowledged, overdue };
  }, [courseAssignments, currentUser, getStudentAssignmentState]);

  const filteredAssignments = useMemo(() => {
    if (!currentUser) return [];
    return courseAssignments
      .filter((a) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;

        if (typeFilter !== 'all' && a.submissionType !== typeFilter) return false;

        if (statusFilter !== 'all') {
          const st = getStudentAssignmentState(a, currentUser.id);
          if (statusFilter === 'acknowledged' && !st.isAcknowledged) return false;
          if (statusFilter === 'overdue' && !st.isOverdue) return false;
          if (statusFilter === 'pending' && (st.isAcknowledged || st.isOverdue)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadlineAsc') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'deadlineDesc') {
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [courseAssignments, currentUser, searchQuery, typeFilter, statusFilter, sortBy, getStudentAssignmentState]);

  if (!course || !currentUser) {
    return (
      <EmptyState
        title="Course not found"
        description="This course does not exist or you are not enrolled in it."
      />
    );
  }

  const pct = counts.all > 0 ? Math.round((counts.acknowledged / counts.all) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/student"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Courses</span>
        </Link>
      </div>

      {/* Course Header Banner */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {course.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">{course.semester}</span>
              {professor && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  &bull; Instructor: <strong className="text-slate-700 dark:text-slate-200">{professor.name}</strong>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {course.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Course Progress Box */}
          <div className="min-w-[240px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Your Course Progress</span>
              <span className="text-brand-600 dark:text-brand-400">{pct}%</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {counts.acknowledged} of {counts.all} acknowledged
            </p>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  pct === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'assignments'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Assignments ({courseAssignments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'groups'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Course Groups</span>
            {myGroup ? (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  activeTab === 'groups'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {myGroup.leaderId === currentUser.id && <Crown className="w-2.5 h-2.5" />}
                {myGroup.name}
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'groups'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                No Group
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'assignments' ? (
        <div className="space-y-5">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assignments in this course..."
                  className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as SubmissionTypeFilter)}
                  aria-label="Filter by submission type"
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Types</option>
                  <option value="individual">Individual Only</option>
                  <option value="group">Group Only</option>
                </select>

                <div className="relative">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort assignments"
                    className="pl-8 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="deadlineAsc">Deadline: Soonest</option>
                    <option value="deadlineDesc">Deadline: Latest</option>
                    <option value="titleAsc">Title: A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'All', count: counts.all },
                  { id: 'pending', label: 'Pending', count: counts.pending },
                  { id: 'acknowledged', label: 'Acknowledged', count: counts.acknowledged },
                  { id: 'overdue', label: 'Overdue', count: counts.overdue },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    statusFilter === item.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      statusFilter === item.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Grid */}
          {filteredAssignments.length === 0 ? (
            <EmptyState
              title="No matching assignments"
              description={
                courseAssignments.length === 0
                  ? 'Your professor has not published any assignments for this course yet.'
                  : 'Try clearing your search or status filters to see all assignments.'
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssignments.map((assignment) => (
                <StudentAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onOpenGroupsTab={() => setActiveTab('groups')}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <CourseGroupsSection course={course} />
      )}
    </div>
  );
};
