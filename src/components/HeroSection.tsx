import React from 'react';
import { Shield, BookOpen, Award, CheckCircle2, Play, ChevronRight, FileCheck, Users, ShieldAlert, Coins } from 'lucide-react';
import { User } from '../types';
import { IIVLogo } from './IIVLogo';

interface Props {
  currentUser: User | null;
  onExploreCourses: () => void;
  onOpenVerify: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  onOpenCoinMarket: () => void;
}

export const HeroSection: React.FC<Props> = ({
  currentUser,
  onExploreCourses,
  onOpenVerify,
  onOpenRegister,
  onOpenAdmin,
  onOpenCoinMarket
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a1228] to-[#0b1329] border-b border-slate-800">
      {/* Background Decorative Grid and Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Centered Official Emblem */}
          <div className="flex justify-center mb-2">
            <IIVLogo size="xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>O'ZBEKISTON RESPUBLIKASI ICHKI ISHLAR VAZIRLIGI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            IIV Masofaviy Ta'lim, Test va <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
              Elektron Sertifikatlash Portali
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            O‘quvchilar 6 ta yo‘nalish (IT: C++, Python, Tarix, Ingliz tili, Rus tili, Ona tili) bo‘yicha videodarslarni o‘rganadi, test topshiradi, davlat sertifikatiga hamda <strong>50 Coin</strong> mukofotiga ega bo‘ladi.
          </p>

          {/* Primary Action Buttons: Ro'yxatdan o'tish and Admin Panel Side-by-Side */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!currentUser && (
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Ro‘yxatdan o‘tish (Ism, Guruh, Parol)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-amber-950/40 border border-amber-500/40 transition-all hover:scale-105 cursor-pointer"
              title="O'qituvchilar va adminlar kirishi (Parol: iiv admin)"
            >
              <ShieldAlert className="w-4 h-4 text-amber-200" />
              <span>Admin panel (Parol: iiv admin)</span>
            </button>

            <button
              onClick={onOpenCoinMarket}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 font-bold text-sm border border-amber-500/50 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Coin Market (Do'kon)</span>
            </button>

            <button
              onClick={onOpenVerify}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sertifikatni QR tekshirish</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>6 ta fan</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">20 tadan videodars</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6 / 10 ball</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Dars testidan o'tish</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>25 / 30 ball</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Yakuniy imtihon</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-xl font-bold text-amber-300 flex items-center justify-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>50 Coin</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Sertifikat mukofoti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
