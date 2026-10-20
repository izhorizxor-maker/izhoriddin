import React, { useState, useEffect } from 'react';
import { Course, Question, Certificate } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface Props {
  course: Course;
  onClose: () => void;
  onSubmitExam: (score: number, total: number) => { passed: boolean; certificate?: Certificate };
  onViewGeneratedCertificate: (cert: Certificate) => void;
}

export const FinalExamModal: React.FC<Props> = ({
  course,
  onClose,
  onSubmitExam,
  onViewGeneratedCertificate
}) => {
  const questions: Question[] = course.finalExamQuestions || [];
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Yakuniy imtihon testlari kiritilmagan</h3>
            <p className="text-xs text-slate-400">
              "{course.title}" bo'yicha 30 talik yakuniy imtihon savollari o'qituvchi tomonidan Admin panel orqali tuzilishi kutilmoqda.
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
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes (1800s)
  const [score, setScore] = useState(0);
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, selectedAnswers]);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIndex
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

  const handleFinalSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);

    const result = onSubmitExam(finalScore, totalQuestions);

    if (result.passed && result.certificate) {
      setGeneratedCert(result.certificate);
      // Grand celebration effect!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setTimeLeft(1800);
    setScore(0);
    setGeneratedCert(null);
  };

  const isPassed = score >= 25; // 25 out of 30 required by prompt
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = questions[currentIdx];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Uzbekistan Flag Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  DAVLAT YAKUNIY IMTIHONI
                </span>
                <span className="text-xs text-slate-400 font-medium">• 30 ta savol</span>
              </div>
              <h2 className="text-lg font-black text-white">
                {course.title} — Sertifikatlash imtihoni
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 font-mono text-sm font-bold text-amber-300">
                <Clock className="w-4 h-4" />
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

        {/* Body */}
        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            {/* Top Requirement Banner */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-700/40 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Sertifikat olish sharti:</strong> 30 ta savoldan kamida 25 tasiga (83.3%) to'g'ri javob berish lozim.
                </span>
              </div>
              <div className="font-mono font-bold text-slate-300">
                Javob berildi: {answeredCount} / 30
              </div>
            </div>

            {/* 30 Questions Grid Indicator */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Savollar ro'yxati (1 - 30):
              </div>
              <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentIdx === i
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : selectedAnswers[i] !== undefined
                        ? 'bg-blue-900/80 border border-blue-400/50 text-blue-200'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5">
                <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  <span className="text-amber-400 font-mono mr-2">#{currentIdx + 1}.</span>
                  {currentQuestion.text}
                </div>

                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
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
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                  >
                    Keyingi savol
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-black text-white uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                  >
                    Imtihonni topshirish
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Submission Results */
          <div className="p-8 space-y-6 text-center">
            <div className={`p-8 rounded-3xl border space-y-4 ${
              isPassed
                ? 'bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-500/60 shadow-2xl'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                {isPassed ? (
                  <div className="w-full h-full rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Award className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-red-600/80 text-white flex items-center justify-center">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  {isPassed ? "Tabriklaymiz! Davlat sertifikati taqdim etildi" : "Imtihon bali yetarli emas"}
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                  {isPassed
                    ? `Siz 30 ta savoldan ${score} tasiga to‘g‘ri javob berdingiz (kamida 25 ta talab qilinadi). O‘zbekiston Respublikasi IIV tomonidan rasmiy elektron sertifikatingiz yaratildi!`
                    : `Siz 30 ta savoldan ${score} tasiga to‘g‘ri javob berdingiz. Sertifikat olish uchun kamida 25 ta to‘g‘ri javob talab etiladi. Kurs materiallarini qayta ko'rib chiqib, qayta topshirishingiz mumkin.`}
                </p>
              </div>

              {/* Score pill */}
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-mono">
                <span className="text-slate-400">Natija:</span>
                <span className={`text-2xl font-black ${isPassed ? 'text-amber-400' : 'text-red-400'}`}>
                  {score} / 30 ({Math.round((score / 30) * 100)}%)
                </span>
                <span className="text-slate-400">| Holati:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                  isPassed ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-red-950 text-red-300 border border-red-600/40'
                }`}>
                  {isPassed ? "SERTIFIKAT BERILDI" : "YETARLI EMAS"}
                </span>
              </div>

              {/* Big Action: Open Certificate */}
              {isPassed && generatedCert && (
                <div className="pt-4">
                  <button
                    onClick={() => {
                      onClose();
                      onViewGeneratedCertificate(generatedCert);
                    }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>Elektron sertifikatni ko'rish va yuklab olish</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Retry / Close */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Imtihonni qayta topshirish</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
