import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { IIVLogo } from './IIVLogo';
import { 
  X, 
  UserCheck, 
  LogIn, 
  Lock, 
  User as UserIcon, 
  Users, 
  Key, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<Props> = ({
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (!fullName.trim() || !group.trim() || !password) {
        setErrorMsg("Barcha maydonlarni to'ldiring.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Parollar bir-biriga mos kelmadi.");
        return;
      }

      const res = StorageService.registerStudent(fullName, group, password);
      if (res.success && res.user) {
        setSuccessMsg("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
        setTimeout(() => {
          onSuccess(res.user!);
        }, 800);
      } else {
        setErrorMsg(res.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }
    } else {
      // Login
      if (!fullName.trim() || !password) {
        setErrorMsg("Ism-familiya va parolingizni kiriting.");
        return;
      }

      const res = StorageService.loginUser(fullName, password);
      if (res.success && res.user) {
        setSuccessMsg("Tizimga muvaffaqiyatli kirdingiz!");
        setTimeout(() => {
          onSuccess(res.user!);
        }, 800);
      } else {
        setErrorMsg(res.message || "Kirishda xatolik yuz berdi.");
      }
    }
  };

  // Quick switch demo accounts
  const handleQuickLogin = (demoName: string, demoPass: string) => {
    const res = StorageService.loginUser(demoName, demoPass);
    if (res.success && res.user) {
      onSuccess(res.user);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Uzbekistan Flag Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-slate-800 bg-slate-950/80 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <IIVLogo size="md" />
          </div>

          <h3 className="text-lg font-black text-white">
            {mode === 'register' ? "O‘quvchi ro‘yxatdan o‘tishi" : "Tizimga kirish"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            IIV Yagona Ta'lim Portali shaxsiy hisobingiz
          </p>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mt-4 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kirish
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ro‘yxatdan o‘tish
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Ism va familiyangiz:
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Masalan: Bobur Aliyev"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-600 outline-none text-xs"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Guruhingiz / Vzvodingiz:
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    placeholder="Masalan: 204-guruh"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-600 outline-none text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Parol:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-600 outline-none text-xs"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Parolni tasdiqlang:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-600 outline-none text-xs"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/50 text-red-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {mode === 'register' ? "Ro‘yxatdan o‘tish" : "Tizimga kirish"}
            </button>
          </form>

          {/* Quick Demo Logins for smooth evaluation */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tezkor sinov hisoblari (1-bosishda kirish):</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('Bobur Aliyev', 'student123')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-bold text-sky-400">Bobur Aliyev</span> (204-guruh)
                  <div className="text-[10px] text-slate-400">Faol tinglovchi, 4-darsda</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Ziyoda Karimova', 'pass123')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-bold text-amber-400">Ziyoda Karimova</span> (102-guruh)
                  <div className="text-[10px] text-slate-400">Bitiruvchi (Sertifikatga ega)</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('IIV Administratori', 'iiv admin')}
                className="w-full text-left px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 text-amber-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-bold text-amber-300">IIV Admin</span> (Parol: iiv admin)
                  <div className="text-[10px] text-amber-300/80">O'qituvchi va ma'murlar boshqaruvi</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
