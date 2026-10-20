import React, { useState } from 'react';
import { Course, Lesson, StudentProgress } from '../types';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Award, 
  ArrowLeft, 
  Sparkles, 
  FileQuestion, 
  RotateCcw,
  BookOpen,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Props {
  course: Course;
  progress: StudentProgress;
  onBack: () => void;
  onStartQuiz: (lesson: Lesson) => void;
  onStartFinalExam: () => void;
  onViewCertificate?: () => void;
}

export const LessonPlayerView: React.FC<Props> = ({
  course,
  progress,
  onBack,
  onStartQuiz,
  onStartFinalExam,
  onViewCertificate
}) => {
  // Guard if course has no lessons yet
  if (!course.lessons || course.lessons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kurslarga qaytish</span>
        </button>

        <div className="p-10 sm:p-14 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-sky-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              "{course.title}" kursida darslar kutilmoqda
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Tayyor darsliklar olib tashlandi. Kurs o'qituvchisi Admin panel orqali videodarslar va test savollarini joylagach, ushbu sahifada darslar avtomatik ochiladi.
            </p>
          </div>
          <div className="pt-3">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              Boshqa kurslarni ko'rish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current active lesson in the player
  const [selectedLessonNumber, setSelectedLessonNumber] = useState<number>(() => {
    return course.lessons[0]?.lessonNumber || 1;
  });

  const [hasWatchedVideo, setHasWatchedVideo] = useState<boolean>(false);

  const selectedLesson = course.lessons.find(l => l.lessonNumber === selectedLessonNumber) || course.lessons[0];
  const completedSet = new Set(progress.completedLessons || []);
  const all20Completed = completedSet.size >= 20;

  const currentScoreRecord = progress.lessonScores?.[selectedLessonNumber];
  const isSelectedPassed = currentScoreRecord?.passed ?? false;

  const handleSelectLesson = (num: number) => {
    if (num <= progress.currentLesson || completedSet.has(num)) {
      setSelectedLessonNumber(num);
      setHasWatchedVideo(false);
    }
  };

  const handleMarkWatched = () => {
    setHasWatchedVideo(true);
    if (!selectedLesson.questions || selectedLesson.questions.length === 0) {
      alert("Ushbu dars uchun test savollari hali o'qituvchi tomonidan kiritilmagan. Admin paneldan savollar qo'shilishi kutilmoqda.");
      return;
    }
    onStartQuiz(selectedLesson);
  };

  const hasVideoUrl = Boolean(selectedLesson.videoUrl && selectedLesson.videoUrl.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kurslarga qaytish</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>{course.category}</span>
            <span>/</span>
            <span className="text-white font-bold">{course.title}</span>
          </div>
        </div>

        {/* Course completion status pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">O'zlashtirish bosqichi</div>
            <div className="text-sm font-bold text-sky-400">
              {completedSet.size} / 20 dars ({Math.round((completedSet.size / 20) * 100)}%)
            </div>
          </div>
          {progress.certificateEarned && onViewCertificate && (
            <button
              onClick={onViewCertificate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Sertifikat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Video Player & Info | Right Lessons Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player & Active Lesson Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              {hasVideoUrl ? (
                selectedLesson.videoUrl.includes('youtube.com') || selectedLesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={`${selectedLesson.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                    title={selectedLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={selectedLesson.videoUrl}
                    controls
                    className="w-full h-full"
                    poster={selectedLesson.videoPoster}
                  />
                )
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Play className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-300">
                    {selectedLesson.lessonNumber}-dars videosi yuklanmagan
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    O'qituvchi tomonidan Admin panel orqali video havola kiritilishi kutilmoqda.
                  </p>
                </div>
              )}
            </div>

            {/* Video Footer Status */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800/60 font-mono text-xs font-bold">
                  {selectedLesson.lessonNumber}-DARS
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Davomiyligi: {selectedLesson.duration}</span>
                </span>
              </div>

              {/* Requirement: "O‘quvchi videoni ko‘rgach, “Ko‘rib bo‘ldim” tugmasini bosadi. Shundan so‘ng 10 ta savoldan iborat test ochiladi." */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkWatched}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Ko‘rib bo‘ldim — Testni boshlash</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Metadata & Overview Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Mavzu mazmuni va amaliyoti
                </span>
                {isSelectedPassed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Topshirilgan ({currentScoreRecord?.score}/10 ball)
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                {selectedLesson.lessonNumber}. {selectedLesson.title}
              </h1>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {selectedLesson.description}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asosiy bilim va talablar (Ushbu darsdan o'rganiladiganlar)</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedLesson.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Test rules note */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>
                  <strong>Test sharti:</strong> 10 ta savoldan kamida 6 tasiga (60%) to'g'ri javob berilsa, keyingi dars avtomatik ochiladi.
                </span>
              </div>
              <button
                onClick={() => onStartQuiz(selectedLesson)}
                className="inline-flex items-center gap-1 font-bold text-sky-300 hover:text-white underline cursor-pointer flex-shrink-0 ml-2"
              >
                <span>Testni ochish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 20 Lessons Playlist + Final Exam Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Kurs mundarijasi (20 ta dars)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {completedSet.size}/20
              </span>
            </div>

            {/* 20 Lessons Scrollable List */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {course.lessons.map(lesson => {
                const isPassed = completedSet.has(lesson.lessonNumber);
                const isCurrent = lesson.lessonNumber === selectedLessonNumber;
                const isUnlocked = lesson.lessonNumber <= progress.currentLesson || isPassed;
                const scoreRecord = progress.lessonScores?.[lesson.lessonNumber];

                return (
                  <button
                    key={lesson.id}
                    disabled={!isUnlocked}
                    onClick={() => handleSelectLesson(lesson.lessonNumber)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : isPassed
                        ? 'bg-slate-950/60 border-emerald-900/40 text-slate-200 hover:bg-slate-800/80 cursor-pointer'
                        : isUnlocked
                        ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-850 cursor-pointer'
                        : 'bg-slate-950/20 border-slate-850 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex-shrink-0">
                        {isPassed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : isUnlocked ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {lesson.lessonNumber}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-slate-600">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {lesson.lessonNumber}. {lesson.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{lesson.duration}</span>
                          {scoreRecord && (
                            <span className="text-emerald-400 font-bold">
                              • Natija: {scoreRecord.score}/10 ball
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isUnlocked && (
                      <div className="flex-shrink-0">
                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                            Ko'rilmoqda
                          </span>
                        ) : (
                          <Play className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 21st Special Block: Yakuniy Imtihon (30 ta savol) */}
            <div className="pt-3 border-t border-slate-800">
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  all20Completed
                    ? 'bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border-amber-500/50 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      all20Completed ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider">
                        Yakuniy Imtihon
                      </div>
                      <div className="text-[10px] text-slate-400">
                        30 ta savol • Kamida 25 ta to'g'ri (83%)
                      </div>
                    </div>
                  </div>

                  {all20Completed ? (
                    <button
                      onClick={onStartFinalExam}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Imtihonni topshirish
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Lock className="w-3 h-3" />
                      <span>20 darsdan so'ng</span>
                    </div>
                  )}
                </div>

                {progress.finalExam && (
                  <div className="mt-2.5 pt-2 border-t border-amber-900/40 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Oxirgi imtihon bali:</span>
                    <span className={`font-bold ${progress.finalExam.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {progress.finalExam.score} / 30 {progress.finalExam.passed ? '(O\'tdi)' : '(Yetarli emas)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
