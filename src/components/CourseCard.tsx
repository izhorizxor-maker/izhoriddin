import React from 'react';
import { Course, StudentProgress } from '../types';
import { Play, Award, CheckCircle2, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface Props {
  course: Course;
  progress?: StudentProgress;
  onSelectCourse: (course: Course) => void;
  onViewCertificate?: (courseId: string) => void;
}

export const CourseCard: React.FC<Props> = ({
  course,
  progress,
  onSelectCourse,
  onViewCertificate
}) => {
  const completedCount = progress?.completedLessons?.length || 0;
  const total = course.totalLessons || 20;
  const percent = Math.round((completedCount / total) * 100);
  const currentLessonNum = progress?.currentLesson || 1;
  const isFinished = progress?.certificateEarned || (completedCount >= 20 && progress?.finalExam?.passed);

  return (
    <div className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col overflow-hidden">
      {/* Top Banner & Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-slate-950">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        {/* Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.accentColor }}></span>
          <span>{course.badge}</span>
        </div>

        {/* Status tag */}
        {isFinished ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-xs font-bold text-emerald-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Sertifikatlangan</span>
          </div>
        ) : completedCount > 0 ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/90 backdrop-blur-md border border-blue-500/50 text-xs font-bold text-blue-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentLessonNum}-darsda</span>
          </div>
        ) : null}
      </div>

      {/* Course Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {course.category}
          </div>
          <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{completedCount} / {total} videodars tugatildi</span>
            </span>
            <span className="font-bold text-white">{percent}%</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFinished
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                  : 'bg-gradient-to-r from-blue-600 to-sky-400'
              }`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {isFinished && onViewCertificate ? (
            <button
              onClick={() => onViewCertificate(course.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Sertifikatni ko'rish</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectCourse(course)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {completedCount === 0 ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Kursni boshlash</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>{currentLessonNum}-darsni davom ettirish</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onSelectCourse(course)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Darslar rejasini ko'rish"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
