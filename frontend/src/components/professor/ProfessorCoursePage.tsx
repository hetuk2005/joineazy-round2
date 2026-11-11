import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SubmissionTypeFilter, SortOption } from '../../types';
import { ProfessorAssignmentCard } from './ProfessorAssignmentCard';
import { AssignmentFormModal } from './AssignmentFormModal';
import { CourseGroupsSection } from '../groups/CourseGroupsSection';
import { EmptyState } from '../common/EmptyState';
import {
  ArrowLeft,
  Plus,
  ClipboardList,
  Users,
  Search,
  X,
  ArrowUpDown,
} from 'lucide-react';

export const ProfessorCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser, courses, assignments, groups } = useApp();

  const [activeTab, setActiveTab] = useState<'assignments' | 'groups'>('assignments');
  const [isCreateAsgOpen, setIsCreateAsgOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SubmissionTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadlineAsc');

  const course = courses.find((c) => c.id === courseId);
  const courseGroups = useMemo(
    () => (course ? groups.filter((g) => g.courseId === course.id) : []),
    [groups, course]
  );

  const courseAssignments = useMemo(() => {
    if (!course) return [];
    return assignments.filter((a) => a.courseId === course.id);
  }, [assignments, course]);

  const filteredAssignments = useMemo(() => {
    if (!course) return [];
    return courseAssignments
      .filter((a) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;

        if (typeFilter !== 'all' && a.submissionType !== typeFilter) return false;

        if (statusFilter !== 'all') {
          const isPast = new Date(a.deadline).getTime() < Date.now();
          const total =
            a.submissionType === 'group' ? courseGroups.length : course.enrolledStudentIds.length;
          const submitted =
            a.submissionType === 'group'
              ? courseGroups.filter((g) => Boolean(a.groupAcknowledgements[g.id])).length
              : course.enrolledStudentIds.filter((id) => Boolean(a.individualAcknowledgements[id]))
                  .length;
          const isCompleted = total > 0 && submitted === total;

          if (statusFilter === 'completed' && !isCompleted) return false;
          if (statusFilter === 'overdue' && (!isPast || isCompleted)) return false;
          if (statusFilter === 'active' && (isPast || isCompleted)) return false;
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
  }, [course, courseAssignments, courseGroups, searchQuery, typeFilter, statusFilter, sortBy]);

  if (!course || !currentUser) {
    return (
      <EmptyState
        title="Course not found"
        description="This course does not exist or you do not have access to it."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/professor"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>
      </div>

      {/* Course Header */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {course.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">{course.semester}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                &bull; {course.enrolledStudentIds.length} Enrolled Students
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {course.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateAsgOpen(true)}
            className="self-start lg:self-center inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
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
            <span>Assignments &amp; Tracking ({courseAssignments.length})</span>
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
            <span>Student Groups ({courseGroups.length})</span>
          </button>
        </div>
      </section>

      {activeTab === 'assignments' ? (
        <div className="space-y-5">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments by title or description..."
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                aria-label="Filter by assignment status"
                className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active (Upcoming)</option>
                <option value="completed">100% Completed</option>
                <option value="overdue">Past Deadline</option>
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

          {filteredAssignments.length === 0 ? (
            <EmptyState
              title="No assignments found"
              description={
                courseAssignments.length === 0
                  ? 'You have not created any assignments in this course yet.'
                  : 'No assignments match your current filter or search criteria.'
              }
              actionText="Create First Assignment"
              onAction={() => setIsCreateAsgOpen(true)}
              showPlusIcon={true}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredAssignments.map((assignment) => (
                <ProfessorAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <CourseGroupsSection course={course} isProfessorView={true} />
      )}

      {isCreateAsgOpen && (
        <AssignmentFormModal
          courseId={course.id}
          onClose={() => setIsCreateAsgOpen(false)}
        />
      )}
    </div>
  );
};
