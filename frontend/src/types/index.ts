export type UserRole = 'student' | 'professor';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored for mock authentication validation
  role: UserRole;
  avatar: string;
  department?: string;
  title?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  semester: string;
  professorId: string;
  enrolledStudentIds: string[];
  accentColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export type SubmissionType = 'individual' | 'group';

export interface CourseGroup {
  id: string;
  courseId: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  createdAt: string;
}

export interface Acknowledgement {
  id: string;
  assignmentId: string;
  acknowledgedAt: string; // ISO string timestamp
  acknowledgedById: string;
  acknowledgedByName: string;
  note?: string;
  submissionLink?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string; // ISO string (date and time)
  oneDriveLink: string;
  submissionType: SubmissionType;
  createdBy: string; // Professor User ID
  individualAcknowledgements: Record<string, Acknowledgement>; // Keyed by studentId
  groupAcknowledgements: Record<string, Acknowledgement>; // Keyed by groupId
  createdAt: string;
  updatedAt: string;
}

export type AssignmentStatusFilter = 'all' | 'pending' | 'acknowledged' | 'overdue';
export type SubmissionTypeFilter = 'all' | 'individual' | 'group';
export type SortOption = 'deadlineAsc' | 'deadlineDesc' | 'titleAsc';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}
