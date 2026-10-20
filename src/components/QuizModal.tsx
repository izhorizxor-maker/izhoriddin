import React, { useState, useEffect } from 'react';
import { Lesson, Question } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight, 
  Award,
  AlertCircle,
  FileQuestion
} from 'lucide-react';

interface Props {
  lesson: Lesson;
  courseTitle: string;
  onClose: () => void;
  onQuizCompleted: (score: number, total: number) => void;
  onAdvanceToNextLesson?: () => void;
}

export const QuizModal: React.FC<Props> = ({
  lesson,
  courseTitle,
  onClose,
  onQuizCompleted,
  onAdvanceToNextLesson
}) => {
  const questions: Question[] = lesson.questions || [];
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Test savollari hali kiritilmagan</h3>
            <p className="text-xs text-slate-400">
              {lesson.lessonNumber}-dars uchun test savollari o'qituvchi tomonidan Admin panel orqali tuzilishi kutilmoqda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tushunarli, yopish
          </button>
        </div>
      </div>
    );
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [score, setScore] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, selectedAnswers]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    onQuizCompleted(finalScore, totalQuestions);

    if (finalScore >= 6) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setTimeLeft(600);
    setScore(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isPassed = score >= 6;
  const currentQuestion = questions[currentIdx];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Uzbekistan Flag Ribbon */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 text-xs font-mono font-bold">
                {lesson.lessonNumber}-DARS TESTI
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {courseTitle}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {lesson.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            {/* Progress Bar & Question Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Savol {currentIdx + 1} / {totalQuestions}</span>
                <span>Belgilandi: {answeredCount} / {totalQuestions}</span>
              </div>

              {/* Number navigation dots */}
              <div className="grid grid-cols-10 gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentIdx === i
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                        : selectedAnswers[i] !== undefined
                        ? 'bg-blue-950/80 border border-blue-500/50 text-blue-200'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Block */}
            {currentQuestion && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  <span className="text-blue-400 mr-2">{currentIdx + 1}.</span>
                  {currentQuestion.text}
                </div>

                {/* 4 Multiple Choice Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {letter}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
              >
                Oldingi savol
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Keyingi savol
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    Testni yakunlash
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Submission Results View */
          <div className="p-6 space-y-6">
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${
              isPassed
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-amber-950/40 border-amber-500/50'
            }`}>
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                {isPassed ? (
                  <div className="w-full h-full rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-amber-600 flex items-center justify-center text-white">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  {isPassed ? "Tabriklaymiz! Test muvaffaqiyatli topshirildi" : "O'tish bali to'planmadi"}
                </h4>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  {isPassed
                    ? `Siz 10 ta savoldan ${score} tasiga to‘g‘ri javob berdingiz (kamida 6 ta kerak). Keyingi videodars ochildi!`
                    : `Siz 10 ta savoldan ${score} tasiga to‘g‘ri javob berdingiz. Keyingi bosqichga o‘tish uchun kamida 6 ta to‘g‘ri javob zarur.`}
                </p>
              </div>

              {/* Score pill */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono">
                <span className="text-slate-400">Natija:</span>
                <span className={`text-lg font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {score} / 10 ball ({score * 10}%)
                </span>
                <span className="text-slate-400">| Holati:</span>
                <span className={`font-bold ${isPassed ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isPassed ? "O'TDI" : "O'TMADI"}
                </span>
              </div>
            </div>

            {/* Question Breakdown and Explanations Review */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Savollar tahlili va to'g'ri javoblar
              </h5>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {questions.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-red-950/20 border-red-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-white">
                          {idx + 1}. {q.text}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> To'g'ri
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-bold flex-shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> Noto'g'ri
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">To'g'ri javob: </span>
                        <strong className="text-emerald-300">{q.options[q.correctIndex]}</strong>
                      </div>
                      {q.explanation && (
                        <div className="text-[11px] text-slate-400 italic">
                          Tushuntirish: {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Testni qayta topshirish</span>
              </button>

              <div className="flex items-center gap-3">
                {isPassed && onAdvanceToNextLesson && lesson.lessonNumber < 20 && (
                  <button
                    onClick={() => {
                      onClose();
                      onAdvanceToNextLesson();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>Keyingi videodarsga o‘tish ({lesson.lessonNumber + 1}-dars)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
