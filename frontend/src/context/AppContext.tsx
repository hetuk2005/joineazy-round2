import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Course,
  CourseGroup,
  Assignment,
  SubmissionType,
  ToastMessage,
} from '../types';
import {
  SEED_USERS,
  SEED_COURSES,
  SEED_GROUPS,
  SEED_ASSIGNMENTS,
} from '../data/seedData';
import { authService } from '../services/authService';

const STORAGE_KEYS = {
  USERS: 'joineazy_r2_users_v1',
  COURSES: 'joineazy_r2_courses_v1',
  GROUPS: 'joineazy_r2_groups_v1',
  ASSIGNMENTS: 'joineazy_r2_assignments_v1',
  THEME: 'joineazy_r2_theme_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AppContextType {
  // Auth & Session
  currentUser: User | null;
  jwtToken: string | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string; user?: User };
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => { success: boolean; error?: string; user?: User };
  loginAsDemo: (userId: string) => User | null;
  logout: () => void;

  // Courses
  courses: Course[];
  createCourse: (data: {
    code: string;
    title: string;
    description: string;
    semester: string;
    accentColor: Course['accentColor'];
  }) => Course;

  // Assignments
  assignments: Assignment[];
  createAssignment: (data: {
    courseId: string;
    title: string;
    description: string;
    deadline: string;
    oneDriveLink: string;
    submissionType: SubmissionType;
  }) => void;
  updateAssignment: (
    id: string,
    updates: Partial<Pick<Assignment, 'title' | 'description' | 'deadline' | 'oneDriveLink' | 'submissionType'>>
  ) => void;
  deleteAssignment: (id: string) => void;

  // Acknowledgements
  acknowledgeIndividual: (
    assignmentId: string,
    details?: { note?: string; submissionLink?: string }
  ) => void;
  acknowledgeGroup: (
    assignmentId: string,
    groupId: string,
    details?: { note?: string; submissionLink?: string }
  ) => { success: boolean; error?: string };

  // Groups
  groups: CourseGroup[];
  getStudentGroupInCourse: (courseId: string, studentId: string) => CourseGroup | undefined;
  createGroup: (courseId: string, name: string) => { success: boolean; error?: string };
  joinGroup: (groupId: string) => { success: boolean; error?: string };
  leaveGroup: (groupId: string) => { success: boolean; error?: string };

  // Helpers
  getStudentAssignmentState: (
    assignment: Assignment,
    studentId: string
  ) => {
    isAcknowledged: boolean;
    isOverdue: boolean;
    acknowledgement?: Assignment['individualAcknowledgements'][string];
    group?: CourseGroup;
    isLeader: boolean;
  };

  // Theme, Toasts, Reset
  isDarkMode: boolean;
  toggleTheme: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => readStorage(STORAGE_KEYS.USERS, SEED_USERS));
  const [courses, setCourses] = useState<Course[]>(() => readStorage(STORAGE_KEYS.COURSES, SEED_COURSES));
  const [groups, setGroups] = useState<CourseGroup[]>(() => readStorage(STORAGE_KEYS.GROUPS, SEED_GROUPS));
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    readStorage(STORAGE_KEYS.ASSIGNMENTS, SEED_ASSIGNMENTS)
  );

  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    const payload = authService.getActiveSessionPayload();
    return payload ? authService.getToken() : null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const payload = authService.getActiveSessionPayload();
    if (!payload) return null;
    const savedUsers = readStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    return savedUsers.find((u) => u.id === payload.sub) || null;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => removeToast(id), 4500);
    },
    [removeToast]
  );

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // --- Auth Methods ---
  const establishSession = useCallback(
    (user: User) => {
      const token = authService.createToken(user);
      authService.saveToken(token);
      setJwtToken(token);
      setCurrentUser(user);
    },
    []
  );

  const login = useCallback(
    (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (!found || found.password !== password) {
        return {
          success: false,
          error: 'Invalid email or password. Try one of the demo accounts or check your credentials.',
        };
      }
      establishSession(found);
      addToast({
        type: 'success',
        title: `Welcome back, ${found.name}`,
        message: `Signed in as ${found.role === 'professor' ? 'Professor' : 'Student'} (JWT session active).`,
      });
      return { success: true, user: found };
    },
    [users, establishSession, addToast]
  );

  const register = useCallback(
    (data: { name: string; email: string; password: string; role: UserRole }) => {
      const normalizedEmail = data.email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }

      const newUser: User = {
        id: `${data.role === 'professor' ? 'prof' : 'stu'}-${Date.now()}`,
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(data.name.trim())}&backgroundColor=4f46e5`,
        department: data.role === 'professor' ? 'Faculty' : 'Undergraduate',
        title: data.role === 'professor' ? 'Instructor' : 'Student',
      };

      setUsers((prev) => [...prev, newUser]);

      // Automatically enroll new students into active semester courses so they immediately see courses
      if (data.role === 'student') {
        setCourses((prev) =>
          prev.map((course) => ({
            ...course,
            enrolledStudentIds: [...course.enrolledStudentIds, newUser.id],
          }))
        );
      }

      establishSession(newUser);
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: `Registered as ${newUser.role === 'professor' ? 'Professor' : 'Student'} and signed in.`,
      });
      return { success: true, user: newUser };
    },
    [users, establishSession, addToast]
  );

  const loginAsDemo = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId) || null;
      if (user) {
        establishSession(user);
        addToast({
          type: 'info',
          title: `Signed in as ${user.name}`,
          message: `Demo ${user.role === 'professor' ? 'Professor' : 'Student'} session started.`,
        });
      }
      return user;
    },
    [users, establishSession, addToast]
  );

  const logout = useCallback(() => {
    authService.clearToken();
    setJwtToken(null);
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Your JWT session token has been cleared.',
    });
  }, [addToast]);

  // --- Course Actions ---
  const createCourse = useCallback(
    (data: {
      code: string;
      title: string;
      description: string;
      semester: string;
      accentColor: Course['accentColor'];
    }) => {
      const allStudentIds = users.filter((u) => u.role === 'student').map((u) => u.id);
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        code: data.code.trim().toUpperCase(),
        title: data.title.trim(),
        description: data.description.trim(),
        semester: data.semester.trim() || 'Fall 2026',
        professorId: currentUser?.id || '',
        enrolledStudentIds: allStudentIds,
        accentColor: data.accentColor,
      };
      setCourses((prev) => [newCourse, ...prev]);
      addToast({
        type: 'success',
        title: 'Course Created',
        message: `${newCourse.code}: ${newCourse.title} is now active with ${allStudentIds.length} students enrolled.`,
      });
      return newCourse;
    },
    [users, currentUser, addToast]
  );

  // --- Assignment Actions ---
  const createAssignment = useCallback(
    (data: {
      courseId: string;
      title: string;
      description: string;
      deadline: string;
      oneDriveLink: string;
      submissionType: SubmissionType;
    }) => {
      const now = new Date().toISOString();
      const newAssignment: Assignment = {
        id: `asg-${Date.now()}`,
        courseId: data.courseId,
        title: data.title.trim(),
        description: data.description.trim(),
        deadline: data.deadline,
        oneDriveLink: data.oneDriveLink.trim(),
        submissionType: data.submissionType,
        createdBy: currentUser?.id || '',
        individualAcknowledgements: {},
        groupAcknowledgements: {},
        createdAt: now,
        updatedAt: now,
      };
      setAssignments((prev) => [newAssignment, ...prev]);
      addToast({
        type: 'success',
        title: 'Assignment Published',
        message: `"${newAssignment.title}" (${newAssignment.submissionType}) added to course.`,
      });
    },
    [currentUser, addToast]
  );

  const updateAssignment = useCallback(
    (
      id: string,
      updates: Partial<Pick<Assignment, 'title' | 'description' | 'deadline' | 'oneDriveLink' | 'submissionType'>>
    ) => {
      setAssignments((prev) =>
        prev.map((asg) =>
          asg.id === id
            ? {
                ...asg,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : asg
        )
      );
      addToast({
        type: 'success',
        title: 'Assignment Updated',
        message: 'Your changes have been saved.',
      });
    },
    [addToast]
  );

  const deleteAssignment = useCallback(
    (id: string) => {
      const target = assignments.find((a) => a.id === id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      addToast({
        type: 'info',
        title: 'Assignment Removed',
        message: target ? `"${target.title}" was deleted.` : 'Assignment deleted.',
      });
    },
    [assignments, addToast]
  );

  // --- Group Actions ---
  const getStudentGroupInCourse = useCallback(
    (courseId: string, studentId: string) => {
      return groups.find((g) => g.courseId === courseId && g.memberIds.includes(studentId));
    },
    [groups]
  );

  const createGroup = useCallback(
    (courseId: string, name: string) => {
      if (!currentUser) return { success: false, error: 'Not authenticated.' };
      const trimmedName = name.trim();
      if (!trimmedName) return { success: false, error: 'Group name cannot be empty.' };

      const existing = getStudentGroupInCourse(courseId, currentUser.id);
      if (existing) {
        return { success: false, error: `You are already in group "${existing.name}" for this course.` };
      }

      if (groups.some((g) => g.courseId === courseId && g.name.toLowerCase() === trimmedName.toLowerCase())) {
        return { success: false, error: 'A group with this name already exists in this course.' };
      }

      const newGroup: CourseGroup = {
        id: `grp-${Date.now()}`,
        courseId,
        name: trimmedName,
        leaderId: currentUser.id,
        memberIds: [currentUser.id],
        createdAt: new Date().toISOString(),
      };

      setGroups((prev) => [...prev, newGroup]);
      addToast({
        type: 'success',
        title: 'Group Created!',
        message: `You are now the Leader of "${newGroup.name}".`,
      });
      return { success: true };
    },
    [currentUser, groups, getStudentGroupInCourse, addToast]
  );

  const joinGroup = useCallback(
    (groupId: string) => {
      if (!currentUser) return { success: false, error: 'Not authenticated.' };
      const targetGroup = groups.find((g) => g.id === groupId);
      if (!targetGroup) return { success: false, error: 'Group not found.' };

      const existing = getStudentGroupInCourse(targetGroup.courseId, currentUser.id);
      if (existing) {
        return { success: false, error: `Leave "${existing.name}" first before joining another group.` };
      }

      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, memberIds: [...g.memberIds, currentUser.id] } : g
        )
      );
      addToast({
        type: 'success',
        title: `Joined "${targetGroup.name}"`,
        message: 'You can now participate in group assignments for this course.',
      });
      return { success: true };
    },
    [currentUser, groups, getStudentGroupInCourse, addToast]
  );

  const leaveGroup = useCallback(
    (groupId: string) => {
      if (!currentUser) return { success: false, error: 'Not authenticated.' };
      const targetGroup = groups.find((g) => g.id === groupId);
      if (!targetGroup) return { success: false, error: 'Group not found.' };

      const hasGroupSubmission = assignments.some(
        (a) => a.courseId === targetGroup.courseId && Boolean(a.groupAcknowledgements[groupId])
      );
      if (hasGroupSubmission) {
        return {
          success: false,
          error: 'Cannot leave a group after it has already acknowledged a group assignment.',
        };
      }

      setGroups((prev) => {
        const remainingMembers = targetGroup.memberIds.filter((id) => id !== currentUser.id);
        if (remainingMembers.length === 0) {
          return prev.filter((g) => g.id !== groupId);
        }
        return prev.map((g) => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            memberIds: remainingMembers,
            leaderId: g.leaderId === currentUser.id ? remainingMembers[0] : g.leaderId,
          };
        });
      });

      addToast({
        type: 'info',
        title: `Left "${targetGroup.name}"`,
        message: 'You can now create or join another group.',
      });
      return { success: true };
    },
    [currentUser, groups, assignments, addToast]
  );

  // --- Acknowledgement Actions ---
  const acknowledgeIndividual = useCallback(
    (assignmentId: string, details?: { note?: string; submissionLink?: string }) => {
      if (!currentUser) return;
      const now = new Date().toISOString();
      setAssignments((prev) =>
        prev.map((asg) => {
          if (asg.id !== assignmentId) return asg;
          return {
            ...asg,
            individualAcknowledgements: {
              ...asg.individualAcknowledgements,
              [currentUser.id]: {
                id: `ack-${Date.now()}`,
                assignmentId,
                acknowledgedAt: now,
                acknowledgedById: currentUser.id,
                acknowledgedByName: currentUser.name,
                note: details?.note?.trim(),
                submissionLink: details?.submissionLink?.trim(),
              },
            },
          };
        })
      );
      addToast({
        type: 'success',
        title: 'Submission Acknowledged!',
        message: 'Your acknowledgement and timestamp have been recorded.',
      });
    },
    [currentUser, addToast]
  );

  const acknowledgeGroup = useCallback(
    (assignmentId: string, groupId: string, details?: { note?: string; submissionLink?: string }) => {
      if (!currentUser) return { success: false, error: 'Not authenticated.' };
      const group = groups.find((g) => g.id === groupId);
      if (!group) return { success: false, error: 'Group not found.' };
      if (group.leaderId !== currentUser.id) {
        return { success: false, error: 'Only the group leader can acknowledge group assignments.' };
      }

      const now = new Date().toISOString();
      setAssignments((prev) =>
        prev.map((asg) => {
          if (asg.id !== assignmentId) return asg;
          return {
            ...asg,
            groupAcknowledgements: {
              ...asg.groupAcknowledgements,
              [groupId]: {
                id: `ack-${Date.now()}`,
                assignmentId,
                acknowledgedAt: now,
                acknowledgedById: currentUser.id,
                acknowledgedByName: currentUser.name,
                note: details?.note?.trim(),
                submissionLink: details?.submissionLink?.trim(),
              },
            },
          };
        })
      );

      addToast({
        type: 'success',
        title: `Submitted for "${group.name}"!`,
        message: 'All group members now see your leader acknowledgement timestamp.',
      });
      return { success: true };
    },
    [currentUser, groups, addToast]
  );

  // --- Helper: Resolve student assignment state ---
  const getStudentAssignmentState = useCallback(
    (assignment: Assignment, studentId: string) => {
      const isPastDue = new Date(assignment.deadline).getTime() < Date.now();
      if (assignment.submissionType === 'individual') {
        const ack = assignment.individualAcknowledgements[studentId];
        return {
          isAcknowledged: Boolean(ack),
          isOverdue: !ack && isPastDue,
          acknowledgement: ack,
          isLeader: true,
        };
      } else {
        const group = getStudentGroupInCourse(assignment.courseId, studentId);
        const ack = group ? assignment.groupAcknowledgements[group.id] : undefined;
        return {
          isAcknowledged: Boolean(ack),
          isOverdue: !ack && isPastDue,
          acknowledgement: ack,
          group,
          isLeader: group ? group.leaderId === studentId : false,
        };
      }
    },
    [getStudentGroupInCourse]
  );

  // --- Reset All Demo Data ---
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);

    setUsers(SEED_USERS);
    setCourses(SEED_COURSES);
    setGroups(SEED_GROUPS);
    setAssignments(SEED_ASSIGNMENTS);

    // Re-sync current user if seeded, otherwise sign out cleanly
    if (currentUser) {
      const matchingSeed = SEED_USERS.find((u) => u.id === currentUser.id);
      if (matchingSeed) {
        establishSession(matchingSeed);
      } else {
        logout();
      }
    }

    addToast({
      type: 'info',
      title: 'Demo Data Restored',
      message: 'All courses, groups, assignments, and submissions have been reset.',
    });
  }, [currentUser, establishSession, logout, addToast]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        jwtToken,
        users,
        login,
        register,
        loginAsDemo,
        logout,
        courses,
        createCourse,
        assignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        acknowledgeIndividual,
        acknowledgeGroup,
        groups,
        getStudentGroupInCourse,
        createGroup,
        joinGroup,
        leaveGroup,
        getStudentAssignmentState,
        isDarkMode,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
