import { User, Course, CourseGroup, Assignment } from '../types';

export const SEED_USERS: User[] = [
  // Professors
  {
    id: 'prof-1',
    name: 'Dr. Robert Downey',
    email: 'prof.downey@joineazy.edu',
    password: 'Password@123',
    role: 'professor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    title: 'Professor of UI & Systems',
  },
  {
    id: 'prof-2',
    name: 'Prof. Margaret Hamilton',
    email: 'prof.hamilton@joineazy.edu',
    password: 'Password@123',
    role: 'professor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Software Engineering',
    title: 'Associate Professor',
  },
  // Students
  {
    id: 'stu-1',
    name: 'Hetuk Patel',
    email: 'hetuk.patel@joineazy.edu',
    password: 'Password@123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'B.Tech Computer Science',
    title: 'Senior Undergraduate',
  },
  {
    id: 'stu-2',
    name: 'Siddhartha Thonti',
    email: 'siddhartha@joineazy.edu',
    password: 'Password@123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'B.Tech Computer Science',
    title: 'Junior Undergraduate',
  },
  {
    id: 'stu-3',
    name: 'Priya Sharma',
    email: 'priya@joineazy.edu',
    password: 'Password@123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Information Systems',
    title: 'Senior Undergraduate',
  },
  {
    id: 'stu-4',
    name: 'Alex Chen',
    email: 'alex@joineazy.edu',
    password: 'Password@123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Data Engineering',
    title: 'Senior Undergraduate',
  },
  {
    id: 'stu-5',
    name: 'Ananya Gupta',
    email: 'ananya@joineazy.edu',
    password: 'Password@123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    title: 'Junior Undergraduate',
  },
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'CS-401',
    title: 'Frontend Engineering & UI Systems',
    description:
      'Modern component architecture, state machines, accessible design systems, and responsive SaaS interfaces using React and Tailwind CSS.',
    semester: 'Fall 2026',
    professorId: 'prof-1',
    enrolledStudentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'],
    accentColor: 'indigo',
  },
  {
    id: 'course-2',
    code: 'CS-415',
    title: 'Distributed Systems & Cloud',
    description:
      'Consensus algorithms, replication protocols, fault-tolerant microservices, and observability in multi-region cloud environments.',
    semester: 'Fall 2026',
    professorId: 'prof-1',
    enrolledStudentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4'],
    accentColor: 'emerald',
  },
  {
    id: 'course-3',
    code: 'SE-302',
    title: 'Software Architecture & QA',
    description:
      'Domain-driven design, automated integration testing, CI/CD release gates, and production resilience engineering.',
    semester: 'Fall 2026',
    professorId: 'prof-2',
    enrolledStudentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'],
    accentColor: 'violet',
  },
];

export const SEED_GROUPS: CourseGroup[] = [
  // Course 1: Hetuk is Leader of Alpha Builders
  {
    id: 'grp-1',
    courseId: 'course-1',
    name: 'Alpha Builders',
    leaderId: 'stu-1',
    memberIds: ['stu-1', 'stu-2'],
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'grp-2',
    courseId: 'course-1',
    name: 'Pixel Pioneers',
    leaderId: 'stu-3',
    memberIds: ['stu-3', 'stu-4'],
    createdAt: '2026-10-21T14:30:00.000Z',
  },
  // Course 2: Hetuk is a NON-LEADER Member of Cloud Ninjas (Siddhartha is Leader)
  {
    id: 'grp-3',
    courseId: 'course-2',
    name: 'Cloud Ninjas',
    leaderId: 'stu-2',
    memberIds: ['stu-2', 'stu-1'],
    createdAt: '2026-10-25T09:15:00.000Z',
  },
  {
    id: 'grp-4',
    courseId: 'course-2',
    name: 'Consensus Crew',
    leaderId: 'stu-3',
    memberIds: ['stu-3', 'stu-4'],
    createdAt: '2026-10-26T11:00:00.000Z',
  },
  // Course 3: Hetuk has NO group yet! (showcases Create/Join CTA)
  {
    id: 'grp-5',
    courseId: 'course-3',
    name: 'QA Legends',
    leaderId: 'stu-3',
    memberIds: ['stu-3', 'stu-4', 'stu-5'],
    createdAt: '2026-10-28T16:00:00.000Z',
  },
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  // CS-401 Assignments
  {
    id: 'asg-1',
    courseId: 'course-1',
    title: 'Design Token & Component Kit Architecture',
    description:
      'Build a reusable React UI component kit with WCAG 2.1 AA contrast compliance, keyboard navigation, and dark mode CSS variables. Upload your exported Storybook build to OneDrive.',
    deadline: '2026-11-15T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_cs401_asg1_tokens',
    submissionType: 'individual',
    createdBy: 'prof-1',
    individualAcknowledgements: {
      'stu-1': {
        id: 'ack-101',
        assignmentId: 'asg-1',
        acknowledgedAt: '2026-11-10T14:22:00.000Z',
        acknowledgedById: 'stu-1',
        acknowledgedByName: 'Hetuk Patel',
        note: 'Uploaded Storybook zip and Figma specs.',
      },
      'stu-2': {
        id: 'ack-102',
        assignmentId: 'asg-1',
        acknowledgedAt: '2026-11-10T18:05:00.000Z',
        acknowledgedById: 'stu-2',
        acknowledgedByName: 'Siddhartha Thonti',
      },
      'stu-3': {
        id: 'ack-103',
        assignmentId: 'asg-1',
        acknowledgedAt: '2026-11-11T09:10:00.000Z',
        acknowledgedById: 'stu-3',
        acknowledgedByName: 'Priya Sharma',
      },
    },
    groupAcknowledgements: {},
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z',
  },
  {
    id: 'asg-2',
    courseId: 'course-1',
    title: 'Team Capstone: Interactive Analytics Dashboard',
    description:
      'Collaborate in your course group to build an end-to-end interactive dashboard with mock APIs, route protection, and responsive breakpoints. Only the group leader should acknowledge after uploading the final zip.',
    deadline: '2026-11-18T23:30:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_cs401_asg2_capstone',
    submissionType: 'group',
    createdBy: 'prof-1',
    individualAcknowledgements: {},
    groupAcknowledgements: {
      'grp-2': {
        id: 'ack-201',
        assignmentId: 'asg-2',
        acknowledgedAt: '2026-11-10T20:45:00.000Z',
        acknowledgedById: 'stu-3',
        acknowledgedByName: 'Priya Sharma',
        note: 'Final group bundle uploaded to OneDrive.',
      },
    },
    createdAt: '2026-11-02T10:30:00.000Z',
    updatedAt: '2026-11-02T10:30:00.000Z',
  },
  {
    id: 'asg-3',
    courseId: 'course-1',
    title: 'Core Web Vitals & Lighthouse Performance Audit',
    description:
      'Profile an existing SPA using Chrome DevTools Performance tab. Eliminate layout shifts (CLS < 0.05) and reduce main-thread blocking time.',
    deadline: '2026-11-09T23:59:00.000Z', // Overdue!
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_cs401_asg3_perf',
    submissionType: 'individual',
    createdBy: 'prof-1',
    individualAcknowledgements: {
      'stu-3': {
        id: 'ack-301',
        assignmentId: 'asg-3',
        acknowledgedAt: '2026-11-08T16:30:00.000Z',
        acknowledgedById: 'stu-3',
        acknowledgedByName: 'Priya Sharma',
      },
    },
    groupAcknowledgements: {},
    createdAt: '2026-10-28T08:00:00.000Z',
    updatedAt: '2026-10-28T08:00:00.000Z',
  },

  // CS-415 Assignments
  {
    id: 'asg-4',
    courseId: 'course-2',
    title: 'Group Lab: Raft Leader Election Simulator',
    description:
      'Implement randomized election timeouts, heartbeat RPCs, and split-brain recovery in your distributed systems group. Upload simulation logs to the course OneDrive.',
    deadline: '2026-11-20T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_cs415_raft_lab',
    submissionType: 'group',
    createdBy: 'prof-1',
    individualAcknowledgements: {},
    groupAcknowledgements: {
      'grp-4': {
        id: 'ack-401',
        assignmentId: 'asg-4',
        acknowledgedAt: '2026-11-11T08:30:00.000Z',
        acknowledgedById: 'stu-3',
        acknowledgedByName: 'Priya Sharma',
      },
    },
    createdAt: '2026-11-03T11:00:00.000Z',
    updatedAt: '2026-11-03T11:00:00.000Z',
  },
  {
    id: 'asg-5',
    courseId: 'course-2',
    title: 'Consistent Hashing & Partition Tolerance Essay',
    description:
      'Submit a 4-page technical benchmark comparing virtual node distributions across 10,000 simulated keys.',
    deadline: '2026-11-24T17:00:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_cs415_hashing',
    submissionType: 'individual',
    createdBy: 'prof-1',
    individualAcknowledgements: {},
    groupAcknowledgements: {},
    createdAt: '2026-11-05T12:00:00.000Z',
    updatedAt: '2026-11-05T12:00:00.000Z',
  },

  // SE-302 Assignments
  {
    id: 'asg-6',
    courseId: 'course-3',
    title: 'Group Project: End-to-End Test Automation Suite',
    description:
      'Author comprehensive Vitest integration tests and Playwright E2E workflows covering authentication, RBAC guards, and edge cases.',
    deadline: '2026-11-19T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_se302_e2e_suite',
    submissionType: 'group',
    createdBy: 'prof-2',
    individualAcknowledgements: {},
    groupAcknowledgements: {
      'grp-5': {
        id: 'ack-601',
        assignmentId: 'asg-6',
        acknowledgedAt: '2026-11-10T21:15:00.000Z',
        acknowledgedById: 'stu-3',
        acknowledgedByName: 'Priya Sharma',
      },
    },
    createdAt: '2026-11-01T15:00:00.000Z',
    updatedAt: '2026-11-01T15:00:00.000Z',
  },
  {
    id: 'asg-7',
    courseId: 'course-3',
    title: 'Hexagonal Architecture Refactoring Report',
    description:
      'Document port-and-adapter boundaries in a legacy TypeScript service and submit UML diagrams + PR links.',
    deadline: '2026-11-14T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?id=joineazy_se302_hexagonal',
    submissionType: 'individual',
    createdBy: 'prof-2',
    individualAcknowledgements: {
      'stu-1': {
        id: 'ack-701',
        assignmentId: 'asg-7',
        acknowledgedAt: '2026-11-11T09:50:00.000Z',
        acknowledgedById: 'stu-1',
        acknowledgedByName: 'Hetuk Patel',
      },
    },
    groupAcknowledgements: {},
    createdAt: '2026-10-30T10:00:00.000Z',
    updatedAt: '2026-10-30T10:00:00.000Z',
  },
];
