import React from 'react';
import { User, Course, StudentProgress, Certificate } from '../types';
import { StorageService } from '../services/storage';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  User as UserIcon,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface Props {
  currentUser: User;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const MyProgressView: React.FC<Props> = ({
  currentUser,
  courses,
  onSelectCourse,
  onViewCertificate
}) => {
  const allProgress = StorageService.getAllProgress().filter(p => p.studentId === currentUser.id);
  const myCertificates = StorageService.getCertificatesForStudent(currentUser.id);

  // Calculate totals
  let totalLessonsPassed = 0;
  allProgress.forEach(p => {
    totalLessonsPassed += p.completedLessons?.length || 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border-2 border-blue-500/60 flex items-center justify-center text-blue-300 font-black text-2xl shadow-lg">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                IIV Tinglovchisi
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                {currentUser.group}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {currentUser.fullName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ro'yxatdan o'tgan sana: {currentUser.createdAt}
            </p>
          </div>
        </div>

        {/* Stats Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-black text-sky-400">{totalLessonsPassed}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Tugatilgan darslar</div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-black text-amber-400">{myCertificates.length}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Qo'lga kiritilgan sertifikatlar</div>
          </div>
        </div>
      </div>

      {/* Active Courses Progress Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Kurslar bo'yicha shaxsiy o'zlashtirish</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Jami {courses.length} ta mavjud kurs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const progress = StorageService.getProgress(currentUser.id, course.id);
            const completedCount = progress.completedLessons?.length || 0;
            const percent = Math.round((completedCount / 20) * 100);
            const isCert = progress.certificateEarned;
            const certObj = isCert ? StorageService.getCertificates().find(c => c.id === progress.certificateId) : null;

            return (
              <div
                key={course.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase">
                      {course.category}
                    </span>
                    {isCert && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded-md">
                        <Award className="w-3 h-3" /> Sertifikat
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {course.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {course.description}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Bosqich: {progress.currentLesson} / 20-dars</span>
                    <span className="font-bold text-white">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCert ? 'bg-gradient-to-r from-emerald-500 to-amber-400' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>{completedCount === 0 ? "Boshlash" : "Darsga o'tish"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {isCert && certObj && (
                    <button
                      onClick={() => onViewCertificate(certObj)}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                      title="Sertifikatni ko'rish"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Certificates Section */}
      {myCertificates.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Mening sertifikatlarim ({myCertificates.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCertificates.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950/20 border border-amber-500/40 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {cert.certificateNumber}
                  </div>
                  <div className="text-base font-bold text-white">
                    {cert.courseTitle}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Berilgan: {cert.issueDate}</span>
                    <span>• Ball: {cert.finalScore}/30</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewCertificate(cert)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex-shrink-0"
                >
                  Sertifikatni ko'rish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
