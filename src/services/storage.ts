import { Course, User, StudentProgress, Certificate, Lesson, Question, CoinMarketItem, CoinTransaction } from '../types';
import {
  INITIAL_COURSES,
  INITIAL_USERS,
  INITIAL_PROGRESS,
  INITIAL_CERTIFICATES,
  INITIAL_COIN_MARKET_ITEMS,
  COURSE_LESSON_TITLE_TEMPLATES
} from '../data/initialData';

const KEYS = {
  USERS: 'iiv_users_v5',
  CURRENT_USER: 'iiv_current_user_v5',
  COURSES: 'iiv_courses_v5',
  PROGRESS: 'iiv_progress_v5',
  CERTIFICATES: 'iiv_certificates_v5',
  COIN_ITEMS: 'iiv_coin_items_v5',
  COIN_TRANSACTIONS: 'iiv_coin_transactions_v5'
};

// Safe storage access with error handling
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('iiv-storage-update'));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Reset all data to factory demo defaults
  resetAllData(): void {
    setStorageItem(KEYS.USERS, INITIAL_USERS);
    setStorageItem(KEYS.COURSES, INITIAL_COURSES);
    setStorageItem(KEYS.PROGRESS, INITIAL_PROGRESS);
    setStorageItem(KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    setStorageItem(KEYS.COIN_ITEMS, INITIAL_COIN_MARKET_ITEMS);
    setStorageItem(KEYS.COIN_TRANSACTIONS, []);
    setStorageItem(KEYS.CURRENT_USER, null);
  },

  // USERS
  getUsers(): User[] {
    return getStorageItem<User[]>(KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return getStorageItem<User | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    setStorageItem(KEYS.CURRENT_USER, user);
  },

  registerStudent(fullName: string, group: string, password: string): { success: boolean; user?: User; message?: string } {
    const cleanName = fullName.trim();
    const cleanGroup = group.trim();
    if (!cleanName || !cleanGroup || !password) {
      return { success: false, message: "Barcha maydonlarni to'ldiring" };
    }

    const users = this.getUsers();
    const existing = users.find(u => u.fullName.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      return { success: false, message: "Ushbu ism-familiya bilan ro'yxatdan o'tilgan. Iltimos, tizimga kiring." };
    }

    const newUser: User = {
      id: `student-${Date.now()}`,
      fullName: cleanName,
      group: cleanGroup,
      role: 'student',
      password: password.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      mustChangePassword: false
    };

    const updated = [...users, newUser];
    setStorageItem(KEYS.USERS, updated);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  loginUser(fullName: string, password: string): { success: boolean; user?: User; message?: string } {
    const cleanName = fullName.trim();
    const cleanPass = password.trim();

    const users = this.getUsers();
    const user = users.find(
      u => u.fullName.toLowerCase() === cleanName.toLowerCase() ||
      (u.role === 'admin' && cleanName.toLowerCase() === 'iivadmin')
    );

    if (!user) {
      return { success: false, message: "Foydalanuvchi topilmadi. Ism-familiyani tekshiring yoki ro'yxatdan o'ting." };
    }

    if (user.password !== cleanPass) {
      return { success: false, message: "Kiritilgan parol noto'g'ri." };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  changePassword(userId: string, newPassword: string): boolean {
    const users = this.getUsers();
    let updated = false;
    const newUsers = users.map(u => {
      if (u.id === userId) {
        updated = true;
        return { ...u, password: newPassword.trim(), mustChangePassword: false };
      }
      return u;
    });

    if (updated) {
      setStorageItem(KEYS.USERS, newUsers);
      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        this.setCurrentUser({ ...current, password: newPassword.trim(), mustChangePassword: false });
      }
      return true;
    }
    return false;
  },

  addTeacherAccount(fullName: string, group: string, password: string): { success: boolean; message?: string } {
    const users = this.getUsers();
    const newTeacher: User = {
      id: `teacher-${Date.now()}`,
      fullName: fullName.trim(),
      group: group.trim() || 'IIV Kafedrasi',
      role: 'teacher',
      password: password.trim() || 'ustoz2026',
      createdAt: new Date().toISOString().split('T')[0],
      mustChangePassword: false
    };
    setStorageItem(KEYS.USERS, [...users, newTeacher]);
    return { success: true };
  },

  // COURSES
  getCourses(): Course[] {
    return getStorageItem<Course[]>(KEYS.COURSES, INITIAL_COURSES);
  },

  getCourseById(courseId: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find(c => c.id === courseId);
  },

  saveCourse(course: Course): void {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    let updated: Course[];
    if (index >= 0) {
      updated = [...courses];
      updated[index] = course;
    } else {
      updated = [...courses, course];
    }
    setStorageItem(KEYS.COURSES, updated);
  },

  addNewCourse(title: string, category: string, badge: string, description: string, accentColor: string): Course {
    const courseId = `course-${Date.now()}`;
    // Generate 20 structured lessons for the new course
    const dummyTitles = Array.from({ length: 20 }, (_, i) => `${title} bo'yicha ${i + 1}-modul`);
    const lessons: Lesson[] = dummyTitles.map((t, idx) => ({
      id: `lesson-${courseId}-${idx + 1}`,
      lessonNumber: idx + 1,
      title: t,
      description: `${t} bo'yicha darslik. Admin tomonidan video va testlar joylanishi kutilmoqda.`,
      duration: '--:--',
      videoUrl: '', // Admin o'zi qo'shadi!
      keyTakeaways: [
        'Darsning asosiy mazmuni va maqsadi',
        'Xizmat intizomi va amaliy ko\'nikmalar'
      ],
      questions: [] // Admin o'zi test tuzib kiritadi!
    }));

    const newCourse: Course = {
      id: courseId,
      title,
      category: category || 'Umumiy Fanlar',
      badge: badge || 'Yangi Kurs',
      description,
      totalLessons: 20,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      accentColor: accentColor || '#1e3a8a',
      lessons,
      finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
      createdAt: new Date().toISOString().split('T')[0]
    };

    const courses = this.getCourses();
    setStorageItem(KEYS.COURSES, [...courses, newCourse]);
    return newCourse;
  },

  addLesson(courseId: string, lesson: Lesson): void {
    const course = this.getCourseById(courseId);
    if (!course) return;
    const existingIdx = course.lessons.findIndex(l => l.id === lesson.id || l.lessonNumber === lesson.lessonNumber);
    if (existingIdx >= 0) {
      course.lessons[existingIdx] = lesson;
    } else {
      course.lessons.push(lesson);
    }
    // Sort lessons by lessonNumber
    course.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
    this.saveCourse(course);
  },

  deleteLesson(courseId: string, lessonId: string): void {
    const course = this.getCourseById(courseId);
    if (!course) return;
    course.lessons = course.lessons.filter(l => l.id !== lessonId);
    this.saveCourse(course);
  },

  generateTemplateLessons(courseId: string): Lesson[] {
    const course = this.getCourseById(courseId);
    if (!course) return [];
    const titles = COURSE_LESSON_TITLE_TEMPLATES[courseId] || Array.from({ length: 20 }, (_, i) => `${course.title} bo'yicha ${i + 1}-dars`);
    const lessons: Lesson[] = titles.map((title, idx) => ({
      id: `lesson-${course.id}-${idx + 1}`,
      lessonNumber: idx + 1,
      title,
      description: `${title} mavzusi bo'yicha videodarslik va amaliy tavsiyalar.`,
      duration: '--:--',
      videoUrl: '', // Admin o'zi kiritadi
      keyTakeaways: [
        `${title} bo'yicha asosiy tushunchalar`,
        'Xizmat intizomi va amaliy ko\'nikmalar'
      ],
      questions: [] // Admin o'zi test tuzib kiritadi
    }));
    course.lessons = lessons;
    this.saveCourse(course);
    return lessons;
  },

  updateLesson(courseId: string, updatedLesson: Lesson): void {
    const course = this.getCourseById(courseId);
    if (!course) return;
    const lessonIdx = course.lessons.findIndex(l => l.id === updatedLesson.id || l.lessonNumber === updatedLesson.lessonNumber);
    if (lessonIdx >= 0) {
      course.lessons[lessonIdx] = updatedLesson;
    } else {
      course.lessons.push(updatedLesson);
      course.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
    }
    this.saveCourse(course);
  },

  // STUDENT PROGRESS
  getAllProgress(): StudentProgress[] {
    return getStorageItem<StudentProgress[]>(KEYS.PROGRESS, INITIAL_PROGRESS);
  },

  getProgress(studentId: string, courseId: string): StudentProgress {
    const all = this.getAllProgress();
    const existing = all.find(p => p.studentId === studentId && p.courseId === courseId);
    if (existing) return existing;

    // Default starting progress: lesson 1
    const newProgress: StudentProgress = {
      studentId,
      courseId,
      currentLesson: 1,
      completedLessons: [],
      lessonScores: {},
      finalExam: null,
      certificateEarned: false,
      updatedAt: new Date().toISOString()
    };
    setStorageItem(KEYS.PROGRESS, [...all, newProgress]);
    return newProgress;
  },

  recordLessonResult(
    studentId: string,
    courseId: string,
    lessonNumber: number,
    score: number,
    total: number
  ): { passed: boolean; nextLesson: number; progress: StudentProgress } {
    const all = this.getAllProgress();
    let currentProgress = this.getProgress(studentId, courseId);
    const passed = score >= 6; // User specification: "10 ta savoldan kamida 6 tasiga to‘g‘ri javob bergan o‘quvchi keyingi videodarsga avtomatik o‘tadi."

    const prevRecord = currentProgress.lessonScores[lessonNumber];
    const attempts = (prevRecord?.attempts || 0) + 1;
    const highestScore = prevRecord ? Math.max(prevRecord.score, score) : score;

    const updatedScores = {
      ...currentProgress.lessonScores,
      [lessonNumber]: {
        lessonNumber,
        score: highestScore,
        total,
        passed: passed || (prevRecord?.passed ?? false),
        attempts,
        lastAttemptDate: new Date().toISOString().split('T')[0]
      }
    };

    let completedList = [...currentProgress.completedLessons];
    if (passed && !completedList.includes(lessonNumber)) {
      completedList.push(lessonNumber);
      completedList.sort((a, b) => a - b);
    }

    // Auto advance to next lesson if passed and if next <= 20
    let nextLesson = currentProgress.currentLesson;
    if (passed && lessonNumber === currentProgress.currentLesson && currentProgress.currentLesson < 20) {
      nextLesson = currentProgress.currentLesson + 1;
    }

    const updatedProgress: StudentProgress = {
      ...currentProgress,
      completedLessons: completedList,
      currentLesson: nextLesson,
      lessonScores: updatedScores,
      updatedAt: new Date().toISOString()
    };

    const remaining = all.filter(p => !(p.studentId === studentId && p.courseId === courseId));
    setStorageItem(KEYS.PROGRESS, [...remaining, updatedProgress]);

    return { passed, nextLesson, progress: updatedProgress };
  },

  recordFinalExamResult(
    studentId: string,
    courseId: string,
    score: number,
    total: number = 30
  ): { passed: boolean; certificate?: Certificate; progress: StudentProgress } {
    const all = this.getAllProgress();
    const currentProgress = this.getProgress(studentId, courseId);
    const passed = score >= 25; // User spec: "Kamida 25 ta savolga to‘g‘ri javob bersa, sertifikat avtomatik yaratiladi."

    const attempts = (currentProgress.finalExam?.attempts || 0) + 1;
    const examRecord = {
      score,
      total,
      passed,
      attempts,
      date: new Date().toLocaleDateString('uz-UZ')
    };

    let cert: Certificate | undefined = undefined;

    if (passed) {
      // Find or create Certificate
      const users = this.getUsers();
      const student = users.find(u => u.id === studentId);
      const course = this.getCourseById(courseId);

      // User requirement: "sertifikat olgan o`quvchiga coin beriolishi kerak 1 ta sertifikat olgan o`quvchiga 50 coin berisi kerak"
      if (student) {
        student.coins = (student.coins || 0) + 50;
        setStorageItem(KEYS.USERS, users);
        const curUser = this.getCurrentUser();
        if (curUser && curUser.id === studentId) {
          this.setCurrentUser({ ...curUser, coins: student.coins });
        }

        // Record 50 coin transaction
        this.addCoinTransaction({
          id: `tx-${Date.now()}`,
          studentId,
          amount: 50,
          type: 'earn_certificate',
          description: `"${course?.title || 'Kurs'}" sertifikati muvaffaqiyatli qo'lga kiritildi (+50 Coin)`,
          date: new Date().toLocaleDateString('uz-UZ')
        });
      }

      const certNumber = `IIV-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: certNumber,
        studentId,
        studentName: student?.fullName || 'IIV Tinglovchisi',
        studentGroup: student?.group || 'IIV Guruh',
        courseId,
        courseTitle: course?.title || 'IIV Kasbiy Kursi',
        issueDate: new Date().toLocaleDateString('uz-UZ'),
        finalScore: score,
        maxScore: total,
        status: 'active',
        qrCodeUrl: window.location.origin ? `${window.location.origin}?verify=${certNumber}` : certNumber,
        organizationName: "O'zbekiston Respublikasi Ichki Ishlar Vazirligi",
        issuerTitle: "Ta'lim va Kadrlar Boshqarmasi Boshlig'i",
        issuerName: "General-mayor X.A. Bobomurodov"
      };

      const certs = this.getCertificates();
      setStorageItem(KEYS.CERTIFICATES, [newCert, ...certs]);
      cert = newCert;
    }

    const updatedProgress: StudentProgress = {
      ...currentProgress,
      finalExam: examRecord,
      certificateEarned: passed || currentProgress.certificateEarned,
      certificateId: cert ? cert.id : currentProgress.certificateId,
      updatedAt: new Date().toISOString()
    };

    const remaining = all.filter(p => !(p.studentId === studentId && p.courseId === courseId));
    setStorageItem(KEYS.PROGRESS, [...remaining, updatedProgress]);

    return { passed, certificate: cert, progress: updatedProgress };
  },

  // CERTIFICATES
  getCertificates(): Certificate[] {
    return getStorageItem<Certificate[]>(KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  },

  getCertificateById(id: string): Certificate | undefined {
    return this.getCertificates().find(c => c.id === id);
  },

  getCertificateByNumber(certNumber: string): Certificate | undefined {
    const clean = certNumber.trim().toUpperCase();
    return this.getCertificates().find(c => c.certificateNumber.toUpperCase() === clean);
  },

  getCertificatesForStudent(studentId: string): Certificate[] {
    return this.getCertificates().filter(c => c.studentId === studentId);
  },

  revokeCertificate(certId: string): void {
    const certs = this.getCertificates().map(c => {
      if (c.id === certId) {
        return { ...c, status: (c.status === 'active' ? 'revoked' : 'active') as 'active' | 'revoked' };
      }
      return c;
    });
    setStorageItem(KEYS.CERTIFICATES, certs);
  },

  // COIN MARKET & TRANSACTIONS
  getCoinMarketItems(): CoinMarketItem[] {
    return getStorageItem<CoinMarketItem[]>(KEYS.COIN_ITEMS, INITIAL_COIN_MARKET_ITEMS);
  },

  getCoinTransactions(studentId?: string): CoinTransaction[] {
    const txs = getStorageItem<CoinTransaction[]>(KEYS.COIN_TRANSACTIONS, []);
    if (!studentId) return txs;
    return txs.filter(t => t.studentId === studentId);
  },

  addCoinTransaction(tx: CoinTransaction): void {
    const txs = this.getCoinTransactions();
    setStorageItem(KEYS.COIN_TRANSACTIONS, [tx, ...txs]);
  },

  purchaseMarketItem(studentId: string, itemId: string): { success: boolean; message: string; remainingCoins?: number } {
    const items = this.getCoinMarketItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return { success: false, message: "Buyum topilmadi." };

    const users = this.getUsers();
    const student = users.find(u => u.id === studentId);
    if (!student) return { success: false, message: "O'quvchi profili topilmadi." };

    const studentCoins = student.coins || 0;
    if (studentCoins < item.cost) {
      return { 
        success: false, 
        message: `Coin yetarli emas! Sizda ${studentCoins} coin mavjud, talab qilinadi: ${item.cost} coin. (Har bir bitirilgan kurs sertifikati uchun 50 coin beriladi)` 
      };
    }

    // Deduct coins
    student.coins = studentCoins - item.cost;
    setStorageItem(KEYS.USERS, users);

    const curUser = this.getCurrentUser();
    if (curUser && curUser.id === studentId) {
      this.setCurrentUser({ ...curUser, coins: student.coins });
    }

    // Record purchase transaction
    this.addCoinTransaction({
      id: `tx-${Date.now()}`,
      studentId,
      amount: -item.cost,
      type: 'spend_market',
      description: `"${item.title}" muvaffaqiyatli qabul qilindi (-${item.cost} Coin)`,
      date: new Date().toLocaleDateString('uz-UZ')
    });

    return { 
      success: true, 
      message: `Tabriklaymiz! "${item.title}" muvaffaqiyatli xarid qilindi.`,
      remainingCoins: student.coins 
    };
  },

  // ADMIN PASSCODE VALIDATION
  validateAdminPasscode(passcode: string): boolean {
    const clean = passcode.trim().toLowerCase().replace(/\s+/g, ' ');
    // Matches exact user request: "admin panel paroli iiv admin bo`lishi kerak"
    return clean === 'iiv admin' || clean === 'iivadmin';
  }
};
