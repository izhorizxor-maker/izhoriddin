import React, { useState } from 'react';
import { User, Course, Lesson, Question, StudentProgress, Certificate } from '../types';
import { StorageService } from '../services/storage';
import { IIVLogo } from './IIVLogo';
import { 
  ShieldAlert, 
  X, 
  BookOpen, 
  FileQuestion, 
  Users, 
  Award, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Video,
  Play,
  Eye,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Props {
  currentUser: User | null;
  onClose: () => void;
  onViewCertificate: (cert: Certificate) => void;
  onDataChanged: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  currentUser,
  onClose,
  onViewCertificate,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'questions' | 'students' | 'certificates' | 'courses' | 'teachers'>('videos');

  // Change password state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(
    currentUser?.mustChangePassword ?? false
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Courses state
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  
  // Video editing state
  const [videoCourseId, setVideoCourseId] = useState<string>(courses[0]?.id || '');
  const [editingVideoLesson, setEditingVideoLesson] = useState<Lesson | null>(null);
  const [isNewLesson, setIsNewLesson] = useState<boolean>(false);

  // Question editing state
  const [questionCourseId, setQuestionCourseId] = useState<string>(courses[0]?.id || '');
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(1);
  const [isEditingFinalExam, setIsEditingFinalExam] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);

  // Course editing state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Axborot Texnologiyalari');
  const [newCourseBadge, setNewCourseBadge] = useState('Yangi Kurs');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('#2563eb');

  // Teacher accounts state
  const [teacherName, setTeacherName] = useState('');
  const [teacherGroup, setTeacherGroup] = useState('IIV Kafedrasi');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherMsg, setTeacherMsg] = useState<string | null>(null);

  // Student list search
  const [studentSearch, setStudentSearch] = useState('');

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const videoCourse = courses.find(c => c.id === videoCourseId) || courses[0];
  const questionCourse = courses.find(c => c.id === questionCourseId) || courses[0];

  const allUsers = StorageService.getUsers();
  const students = allUsers.filter(u => u.role === 'student');
  const allProgress = StorageService.getAllProgress();
  const certificates = StorageService.getCertificates();

  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 5) {
      setPasswordMsg({ type: 'error', text: "Parol kamida 5 ta belgidan iborat bo'lishi kerak" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Parollar mos kelmadi' });
      return;
    }

    if (currentUser) {
      StorageService.changePassword(currentUser.id, newPassword);
      setPasswordMsg({ type: 'success', text: "Parol muvaffaqiyatli yangilandi!" });
      setTimeout(() => {
        setShowPasswordChangeModal(false);
        setPasswordMsg(null);
        onDataChanged();
      }, 1500);
    }
  };

  // Handle Add New Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const created = StorageService.addNewCourse(
      newCourseTitle,
      newCourseCategory,
      newCourseBadge,
      newCourseDesc,
      newCourseColor
    );
    const updated = StorageService.getCourses();
    setCourses(updated);
    setSelectedCourseId(created.id);
    setVideoCourseId(created.id);
    setShowAddCourseModal(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
    onDataChanged();
  };

  // Handle Save Video Lesson
  const handleSaveVideoLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideoLesson || !videoCourseId) return;

    StorageService.addLesson(videoCourseId, editingVideoLesson);
    const updated = StorageService.getCourses();
    setCourses(updated);
    setEditingVideoLesson(null);
    setIsNewLesson(false);
    onDataChanged();
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!window.confirm("Ushbu videodarsni o'chirishni tasdiqlaysizmi?")) return;
    StorageService.deleteLesson(videoCourseId, lessonId);
    setCourses(StorageService.getCourses());
    onDataChanged();
  };

  const handleGenerateTemplates = () => {
    if (window.confirm("Ushbu kurs uchun 20 ta dars qolipini avtomatik yaratishni xohlaysizmi?")) {
      StorageService.generateTemplateLessons(videoCourseId);
      setCourses(StorageService.getCourses());
      onDataChanged();
    }
  };

  // Handle Save Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !questionCourse) return;

    if (isEditingFinalExam) {
      // update or add to final exam
      let updatedExamQuestions = [...(questionCourse.finalExamQuestions || [])];
      if (isNewQuestion) {
        updatedExamQuestions.push(editingQuestion);
      } else {
        updatedExamQuestions = updatedExamQuestions.map(q => 
          q.id === editingQuestion.id ? editingQuestion : q
        );
      }
      questionCourse.finalExamQuestions = updatedExamQuestions;
      StorageService.saveCourse(questionCourse);
    } else {
      // update or add to lesson questions
      let targetLesson = questionCourse.lessons.find(l => l.lessonNumber === selectedLessonNumber);
      if (!targetLesson) {
        targetLesson = {
          id: `lesson-${questionCourse.id}-${selectedLessonNumber}`,
          lessonNumber: selectedLessonNumber,
          title: `${selectedLessonNumber}-dars`,
          description: `${selectedLessonNumber}-mavzu darsligi`,
          duration: '15:00',
          videoUrl: '',
          keyTakeaways: ['Mavzuga oid bilimlar'],
          questions: []
        };
        questionCourse.lessons.push(targetLesson);
        questionCourse.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
      }
      let qList = [...(targetLesson.questions || [])];
      if (isNewQuestion) {
        qList.push(editingQuestion);
      } else {
        qList = qList.map(q => q.id === editingQuestion.id ? editingQuestion : q);
      }
      targetLesson.questions = qList;
      StorageService.saveCourse(questionCourse);
    }

    const updated = StorageService.getCourses();
    setCourses(updated);
    setEditingQuestion(null);
    setIsNewQuestion(false);
    onDataChanged();
  };

  // Handle Delete Question
  const handleDeleteQuestion = (questionId: string) => {
    if (!window.confirm("Ushbu test savolini o'chirishni tasdiqlaysizmi?")) return;
    if (!questionCourse) return;

    if (isEditingFinalExam) {
      questionCourse.finalExamQuestions = questionCourse.finalExamQuestions.filter(q => q.id !== questionId);
      StorageService.saveCourse(questionCourse);
    } else {
      const targetLesson = questionCourse.lessons.find(l => l.lessonNumber === selectedLessonNumber);
      if (targetLesson) {
        targetLesson.questions = targetLesson.questions.filter(q => q.id !== questionId);
        StorageService.updateLesson(questionCourse.id, targetLesson);
      }
    }

    const updated = StorageService.getCourses();
    setCourses(updated);
    onDataChanged();
  };

  // Handle Add Teacher
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    StorageService.addTeacherAccount(teacherName, teacherGroup, teacherPassword);
    setTeacherMsg("Yangi o'qituvchi hisobi muvaffaqiyatli saqlandi!");
    setTeacherName('');
    setTeacherPassword('');
    setTimeout(() => setTeacherMsg(null), 3000);
    onDataChanged();
  };

  // Reset all data
  const handleResetData = () => {
    if (window.confirm("Barcha ma'lumotlarni tozalashni xohlaysizmi?")) {
      StorageService.resetAllData();
      setCourses(StorageService.getCourses());
      onDataChanged();
      alert("Tizim tozalandi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Uzbekistan Flag Ribbon */}
        <div className="h-1.5 w-full flex flex-shrink-0">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Admin Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <IIVLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  IIV BOSHQARUV PANELI
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 font-bold">
                  Parol: iiv admin
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                O'qituvchi va Ma'murlar Boshqaruv Markazi
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordChangeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Parolni o'zgartirish</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (VIDEOLAR BO'LIMI and TESTLAR BO'LIMI) */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto flex-shrink-0">
          {/* User Request: Admin panelga videolar bo'limini qo'shish */}
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span>Videolar bo'limi</span>
          </button>

          {/* User Request: Testlar bo'limi */}
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5 text-amber-400" />
            <span>Testlar bo'limi</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>O'quvchilar ro'yxati ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Sertifikatlar ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kurslar ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Monitoring
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sozlamalar</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB: VIDEOLAR BO'LIMI (User Explicit Request) */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {/* Course Selector and Actions for Videos */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Videolar Boshqaruvi</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                        {videoCourse?.lessons.length || 0} / 20 ta dars
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      O'qituvchi o'zi videolarni havola (URL) va davomiyligi bilan kiritadi
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-semibold">Fan / Kurs:</label>
                    <select
                      value={videoCourseId}
                      onChange={e => setVideoCourseId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none cursor-pointer"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Explicit user requirement: Admin o'zi darslarni kiritadi */}
                  <button
                    onClick={() => {
                      const nextNum = (videoCourse?.lessons?.length || 0) + 1;
                      setEditingVideoLesson({
                        id: `lesson-${videoCourse?.id || 'course'}-${nextNum}-${Date.now()}`,
                        lessonNumber: Math.min(nextNum, 20),
                        title: '',
                        description: '',
                        duration: '15:00',
                        videoUrl: '',
                        keyTakeaways: ['Darsning asosiy mazmuni'],
                        questions: []
                      });
                      setIsNewLesson(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-900/40 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Yangi videodars qo'shish</span>
                  </button>

                  <button
                    onClick={handleGenerateTemplates}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    title="20 ta mavzu shablonini avtomatik to'ldirish"
                  >
                    <span>⚡ 20 ta mavzu qolipi</span>
                  </button>
                </div>
              </div>

              {/* Lesson Video Slots */}
              {videoCourse && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-sky-400 tracking-wider">
                      "{videoCourse.title}" — Videodarslar ro'yxati
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Video kiritilgan: {videoCourse.lessons.filter(l => Boolean(l.videoUrl && l.videoUrl.trim())).length} / {videoCourse.lessons.length} ta
                    </span>
                  </div>

                  {videoCourse.lessons.length === 0 ? (
                    <div className="p-10 rounded-3xl bg-slate-950/70 border border-slate-800 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sky-400 flex items-center justify-center mx-auto">
                        <Video className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white">Ushbu kursda hali videodarslar kiritilmagan</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Tayyor darsliklar olib tashlandi. O'qituvchi o'zi videolarni kiritadi. Yangi dars qo'shish uchun tugmani bosing.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setEditingVideoLesson({
                              id: `lesson-${videoCourse.id}-1-${Date.now()}`,
                              lessonNumber: 1,
                              title: '',
                              description: '',
                              duration: '15:00',
                              videoUrl: '',
                              keyTakeaways: ['1-darsning asosiy mazmuni'],
                              questions: []
                            });
                            setIsNewLesson(true);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Birinchi videodarsni qo'shish</span>
                        </button>
                        <button
                          onClick={handleGenerateTemplates}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                        >
                          <span>⚡ 20 ta dars mavzusi qolipini yaratish</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                      {videoCourse.lessons.map(lesson => {
                        const hasVideo = Boolean(lesson.videoUrl && lesson.videoUrl.trim());
                        const qCount = lesson.questions?.length || 0;
                        return (
                          <div
                            key={lesson.id}
                            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-amber-400">
                                    {lesson.lessonNumber}-DARS:
                                  </span>
                                  <span className="font-bold text-white text-xs truncate max-w-[200px]">
                                    {lesson.title || `Mavzusiz (${lesson.lessonNumber}-dars)`}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                                  <span>Vaqti: <strong className="text-slate-300">{lesson.duration || '--:--'}</strong></span>
                                  <span>• Testlar: <strong className={qCount >= 10 ? "text-emerald-400" : "text-amber-400"}>{qCount} ta</strong></span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                hasVideo
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                                  : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                              }`}>
                                {hasVideo ? "Video mavjud" : "Video yuklanmagan"}
                              </span>
                            </div>

                            {hasVideo && (
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 truncate">
                                URL: {lesson.videoUrl}
                              </div>
                            )}

                            <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-2.5">
                              <button
                                onClick={() => {
                                  setQuestionCourseId(videoCourse.id);
                                  setSelectedLessonNumber(lesson.lessonNumber);
                                  setIsEditingFinalExam(false);
                                  setActiveTab('questions');
                                  const newQ: Question = {
                                    id: `q-admin-${Date.now()}`,
                                    text: '',
                                    options: ['', '', '', ''],
                                    correctIndex: 0,
                                    explanation: ''
                                  };
                                  setEditingQuestion(newQ);
                                  setIsNewQuestion(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold flex items-center gap-1 border border-emerald-800/60 transition-colors cursor-pointer"
                                title="Ushbu dars uchun test savoli qo'shish"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Test qo'shish ({qCount})</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingVideoLesson({ ...lesson });
                                    setIsNewLesson(false);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>{hasVideo ? "Tahrirlash" : "+ Video kiritish"}</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="p-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/50 transition-colors cursor-pointer"
                                  title="Darsni o'chirish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: TESTLAR BO'LIMI (User Explicit Request) */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-400">Kursni tanlang:</label>
                  <select
                    value={questionCourseId}
                    onChange={e => setQuestionCourseId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingFinalExam(false)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !isEditingFinalExam ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Dars testlari (1..20)
                  </button>
                  <button
                    onClick={() => setIsEditingFinalExam(true)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isEditingFinalExam ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    🏆 Yakuniy imtihon
                  </button>

                  {/* Explicit User Request: "savol qo'shish tugmasini qo'shib qo'y admin paneldagi testlar bo'limiga" */}
                  <button
                    onClick={() => {
                      const newQ: Question = {
                        id: `q-admin-${Date.now()}`,
                        text: '',
                        options: ['', '', '', ''],
                        correctIndex: 0,
                        explanation: ''
                      };
                      setEditingQuestion(newQ);
                      setIsNewQuestion(true);
                    }}
                    className="ml-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Savol qo'shish</span>
                  </button>
                </div>
              </div>

              {!isEditingFinalExam ? (
                /* 20 Lessons Selector */
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        onClick={() => setSelectedLessonNumber(num)}
                        className={`w-9 h-9 rounded-xl flex-shrink-0 text-xs font-bold transition-all cursor-pointer ${
                          selectedLessonNumber === num
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Question List for the selected lesson */}
                  {(() => {
                    const currentL = questionCourse?.lessons.find(l => l.lessonNumber === selectedLessonNumber);
                    const qList = currentL?.questions || [];
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                          <span>{selectedLessonNumber}-dars: "{currentL?.title}" uchun test savollari</span>
                          <span className="text-emerald-400 font-mono">Mavjud savollar: {qList.length} ta</span>
                        </div>

                        {qList.length === 0 ? (
                          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                            <FileQuestion className="w-10 h-10 text-slate-600 mx-auto" />
                            <div className="text-sm font-bold text-white">
                              Ushbu dars uchun test savollari hali kiritilmagan
                            </div>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                              O'qituvchi o'zi test tuzadi. Yuqoridagi <strong>"+ Savol qo'shish"</strong> tugmasini bosib savollarni kiriting.
                            </p>
                            <button
                              onClick={() => {
                                const newQ: Question = {
                                  id: `q-admin-${Date.now()}`,
                                  text: '',
                                  options: ['', '', '', ''],
                                  correctIndex: 0,
                                  explanation: ''
                                };
                                setEditingQuestion(newQ);
                                setIsNewQuestion(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Birinchi savolni qo'shish</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                            {qList.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="font-bold text-white leading-relaxed">
                                    <span className="text-amber-400 mr-1.5">#{qIdx + 1}.</span> {q.text}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingQuestion({ ...q });
                                        setIsNewQuestion(false);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 font-bold border border-blue-800 transition-colors cursor-pointer"
                                    >
                                      Tahrirlash
                                    </button>
                                    <button
                                      onClick={() => handleDeleteQuestion(q.id)}
                                      className="p-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 transition-colors cursor-pointer"
                                      title="O'chirish"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-300">
                                  {q.options.map((opt, optI) => (
                                    <div
                                      key={optI}
                                      className={`px-2.5 py-1 rounded-lg ${
                                        optI === q.correctIndex
                                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 font-bold'
                                          : 'bg-slate-900 text-slate-400'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optI)}) {opt} {optI === q.correctIndex && '✓ (To\'g\'ri javob)'}
                                    </div>
                                  ))}
                                </div>

                                {q.explanation && (
                                  <div className="text-[11px] text-slate-400 italic pt-1">
                                    Izoh: {q.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Final exam questions (30) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>"{questionCourse?.title}" bo'yicha yakuniy imtihon savollari</span>
                    <span>Mavjud: {questionCourse?.finalExamQuestions?.length || 0} ta</span>
                  </div>

                  {(!questionCourse?.finalExamQuestions || questionCourse.finalExamQuestions.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                      <Award className="w-10 h-10 text-amber-500 mx-auto" />
                      <div className="text-sm font-bold text-white">
                        Yakuniy imtihon savollari kiritilmagan
                      </div>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        O'qituvchi yakuniy test savollarini kiritishi kerak. Yuqoridagi <strong>"+ Savol qo'shish"</strong> tugmasini bosing.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                      {questionCourse.finalExamQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-bold text-white">
                              Savol #{idx + 1}: {q.text}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setEditingQuestion({ ...q });
                                  setIsNewQuestion(false);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold border border-amber-800 cursor-pointer"
                              >
                                Tahrirlash
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-300">
                            {q.options.map((opt, optI) => (
                              <div
                                key={optI}
                                className={`px-2.5 py-1 rounded-lg ${
                                  optI === q.correctIndex ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold' : 'bg-slate-900 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optI)}) {opt} {optI === q.correctIndex && '✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDENTS LIST (Only real registered students appear!) */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Ro'yxatdan o'tgan o'quvchilar ({students.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    O'quvchilar bosh sahifadagi "Ro'yxatdan o'tish" tugmasi orqali o'zlari ro'yxatdan o'tishadi
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Ism yoki guruh bo'yicha..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {students.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <Users className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">Hozircha o'quvchilar ro'yxatdan o'tmagan</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Barcha soxta akkauntlar olib tashlandi. O'quvchilar sayt bosh sahifasidagi <strong>"Ro'yxatdan o'tish"</strong> tugmasi orqali kirganda ushbu jadvalda avtomatik aks etadi.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">O'quvchi</th>
                        <th className="py-3 px-4">Guruhi</th>
                        <th className="py-3 px-4">Coinlar</th>
                        <th className="py-3 px-4">Dars bosqichi</th>
                        <th className="py-3 px-4">O'zlashtirish %</th>
                        <th className="py-3 px-4">Sertifikat</th>
                        <th className="py-3 px-4 text-right">Ro'yxat sanasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {students
                        .filter(s => s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || s.group.toLowerCase().includes(studentSearch.toLowerCase()))
                        .map(student => {
                          const studentProg = allProgress.find(p => p.studentId === student.id);
                          const completedCount = studentProg?.completedLessons?.length || 0;
                          const percent = Math.round((completedCount / 20) * 100);
                          const cert = certificates.find(c => c.studentId === student.id);

                          return (
                            <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                              <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-900/60 flex items-center justify-center text-blue-300 font-bold text-xs">
                                  {student.fullName.charAt(0)}
                                </div>
                                <span>{student.fullName}</span>
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-300">{student.group}</td>
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 text-[11px]">
                                  🪙 {student.coins || 0}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-sky-400">
                                  {studentProg?.currentLesson || 1} / 20-dars
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{percent}%</span>
                                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {cert ? (
                                  <button
                                    onClick={() => onViewCertificate(cert)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 hover:bg-amber-900/80 cursor-pointer"
                                  >
                                    <Award className="w-3 h-3 text-amber-400" />
                                    <span>Berilgan ({cert.certificateNumber})</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Jarayonda</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-slate-400">{student.createdAt}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Berilgan Sertifikatlar Reyestri ({certificates.length})</span>
              </h3>

              {certificates.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                  <Award className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-white">Hozircha sertifikatlar berilmagan</div>
                  <p className="text-xs text-slate-400">O'quvchilar 20 darsni va 30 talik testni 25 ta to'g'ri bilan tugatganda bu yerda avtomatik paydo bo'ladi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Raqam</th>
                        <th className="py-3 px-4">O'quvchi</th>
                        <th className="py-3 px-4">Kurs</th>
                        <th className="py-3 px-4">Imtihon bali</th>
                        <th className="py-3 px-4">Berilgan sana</th>
                        <th className="py-3 px-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {certificates.map(cert => (
                        <tr key={cert.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">{cert.certificateNumber}</td>
                          <td className="py-3 px-4 font-semibold text-white">{cert.studentName}</td>
                          <td className="py-3 px-4 text-sky-400">{cert.courseTitle}</td>
                          <td className="py-3 px-4 font-bold">{cert.finalScore} / {cert.maxScore}</td>
                          <td className="py-3 px-4 text-slate-400">{cert.issueDate}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onViewCertificate(cert)}
                              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                            >
                              Ko'rish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mavjud Fanlar va Kurslar ({courses.length})
                </h3>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi kurs qo'shish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">{c.category}</span>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                      <span>20 ta dars moduli</span>
                      <button
                        onClick={() => {
                          setVideoCourseId(c.id);
                          setActiveTab('videos');
                        }}
                        className="text-sky-300 hover:text-white font-bold"
                      >
                        Videolarni kiritish →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-white">{students.length}</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Ro'yxatdan o'tgan o'quvchilar</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-sky-400">{courses.length}</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Faol fanlar soni</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400">
                    {courses.reduce((acc, c) => acc + c.lessons.filter(l => Boolean(l.videoUrl)).length, 0)}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Yuklangan videolar soni</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">{certificates.length}</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Berilgan sertifikatlar</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>O'qituvchi hisobini yaratish</span>
                  </h3>
                  <form onSubmit={handleAddTeacher} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">O'qituvchi ism-familiyasi:</label>
                      <input
                        type="text"
                        value={teacherName}
                        onChange={e => setTeacherName(e.target.value)}
                        placeholder="Polkovnik A. Usmonov"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Kafedra / Guruh:</label>
                      <input
                        type="text"
                        value={teacherGroup}
                        onChange={e => setTeacherGroup(e.target.value)}
                        placeholder="IIV Akademiyasi"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Parol:</label>
                      <input
                        type="text"
                        value={teacherPassword}
                        onChange={e => setTeacherPassword(e.target.value)}
                        placeholder="ustoz2026"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    {teacherMsg && (
                      <div className="p-2 rounded bg-emerald-950 text-emerald-300 font-semibold">{teacherMsg}</div>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                    >
                      O'qituvchini saqlash
                    </button>
                  </form>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Tizimni tozalash</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Barcha o'quvchilar, testlar va videolarni toza holatga qaytarish.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2.5 rounded-xl bg-red-950 text-red-300 border border-red-700/60 font-bold text-xs hover:bg-red-900 cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tozalash (Reset All)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL 1: EDIT VIDEO URL FOR A LESSON */}
        {editingVideoLesson && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-sky-400" />
                  <h4 className="text-sm font-bold text-white">
                    {isNewLesson ? "Yangi videodars qo'shish" : `${editingVideoLesson.lessonNumber}-dars videosini tahrirlash`}
                  </h4>
                </div>
                <button onClick={() => setEditingVideoLesson(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideoLesson} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-slate-300 font-semibold mb-1">Dars raqami (1-20):</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={editingVideoLesson.lessonNumber}
                      onChange={e => setEditingVideoLesson({ ...editingVideoLesson, lessonNumber: parseInt(e.target.value) || 1 })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Davomiyligi (masalan: 18:45):</label>
                    <input
                      type="text"
                      value={editingVideoLesson.duration}
                      onChange={e => setEditingVideoLesson({ ...editingVideoLesson, duration: e.target.value })}
                      placeholder="15:30"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dars mavzusi / nomi:</label>
                  <input
                    type="text"
                    value={editingVideoLesson.title}
                    onChange={e => setEditingVideoLesson({ ...editingVideoLesson, title: e.target.value })}
                    placeholder="Masalan: C++ da ko'rsatkichlar va dinamik xotira"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Videodars havolasi (YouTube Embed yoki MP4 URL):
                  </label>
                  <input
                    type="text"
                    value={editingVideoLesson.videoUrl}
                    onChange={e => setEditingVideoLesson({ ...editingVideoLesson, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[11px] outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Masalan: <code>https://www.youtube.com/embed/vLnPwxZdW4Y</code> yoki to'g'ridan-to'g'ri MP4 video havolasi
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dars tavsifi / qisqacha konspekt:</label>
                  <textarea
                    rows={3}
                    value={editingVideoLesson.description}
                    onChange={e => setEditingVideoLesson({ ...editingVideoLesson, description: e.target.value })}
                    placeholder="Ushbu darsda o'rganiladigan asosiy tushunchalar..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingVideoLesson(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    Videoni saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD OR EDIT QUESTION (User explicit request: "savol qo'shish tugmasini qo'shib qo'y") */}
        {editingQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    {isNewQuestion ? "Yangi test savoli qo'shish" : "Test savolini tahrirlash"}
                  </h4>
                </div>
                <button onClick={() => setEditingQuestion(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
                {/* Target Course & Lesson/Exam selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Fan / Kurs:</label>
                    <select
                      value={questionCourseId}
                      onChange={e => setQuestionCourseId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none cursor-pointer"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Qaysi test uchun:</label>
                    <select
                      value={isEditingFinalExam ? 'final' : selectedLessonNumber}
                      onChange={e => {
                        if (e.target.value === 'final') {
                          setIsEditingFinalExam(true);
                        } else {
                          setIsEditingFinalExam(false);
                          setSelectedLessonNumber(parseInt(e.target.value));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none cursor-pointer"
                    >
                      <option value="final">🏆 Yakuniy Imtihon (30 talik)</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}-videodarslik testi (10 talik)</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Savol matni:</label>
                  <textarea
                    rows={3}
                    value={editingQuestion.text}
                    onChange={e => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                    placeholder="Savolni aniq va ravshan kiriting..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-slate-300 font-semibold">
                    Javob variantlari (To'g'ri javobni radio orqali belgilang):
                  </label>
                  {editingQuestion.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerOption"
                        checked={editingQuestion.correctIndex === i}
                        onChange={() => setEditingQuestion({ ...editingQuestion, correctIndex: i })}
                        className="w-4 h-4 text-emerald-500 cursor-pointer"
                      />
                      <span className="font-bold text-slate-300 w-5">{String.fromCharCode(65 + i)}:</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...editingQuestion.options];
                          newOpts[i] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        placeholder={`Variant ${String.fromCharCode(65 + i)}`}
                        required
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Izoh / Tushuntirish (Ixtiyoriy):</label>
                  <input
                    type="text"
                    value={editingQuestion.explanation || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    placeholder="To'g'ri javob sababi..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Savolni saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD COURSE */}
        {showAddCourseModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Yangi kurs qo'shish (20 darslik reja)</span>
                </h4>
                <button onClick={() => setShowAddCourseModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kurs nomi:</label>
                  <input
                    type="text"
                    value={newCourseTitle}
                    onChange={e => setNewCourseTitle(e.target.value)}
                    placeholder="Masalan: Harbiy Topografiya"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kategoriya:</label>
                    <input
                      type="text"
                      value={newCourseCategory}
                      onChange={e => setNewCourseCategory(e.target.value)}
                      placeholder="Kasbiy Tayyorgarlik"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nishon:</label>
                    <input
                      type="text"
                      value={newCourseBadge}
                      onChange={e => setNewCourseBadge(e.target.value)}
                      placeholder="Maxsus Kurs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tavsif:</label>
                  <textarea
                    rows={2}
                    value={newCourseDesc}
                    onChange={e => setNewCourseDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCourseModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Yaratish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: PASSWORD CHANGE */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-amber-500/60 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-base font-bold text-white">Parolni yangilash</h4>
                  <p className="text-xs text-slate-400">Yangi xavfsiz parolni kiriting</p>
                </div>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block text-slate-300 mb-1">Yangi parol:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Tasdiqlang:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  />
                </div>
                {passwordMsg && (
                  <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                    passwordMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                  }`}>
                    {passwordMsg.text}
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Yopish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Tasdiqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
