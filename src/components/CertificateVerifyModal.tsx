import React, { useState } from 'react';
import { Certificate } from '../types';
import { StorageService } from '../services/storage';
import { 
  X, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  Calendar, 
  User, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface Props {
  initialCode?: string;
  onClose: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const CertificateVerifyModal: React.FC<Props> = ({
  initialCode = '',
  onClose,
  onViewCertificate
}) => {
  const [query, setQuery] = useState(initialCode);
  const [result, setResult] = useState<Certificate | null | undefined>(() => {
    if (initialCode) {
      return StorageService.getCertificateByNumber(initialCode);
    }
    return undefined;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialCode));

  React.useEffect(() => {
    if (initialCode) {
      setQuery(initialCode);
      const found = StorageService.getCertificateByNumber(initialCode);
      setResult(found || null);
      setHasSearched(true);
    }
  }, [initialCode]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const cert = StorageService.getCertificateByNumber(query);
    setResult(cert || null);
    setHasSearched(true);
  };

  const sampleNumbers = ['IIV-CERT-2026-78421'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                IIV Sertifikatini Tekshirish Tizimi
              </h3>
              <p className="text-xs text-slate-400">
                O'zbekiston Respublikasi IIV yagona elektron reyestri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Sertifikatning noyob raqamini kiriting (masalan: <span className="font-mono text-amber-400">IIV-CERT-2026-XXXXX</span>):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="IIV-CERT-2026-78421"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-mono text-sm placeholder:text-slate-600 outline-none uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Tekshirish</span>
              </button>
            </div>

            {/* Quick Demo Clickable chips */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Namuna:</span>
              {sampleNumbers.map(code => (
                <button
                  type="button"
                  key={code}
                  onClick={() => {
                    setQuery(code);
                    const found = StorageService.getCertificateByNumber(code);
                    setResult(found || null);
                    setHasSearched(true);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono cursor-pointer border border-slate-700"
                >
                  {code}
                </button>
              ))}
            </div>
          </form>

          {/* Search Results Display */}
          {hasSearched && (
            <div>
              {result ? (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>SERTIFIKAT HAQIQIY VA RO'YXATGA OLINGAN</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/40">
                      Holati: Faol
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>O'quvchi ism-familiyasi:</span>
                      </div>
                      <div className="text-white font-bold text-sm">{result.studentName}</div>
                      <div className="text-slate-400">Guruhi: {result.studentGroup}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <span>Tamomlagan kursi:</span>
                      </div>
                      <div className="text-white font-bold text-sm">{result.courseTitle}</div>
                      <div className="text-amber-400 font-semibold">
                        Imtihon natijasi: {result.finalScore} / {result.maxScore} ball
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sertifikat raqami:</span>
                      </div>
                      <div className="font-mono text-white font-bold">{result.certificateNumber}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Berilgan sana:</span>
                      </div>
                      <div className="text-white font-bold">{result.issueDate}</div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onViewCertificate(result);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <span>Sertifikat asl nusxasini ko'rish</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-red-950/30 border border-red-700/50 text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Bunday raqamli sertifikat topilmadi
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Kiritilgan <code className="text-amber-300 font-mono font-bold">{query}</code> raqami IIV reyestrida mavjud emas yoki noto'g'ri kiritilgan bo'lishi mumkin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
