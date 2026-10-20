import React, { useState } from 'react';
import { IIVLogo } from './IIVLogo';
import { StorageService } from '../services/storage';
import { X, Lock, Key, ShieldAlert, ArrowRight } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<Props> = ({
  onClose,
  onSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.validateAdminPasscode(passcode)) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Uzbekistan Flag Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-sky-500"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        <div className="p-6 text-center border-b border-slate-800 bg-slate-950/90 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <IIVLogo size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Xizmat doirasida kirish</span>
          </div>

          <h3 className="text-lg font-black text-white">
            Admin Panelga Kirish
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            O'qituvchilar va ma'murlar uchun maxsus kod talab qilinadi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin panel parolini kiriting:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Parolni kiriting..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-mono text-sm outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5">
              Parol: <code className="font-mono text-amber-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">iiv admin</code>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-700/60 text-red-300 text-xs font-semibold">
              Kiritilgan kod noto'g'ri. Iltimos, tekshirib qaytadan kiriting.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Admin panelga kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
