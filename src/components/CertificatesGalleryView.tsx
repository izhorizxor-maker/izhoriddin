import React, { useState } from 'react';
import { Certificate } from '../types';
import { StorageService } from '../services/storage';
import { 
  Award, 
  Search, 
  ShieldCheck, 
  Printer, 
  Calendar, 
  User as UserIcon, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';

interface Props {
  onViewCertificate: (cert: Certificate) => void;
  onOpenVerify: (certCode?: string) => void;
}

export const CertificatesGalleryView: React.FC<Props> = ({
  onViewCertificate,
  onOpenVerify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const certificates = StorageService.getCertificates();

  const filtered = certificates.filter(c => 
    c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.studentGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Award className="w-4 h-4" />
            <span>Davlat Elektron Reyestri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Berilgan Rasmiy Elektron Sertifikatlar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            IIV platformasi kurslarini to'liq tamomlagan va davlat yakuniy imtihonidan o'tgan o'quvchilar ro'yxati.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Ism, guruh yoki raqam bo'yicha..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white text-xs placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Grid of Certificates */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cert => (
            <div
              key={cert.id}
              className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-5 space-y-4 hover:border-amber-400/60 transition-all hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-600/40">
                    {cert.certificateNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Faol</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {cert.studentName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Guruhi: <strong className="text-slate-200">{cert.studentGroup}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Kurs nomi:</span>
                    <span className="font-bold text-sky-400">{cert.courseTitle}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Imtihon bali:</span>
                    <span className="font-bold text-amber-300">{cert.finalScore} / {cert.maxScore}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Berilgan sana:</span>
                    <span>{cert.issueDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onViewCertificate(cert)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Sertifikatni ko'rish</span>
                </button>

                <button
                  onClick={() => onOpenVerify(cert.certificateNumber)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Haqiqiyligini tekshirish"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-lg font-bold text-white">Sertifikatlar topilmadi</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Qidiruv so'rovi bo'yicha hech qanday sertifikat mos kelmadi.
          </p>
        </div>
      )}
    </div>
  );
};
