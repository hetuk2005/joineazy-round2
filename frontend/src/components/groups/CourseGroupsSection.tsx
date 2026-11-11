import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  Users,
  Crown,
  Plus,
  UserPlus,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Shield,
} from 'lucide-react';

interface CourseGroupsSectionProps {
  course: Course;
  isProfessorView?: boolean;
}

export const CourseGroupsSection: React.FC<CourseGroupsSectionProps> = ({
  course,
  isProfessorView = false,
}) => {
  const { currentUser, users, groups, getStudentGroupInCourse, createGroup, joinGroup, leaveGroup } =
    useApp();

  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const courseGroups = groups.filter((g) => g.courseId === course.id);
  const myGroup =
    currentUser && !isProfessorView
      ? getStudentGroupInCourse(course.id, currentUser.id)
      : undefined;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = createGroup(course.id, newGroupName);
    if (!res.success) {
      setError(res.error || 'Could not create group.');
    } else {
      setNewGroupName('');
    }
  };

  const handleJoinGroup = (groupId: string) => {
    setError(null);
    const res = joinGroup(groupId);
    if (!res.success) {
      setError(res.error || 'Could not join group.');
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    setError(null);
    const res = leaveGroup(groupId);
    if (!res.success) {
      setError(res.error || 'Could not leave group.');
    }
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Student's Current Group Card */}
      {!isProfessorView && myGroup && (
        <div className="bg-gradient-to-br from-brand-50 to-indigo-50/70 dark:from-brand-950/40 dark:to-indigo-950/30 border-2 border-brand-300 dark:border-brand-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-600 text-white mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Your Active Course Group</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{myGroup.name}</span>
                {myGroup.leaderId === currentUser?.id && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
                    <Crown className="w-3 h-3" /> You are Leader
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {myGroup.leaderId === currentUser?.id
                  ? 'As the group leader, you can submit & acknowledge group assignments for all members.'
                  : `Only your group leader (${getUserById(myGroup.leaderId)?.name || 'Leader'}) can acknowledge group assignments.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLeaveGroup(myGroup.id)}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Group</span>
            </button>
          </div>

          {/* Group Members Grid */}
          <div className="mt-5 pt-4 border-t border-brand-200/70 dark:border-brand-800/50">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Group Members ({myGroup.memberIds.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {myGroup.memberIds.map((memberId) => {
                const member = getUserById(memberId);
                if (!member) return null;
                const isLeader = member.id === myGroup.leaderId;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {member.name}
                        </p>
                        {isLeader && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <Crown className="w-2.5 h-2.5" /> Leader
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Group Form (shown when student is NOT in a group) */}
      {!isProfessorView && !myGroup && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Create a New Group in {course.code}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Start a new team and automatically become the Group Leader so classmates can join you.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter a group name (e.g. Code Crafters)"
              aria-label="New group name"
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Group &amp; Become Leader</span>
            </button>
          </form>
        </div>
      )}

      {/* All Groups in Course */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" />
            <span>
              {isProfessorView ? `Formed Course Groups (${courseGroups.length})` : `Existing Groups in ${course.code}`}
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {courseGroups.length} group{courseGroups.length === 1 ? '' : 's'} active
          </span>
        </div>

        {courseGroups.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No groups have been created in {course.code} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseGroups.map((group) => {
              const leader = getUserById(group.leaderId);
              const isMyGroup = myGroup?.id === group.id;

              return (
                <div
                  key={group.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition ${
                    isMyGroup
                      ? 'border-brand-400 dark:border-brand-700 ring-1 ring-brand-500/20'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {group.name}
                        </h4>
                        {isMyGroup && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            Joined
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-500" />
                        Leader: <strong className="text-slate-700 dark:text-slate-200">{leader?.name || 'Unknown'}</strong>
                      </p>
                    </div>

                    {!isProfessorView && !myGroup && (
                      <button
                        type="button"
                        onClick={() => handleJoinGroup(group.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join Group</span>
                      </button>
                    )}
                  </div>

                  {/* Members List */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Members ({group.memberIds.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.memberIds.map((mId) => {
                        const member = getUserById(mId);
                        if (!member) return null;
                        const isLeader = member.id === group.leaderId;
                        return (
                          <span
                            key={member.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                              isLeader
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{member.name}</span>
                            {isLeader && <Crown className="w-3 h-3 text-amber-500" />}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
