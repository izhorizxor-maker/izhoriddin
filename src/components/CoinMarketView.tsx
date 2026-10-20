import React, { useState } from 'react';
import { User, CoinMarketItem, CoinTransaction } from '../types';
import { StorageService } from '../services/storage';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Award, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  UserCheck,
  Medal,
  History
} from 'lucide-react';

interface Props {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CoinMarketView: React.FC<Props> = ({
  currentUser,
  onOpenAuth
}) => {
  const [items, setItems] = useState<CoinMarketItem[]>(() => StorageService.getCoinMarketItems());
  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => 
    currentUser ? StorageService.getCoinTransactions(currentUser.id) : []
  );
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentCoins = currentUser?.coins || 0;

  const handlePurchase = (item: CoinMarketItem) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const res = StorageService.purchaseMarketItem(currentUser.id, item.id);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setAlertMsg({ type: 'success', text: res.message });
      setTransactions(StorageService.getCoinTransactions(currentUser.id));
    } else {
      setAlertMsg({ type: 'error', text: res.message });
    }

    setTimeout(() => {
      setAlertMsg(null);
    }, 4500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Medal':
        return <Medal className="w-6 h-6 text-amber-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-sky-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>IIV Ta'lim Tangalari (Coin Tizimi)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            IIV Coin Market — Rag'batlantirish Do'koni
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Har bir kursni muvaffaqiyatli yakunlab sertifikat olgan o'quvchiga <strong>50 Coin</strong> beriladi. Ushbu tangalarni quyidagi eksklyuziv ta'lim imtiyozlari va materiallariga almashtirishingiz mumkin.
          </p>
        </div>

        {/* Coin Balance Pill */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-xl text-center min-w-[200px]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sizning hisobingiz:
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-2 mt-1 font-mono">
            <span>🪙 {currentCoins}</span>
            <span className="text-sm font-bold text-amber-300 uppercase">Coin</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currentUser ? `${currentUser.fullName} (${currentUser.group})` : 'Tizimga kirmagan'}
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-3 ${
          alertMsg.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
            : 'bg-red-950/80 border-red-500/60 text-red-200'
        }`}>
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Market Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Mavjud imtiyozlar va mukofotlar</span>
          </h2>
          <span className="text-xs text-slate-400">
            1 ta sertifikat = 50 Coin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const canAfford = currentCoins >= item.cost;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-950/20"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getIcon(item.iconName)}
                    </div>
                    <span className="font-mono text-sm font-black text-amber-400 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-600/40">
                      🪙 {item.cost} Coin
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handlePurchase(item)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02]'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    <span>{canAfford ? "Xarid qilish / Faollashtirish" : `${item.cost} Coin kerak`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coin History / Transactions */}
      {transactions.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <span>Coin amallari tarixi</span>
          </h3>

          <div className="space-y-2">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">{tx.description}</div>
                  <div className="text-[10px] text-slate-500">{tx.date}</div>
                </div>

                <span className={`font-mono font-bold text-sm ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
