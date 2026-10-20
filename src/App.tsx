import React, { useState, useEffect } from 'react';
import { User, Course, Lesson, StudentProgress, Certificate } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseCard } from './components/CourseCard';
import { LessonPlayerView } from './components/LessonPlayerView';
import { QuizModal } from './components/QuizModal';
import { FinalExamModal } from './components/FinalExamModal';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVerifyModal } from './components/CertificateVerifyModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { AuthModal } from './components/AuthModal';
import { MyProgressView } from './components/MyProgressView';
import { CertificatesGalleryView } from './components/CertificatesGalleryView';
import { CoinMarketView } from './components/CoinMarketView';
import { IIVLogo } from './components/IIVLogo';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Award, 
  Coins, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  Filter,
  Users,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [activeTab, setActiveTab] = useState<string>('courses');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Course Player State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Modals
  const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);
  const [isFinalExamOpen, setIsFinalExamOpen] = useState<boolean>(false);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [verifyInitialCode, setVerifyInitialCode] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminPasscodeOpen, setIsAdminPasscodeOpen] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  // Sync state on local storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setCourses(StorageService.getCourses());
    };
    window.addEventListener('iiv-storage-update', handleUpdate);
    return () => window.removeEventListener('iiv-storage-update', handleUpdate);
  }, []);

  // Check URL query for certificate verification parameter (?verify=IIV-CERT-2026-XXXXX)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyCode = urlParams.get('verify');
    if (verifyCode) {
      setVerifyInitialCode(verifyCode);
      setIsVerifyModalOpen(true);
    }
  }, []);

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSelectCourse = (course: Course) => {
    if (!currentUser) {
      setAuthModal({ isOpen: true, mode: 'register' });
      return;
    }
    setActiveCourse(course);
  };

  const handleOpenCertificate = (cert: Certificate) => {
    setViewingCertificate(cert);
  };

  const handleViewCertificateByCourse = (courseId: string) => {
    if (!currentUser) return;
    const progress = StorageService.getProgress(currentUser.id, courseId);
    if (progress.certificateId) {
      const cert = StorageService.getCertificateById(progress.certificateId);
      if (cert) {
        setViewingCertificate(cert);
        return;
      }
    }
    const cert = StorageService.getCertificates().find(
      c => c.studentId === currentUser.id && c.courseId === courseId
    );
    if (cert) {
      setViewingCertificate(cert);
    }
  };

  // Admin access control (Passcode required: 'iiv admin')
  const handleOpenAdminClick = () => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
      setIsAdminOpen(true);
    } else {
      setIsAdminPasscodeOpen(true);
    }
  };

  // Submit Lesson Quiz (10 questions, >= 6 passed)
  const handleQuizCompleted = (score: number, total: number) => {
    if (!activeCourse || !quizLesson) return;
    const studentId = currentUser?.id || 'student-demo';

    StorageService.recordLessonResult(
      studentId,
      activeCourse.id,
      quizLesson.lessonNumber,
      score,
      total
    );

    setCourses(StorageService.getCourses());
  };

  // Advance to next lesson
  const handleAdvanceToNextLesson = () => {
    if (!activeCourse || !quizLesson) return;
    const nextNum = quizLesson.lessonNumber + 1;
    const nextL = activeCourse.lessons.find(l => l.lessonNumber === nextNum);
    if (nextL) {
      setQuizLesson(null);
    }
  };

  // Submit Final Exam (30 questions, >= 25 passed -> certificate + 50 coins!)
  const handleSubmitFinalExam = (score: number, total: number) => {
    if (!activeCourse) return { passed: false };
    const studentId = currentUser?.id || 'student-demo';

    const result = StorageService.recordFinalExamResult(
      studentId,
      activeCourse.id,
      score,
      total
    );

    setCourses(StorageService.getCourses());
    setCurrentUser(StorageService.getCurrentUser());
    return result;
  };

  // Categories filter list
  const categories = ['all', 'Axborot Texnologiyalari', 'Ijtimoiy-Gumanitar', 'Xorijiy Tillar'];

  const filteredCourses = courses.filter(c => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // User explicit instruction: "foydalanuvchi kirishi bilan faqat ro`yxatdan o`tish tugmasi bilan admin panel tugmasi tursin va iiv masofaviy talim, test va elektron sertifikatlash portali degan yozuv bilan logotip tursin boshqa hech nima bo`lmasin"
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
        {/* Uzbekistan Flag Top Ribbon */}
        <div className="h-2 w-full flex flex-shrink-0">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,rgba(14,165,233,0.08),rgba(0,0,0,0))] pointer-events-none"></div>

        {/* Center Portal Landing: EXACTLY Logo, Title, Ro'yxatdan o'tish and Admin panel buttons */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 my-auto">
          <div className="text-center max-w-3xl mx-auto space-y-8 flex flex-col items-center">
            {/* Official IIV Emblem */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 drop-shadow-2xl select-none">
              <img
                src="/assets/aistudio/image_376cdd9c.png"
                alt="O'zbekiston Respublikasi Ichki Ishlar Vazirligi"
                className="w-full h-full object-contain filter drop-shadow-2xl rounded-full pointer-events-none"
              />
            </div>

            {/* Exact Required Title */}
            <div className="space-y-3">
              <div className="text-xs sm:text-sm font-black tracking-[0.25em] text-amber-400 uppercase font-serif-title">
                O'ZBEKISTON RESPUBLIKASI ICHKI ISHLAR VAZIRLIGI
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-serif-title">
                IIV masofaviy ta'lim, test va <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  elektron sertifikatlash portali
                </span>
              </h1>
            </div>

            {/* Exactly Two Buttons: Ro'yxatdan o'tish and Admin panel */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-2xl shadow-blue-600/40 border border-blue-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Users className="w-5 h-5" />
                <span>Ro‘yxatdan o‘tish</span>
              </button>

              <button
                onClick={handleOpenAdminClick}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-base shadow-2xl shadow-amber-950/50 border border-amber-500/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-amber-200" />
                <span>Admin panel</span>
              </button>
            </div>

            {/* Subtle login link for returning students */}
            <div className="pt-2">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
              >
                Allaqachon ro‘yxatdan o‘tganmisiz? Tizimga kirish
              </button>
            </div>
          </div>
        </div>

        {/* Uzbekistan Flag Bottom Ribbon */}
        <div className="h-1.5 w-full flex flex-shrink-0">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Modals for unauthenticated user */}
        {authModal.isOpen && (
          <AuthModal
            initialMode={authModal.mode}
            onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
            onSuccess={user => {
              setCurrentUser(user);
              setAuthModal({ isOpen: false, mode: 'login' });
            }}
          />
        )}

        {isAdminPasscodeOpen && (
          <AdminPasscodeModal
            onClose={() => setIsAdminPasscodeOpen(false)}
            onSuccess={() => {
              setIsAdminPasscodeOpen(false);
              setIsAdminOpen(true);
            }}
          />
        )}

        {isAdminOpen && (
          <AdminPanel
            currentUser={currentUser}
            onClose={() => setIsAdminOpen(false)}
            onViewCertificate={handleOpenCertificate}
            onDataChanged={() => {
              setCourses(StorageService.getCourses());
              setCurrentUser(StorageService.getCurrentUser());
            }}
          />
        )}

        {isVerifyModalOpen && (
          <CertificateVerifyModal
            initialCode={verifyInitialCode}
            onClose={() => setIsVerifyModalOpen(false)}
            onViewCertificate={handleOpenCertificate}
          />
        )}

        {viewingCertificate && (
          <CertificateModal
            certificate={viewingCertificate}
            onClose={() => setViewingCertificate(null)}
            onVerify={code => {
              setViewingCertificate(null);
              setVerifyInitialCode(code);
              setIsVerifyModalOpen(true);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Institutional Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          setActiveCourse(null);
        }}
        onOpenAuth={mode => setAuthModal({ isOpen: true, mode })}
        onOpenAdmin={handleOpenAdminClick}
        onOpenVerify={() => {
          setVerifyInitialCode('');
          setIsVerifyModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If viewing a single course lesson player */}
        {activeCourse ? (
          <LessonPlayerView
            course={activeCourse}
            progress={StorageService.getProgress(currentUser?.id || 'student-demo', activeCourse.id)}
            onBack={() => setActiveCourse(null)}
            onStartQuiz={lesson => setQuizLesson(lesson)}
            onStartFinalExam={() => setIsFinalExamOpen(true)}
            onViewCertificate={() => handleViewCertificateByCourse(activeCourse.id)}
          />
        ) : activeTab === 'coin-market' ? (
          /* Coin Market View (Required by prompt) */
          <CoinMarketView
            currentUser={currentUser}
            onOpenAuth={() => setAuthModal({ isOpen: true, mode: 'login' })}
          />
        ) : activeTab === 'my-progress' && currentUser ? (
          /* Student's Personal Progress Dashboard */
          <MyProgressView
            currentUser={currentUser}
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onViewCertificate={handleOpenCertificate}
          />
        ) : activeTab === 'certificates' ? (
          /* Certificates Public Gallery & Registry */
          <CertificatesGalleryView
            onViewCertificate={handleOpenCertificate}
            onOpenVerify={code => {
              setVerifyInitialCode(code || '');
              setIsVerifyModalOpen(true);
            }}
          />
        ) : (
          /* Standard Home & Courses List */
          <div className="space-y-10 pb-16">
            {/* Hero Banner with side-by-side Ro'yxatdan o'tish and Admin panel buttons */}
            <HeroSection
              currentUser={currentUser}
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenVerify={() => {
                setVerifyInitialCode('');
                setIsVerifyModalOpen(true);
              }}
              onOpenRegister={() => setAuthModal({ isOpen: true, mode: 'register' })}
              onOpenAdmin={handleOpenAdminClick}
              onOpenCoinMarket={() => setActiveTab('coin-market')}
            />

            {/* Courses Section (Including Ona tili) */}
            <div id="courses-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Section Header & Filters */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                    <BookOpen className="w-4 h-4" />
                    <span>O'quv Dasturlari (Jami 6 ta fan)</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    IIV Fanlari va Ta'lim Kurslari
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Har bir kurs 20 ta videodars, 10 talik testlar, 30 talik yakuniy imtihon va 50 Coin mukofotiga ega.
                  </p>
                </div>

                {/* Search Bar & Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Kurs nomini qidirish..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat === 'all' ? 'Barchasi' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={currentUser ? StorageService.getProgress(currentUser.id, course.id) : undefined}
                    onSelectCourse={handleSelectCourse}
                    onViewCertificate={handleViewCertificateByCourse}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
        {/* Uzbekistan Flag Bottom Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <IIVLogo size="md" showText={true} />
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                O'zbekiston Respublikasi Ichki Ishlar Vazirligi xodimlari va tinglovchilari uchun masofaviy ta'lim, 20 bosqichli test, yakuniy sertifikatlash va Coin rag'batlantirish tizimi.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Asosiy Yo'nalishlar (6 ta fan)
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• IT kursi — C++ (20 dars)</li>
                <li>• Tarix (20 dars)</li>
                <li>• Ingliz tili (20 dars)</li>
                <li>• Rus tili (20 dars)</li>
                <li>• Python (20 dars)</li>
                <li>• Ona tili (20 dars)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Bog'lanish va Xizmatlar
              </h4>
              <div className="space-y-1.5 text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Toshkent sh., Yunusobod tumani</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ishonch telefoni: 1102 / 102</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>info@iiv.uz</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 O'zbekiston Respublikasi Ichki Ishlar Vazirligi. Barcha huquqlar himoyalangan.
            </div>
            <div className="flex items-center gap-4">
              <span>Davlat ta'lim standarti</span>
              <span>•</span>
              <span>Elektron reyestr</span>
              <span>•</span>
              <span>1 Sertifikat = 50 Coin</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 10-Question Lesson Quiz Modal */}
      {quizLesson && activeCourse && (
        <QuizModal
          lesson={quizLesson}
          courseTitle={activeCourse.title}
          onClose={() => setQuizLesson(null)}
          onQuizCompleted={handleQuizCompleted}
          onAdvanceToNextLesson={handleAdvanceToNextLesson}
        />
      )}

      {/* 30-Question Final Exam Modal */}
      {isFinalExamOpen && activeCourse && (
        <FinalExamModal
          course={activeCourse}
          onClose={() => setIsFinalExamOpen(false)}
          onSubmitExam={handleSubmitFinalExam}
          onViewGeneratedCertificate={cert => {
            setIsFinalExamOpen(false);
            setViewingCertificate(cert);
          }}
        />
      )}

      {/* Certificate Modal */}
      {viewingCertificate && (
        <CertificateModal
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
          onVerify={code => {
            setVerifyInitialCode(code);
            setIsVerifyModalOpen(true);
          }}
        />
      )}

      {/* Public Certificate Verification Modal */}
      {isVerifyModalOpen && (
        <CertificateVerifyModal
          initialCode={verifyInitialCode}
          onClose={() => {
            setIsVerifyModalOpen(false);
            setVerifyInitialCode('');
          }}
          onViewCertificate={cert => {
            setIsVerifyModalOpen(false);
            setViewingCertificate(cert);
          }}
        />
      )}

      {/* Admin Passcode Modal (Checks 'iiv admin') */}
      {isAdminPasscodeOpen && (
        <AdminPasscodeModal
          onClose={() => setIsAdminPasscodeOpen(false)}
          onSuccess={() => {
            setIsAdminPasscodeOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          currentUser={currentUser}
          onClose={() => setIsAdminOpen(false)}
          onViewCertificate={cert => {
            setIsAdminOpen(false);
            setViewingCertificate(cert);
          }}
          onDataChanged={() => {
            setCourses(StorageService.getCourses());
            setCurrentUser(StorageService.getCurrentUser());
          }}
        />
      )}

      {/* Auth Modal (Login / Register: Ism, Guruh, Parol) */}
      {authModal.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={user => {
            setCurrentUser(user);
            setAuthModal({ isOpen: false, mode: 'login' });
          }}
        />
      )}
    </div>
  );
}
