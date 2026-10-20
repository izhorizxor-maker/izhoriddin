export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  fullName: string;
  group: string;
  role: UserRole;
  password?: string;
  createdAt: string;
  mustChangePassword?: boolean;
  coins?: number; // 50 coins per certificate earned!
}

export interface CoinMarketItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  iconName: string;
  category: 'kitoblar' | 'imtiyoz' | 'material' | 'sertifikat' | 'status' | string;
  stock?: number;
}

export interface CoinTransaction {
  id: string;
  studentId: string;
  amount: number;
  type: 'earn_certificate' | 'spend_market';
  description: string;
  date: string;
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string] | string[];
  correctIndex: number;
  explanation?: string;
}

export interface Lesson {
  id: string;
  lessonNumber: number; // 1..20
  title: string;
  description: string;
  duration: string; // e.g. "18:45"
  videoUrl: string; // youtube url or embed url
  videoPoster?: string;
  keyTakeaways: string[];
  questions: Question[]; // exactly 10 questions per lesson
}

export interface Course {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  totalLessons: number; // 20
  thumbnail: string;
  accentColor: string;
  lessons: Lesson[];
  finalExamQuestions: Question[]; // 30 questions
  createdAt: string;
}

export interface LessonScoreRecord {
  lessonNumber: number;
  score: number;
  total: number;
  passed: boolean;
  attempts: number;
  lastAttemptDate: string;
}

export interface FinalExamRecord {
  score: number;
  total: number;
  passed: boolean;
  attempts: number;
  date: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  currentLesson: number; // 1..20
  completedLessons: number[]; // array of completed lesson numbers [1, 2, ...]
  lessonScores: Record<number, LessonScoreRecord>;
  finalExam: FinalExamRecord | null;
  certificateEarned: boolean;
  certificateId?: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. "IIV-CERT-2026-84912"
  studentId: string;
  studentName: string;
  studentGroup: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  finalScore: number;
  maxScore: number;
  status: 'active' | 'revoked';
  qrCodeUrl?: string;
  organizationName: string; // "O'zbekiston Respublikasi Ichki Ishlar Vazirligi"
  issuerTitle: string; // "Ta'lim va Kadrlar Boshqarmasi Boshlig'i"
  issuerName: string; // "General-mayor X.A. Bobomurodov"
}

export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalLessons: number;
  certificatesIssued: number;
  averagePassRate: number;
}
