import React from 'react';
import { User } from '../types';
import { IIVLogo } from './IIVLogo';
import { 
  ShieldAlert, 
  Award, 
  UserCheck, 
  LogOut, 
  LogIn, 
  BookOpen, 
  Search, 
  GraduationCap,
  Coins,
  ShoppingBag
} from 'lucide-react';

interface Props {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onOpenVerify: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenAdmin,
  onOpenVerify,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Uzbekistan Flag Top Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-sky-500"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-emerald-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Emblem & Platform Title */}
          <button 
            onClick={() => setActiveTab('courses')}
            className="flex items-center text-left focus:outline-none group transition-transform active:scale-95 cursor-pointer"
          >
            <IIVLogo size="md" showText={true} />
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kurslar (6 ta)</span>
            </button>

            {/* Coin Market Tab (Required by Prompt) */}
            <button
              onClick={() => setActiveTab('coin-market')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coin-market'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Coin Market</span>
            </button>

            {currentUser && currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('my-progress')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'my-progress'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Natijalarim</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sertifikatlar</span>
            </button>

            <button
              onClick={onOpenVerify}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>QR Tekshirish</span>
            </button>
          </nav>

          {/* User Controls & Required Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Coin Badge in Navbar */}
                <button
                  onClick={() => setActiveTab('coin-market')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900/60 font-mono text-xs font-bold transition-all cursor-pointer"
                  title="Coin Market: 1 ta sertifikat = 50 Coin"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.coins || 0} Coin</span>
                </button>

                {/* Profile info chip */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-900/80 border border-blue-500/40 flex items-center justify-center text-blue-200 font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-blue-300">
                      {currentUser.group || currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                    title="Tizimdan chiqish"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Admin button for fast access */}
                <button
                  onClick={onOpenAdmin}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 transition-colors cursor-pointer"
                  title="Admin panel"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Specific requirement: "foydalanuvchi kirisi bilan ro`yxatdan o`tis tugmasi, yonida admin tugmasi bo`lishi kerak" */
              <div className="flex items-center gap-2">
                {/* Ro'yxatdan o'tish (Primary Blue) */}
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Ro‘yxatdan o‘tish</span>
                </button>

                {/* Admin panel (Beside register button, with passcode 'iiv admin') */}
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md shadow-amber-950/40 border border-amber-500/40 transition-all hover:scale-105 cursor-pointer"
                  title="Admin panel (Parol: iiv admin)"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-200" />
                  <span>Admin panel</span>
                </button>

                {/* Existing user login link */}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Kirish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
