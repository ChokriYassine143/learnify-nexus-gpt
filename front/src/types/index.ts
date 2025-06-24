// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password?: string; // Added for local password storage
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  bio?: string;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrolledCourses?: string[]; // Course IDs
  teachingCourses?: string[]; // Course IDs (for teachers)
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark";
  language: string;
}

// Course Types
export interface Course {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  rating: number;
  enrolled: boolean;
  modules: CourseModule[];
  image: string;
  isPublished: boolean;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
  requirements: string[];
  objectives: string[];
  tags: string[];
  enrolledStudents: number;
}

export interface CourseModule {
  id?: string;
  _id?: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  order: number;
  locked?: boolean;
  duration: number;
  type: "video" | "reading" | "assignment" | "quiz";
  resources: string[];
  completedBy?: string[];
  quizzes: string[];
}

// Forum Types
export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  courseId: string;
  author: string | {
    firstName: string;
    lastName: string;
    id: string;
    avatar?: string;
    name?: string;
  };
  replies?: ForumReply[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags?: string[];
  likes?: string[];
  isPinned?: boolean;
  isLocked?: boolean;
  views?: number;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string | {
    firstName: string;
    lastName: string;
    id: string;
    avatar?: string;
    name?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  likes?: string[];
}

// Assignment Types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string;
  dueDate: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  submissions: AssignmentSubmission[];
  status: "draft" | "published" | "graded";
}

export interface AssignmentSubmission {
  id: string;
  studentId: string; // User ID
  content: string;
  attachments?: string[]; // URLs
  submittedAt: string;
  gradedAt?: string;
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "returned";
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "link" | "other";
  url: string;
  courseId: string;
  moduleId: string;
  uploadedBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  downloads: number;
  size?: number; // in bytes
  tags?: string[];
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

// Progress Types
export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  lastAccessedAt: string;
  status: "in_progress" | "completed";
  quizScores: { [key: string]: number };
}

export interface CourseNotes {
  userId: string;
  courseId: string;
  lessonId: string;
  notes: string;
  updatedAt: string;
}

export interface CourseDiscussion {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  courseId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "course" | "forum" | "assignment" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  activeCourses: number;
  courseCompletionRate: number;
  averageRating: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  topCourses?: Course[];
  topInstructors?: User[];
  lastUpdated?: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "pending" | "read" | "archived";
}

// Chat Types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
} 