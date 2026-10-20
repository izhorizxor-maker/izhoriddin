import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { IIVLogo } from './IIVLogo';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  Award,
  ExternalLink,
  Coins
} from 'lucide-react';

interface Props {
  certificate: Certificate;
  onClose: () => void;
  onVerify?: (certNumber: string) => void;
}

export const CertificateModal: React.FC<Props> = ({
  certificate,
  onClose,
  onVerify
}) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate authentic scannable QR code data URL pointing to verification link
  useEffect(() => {
    const origin = window.location.origin || 'https://iiv.uz';
    const verifyUrl = `${origin}${window.location.pathname}?verify=${encodeURIComponent(certificate.certificateNumber)}`;
    
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0e2a47',
        light: '#ffffff'
      }
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('QR code generation failed', err);
    });
  }, [certificate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.certificateNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerVerify = () => {
    if (onVerify) {
      onVerify(certificate.certificateNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              Rasmiy Davlat Namunaviy Elektron Sertifikati
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40 text-[11px] font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>+50 Coin berildi</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Sertifikat raqamini nusxalash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Nusxalandi" : certificate.certificateNumber}</span>
            </button>

            {onVerify && (
              <button
                onClick={handleTriggerVerify}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tekshirish</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF saqlash</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CANVAS */}
        <div className="p-3 sm:p-6 overflow-x-auto bg-slate-950 flex justify-center">
          <div
            id="certificate-print-area"
            className="w-[820px] h-[580px] bg-white text-slate-900 rounded-xl relative p-7 shadow-2xl flex flex-col justify-between overflow-hidden select-none border-[12px] border-[#0e2a47]"
            style={{
              backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Ornamental Outer Gold Border */}
            <div className="absolute inset-2 border-2 border-[#c59d3f] pointer-events-none"></div>
            <div className="absolute inset-3 border border-slate-300 pointer-events-none"></div>

            {/* Corner Guilloche Ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#c59d3f] pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#c59d3f] pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#c59d3f] pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#c59d3f] pointer-events-none"></div>

            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
              <img
                src="/assets/aistudio/image_376cdd9c.png"
                alt="IIV Gerbi Watermark"
                className="w-72 h-72 object-contain filter grayscale contrast-125"
              />
            </div>

            {/* Certificate Header: Centered Official IIV Emblem */}
            <div className="relative text-center space-y-1">
              <div className="flex justify-center mb-1">
                <img
                  src="/assets/aistudio/image_376cdd9c.png"
                  alt="O'zbekiston Respublikasi Ichki Ishlar Vazirligi"
                  className="w-24 h-24 object-contain filter drop-shadow-md rounded-full select-none"
                />
              </div>

              <div className="text-[12px] font-black tracking-[0.25em] text-[#0e2a47] uppercase font-serif-title">
                O'ZBEKISTON RESPUBLIKASI ICHKI ISHLAR VAZIRLIGI
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
                Yagona Masofaviy Ta'lim va Elektron Sertifikatlash Tizimi
              </div>

              <div className="pt-1.5">
                <h1 className="text-2xl font-black tracking-[0.2em] text-[#0e2a47] font-serif-title uppercase">
                  SERTIFIKAT
                </h1>
                <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-[#c59d3f] to-transparent mx-auto mt-1"></div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="relative text-center space-y-2.5 px-6 my-auto">
              <div className="text-xs text-slate-600 italic">
                Ushbu rasmiy hujjat tasdiqlaydiki,
              </div>

              {/* Student Full Name */}
              <div className="text-2xl sm:text-3xl font-black text-[#0e2a47] font-serif-title tracking-wide border-b-2 border-slate-300 pb-1 inline-block px-8">
                {certificate.studentName}
              </div>

              <div className="text-xs font-semibold text-slate-700">
                Guruhi / Vzvodi: <span className="font-bold text-[#0e2a47]">{certificate.studentGroup}</span>
              </div>

              {/* Course Title and Accomplishment */}
              <div className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed pt-1">
                Platformadagi <strong className="text-[#0e2a47] text-sm font-black">"{certificate.courseTitle}"</strong> yo'nalishi bo'yicha barcha <span className="font-bold">20 ta videodars</span> va oraliq test modullarini to'liq o'zlashtirib, davlat yakuniy sinov imtihonini <strong className="text-[#0e2a47]">{certificate.finalScore} / {certificate.maxScore} ball</strong> bilan muvaffaqiyatli tamomladi.
              </div>
            </div>

            {/* Certificate Footer: Serial, QR Code, Signature & Official Seal */}
            <div className="relative pt-2 border-t border-slate-200 flex items-end justify-between px-3">
              {/* Left: Serial & Date */}
              <div className="text-left space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Noyob sertifikat raqami:
                </div>
                <div className="font-mono font-bold text-xs text-[#0e2a47] tracking-wider">
                  {certificate.certificateNumber}
                </div>
                <div className="text-[10px] text-slate-600">
                  Berilgan sana: <span className="font-semibold">{certificate.issueDate}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Davlat elektron reyestridan tasdiqlangan</span>
                </div>
              </div>

              {/* Center: Official Seal Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#c59d3f] p-1 flex items-center justify-center relative bg-amber-50/50">
                  <div className="w-full h-full rounded-full border border-[#0e2a47] flex flex-col items-center justify-center text-[7px] text-center font-bold text-[#0e2a47] leading-tight p-1">
                    <span className="text-[6px] tracking-wider">O'ZBEKISTON</span>
                    <span className="text-[8px] text-[#c59d3f]">★ IIV ★</span>
                    <span className="text-[6px] tracking-wider">TASDIQLANGAN</span>
                  </div>
                </div>
              </div>

              {/* Right: Signature & Scannable QR Verification */}
              <div className="flex items-center gap-4 text-right">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#0e2a47]">
                    {certificate.issuerTitle}
                  </div>
                  <div className="text-[9px] text-slate-600">
                    {certificate.issuerName}
                  </div>
                  <div className="font-serif italic text-xs text-blue-900 pt-0.5">
                    ~ X. Bobomurodov ~
                  </div>
                </div>

                {/* Scannable / Clickable QR Code Container */}
                <button
                  onClick={handleTriggerVerify}
                  className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-sm text-center hover:border-blue-500 transition-colors cursor-pointer group"
                  title="Skanerlang yoki ustiga bosing (tekshirish)"
                >
                  <div className="w-14 h-14 bg-white flex items-center justify-center overflow-hidden">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR Verification" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-[8px] font-mono">
                        QR
                      </div>
                    )}
                  </div>
                  <div className="text-[7px] font-mono text-slate-500 mt-0.5 group-hover:text-blue-600 font-bold uppercase">
                    QR Tekshirish
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner (no-print) */}
        <div className="no-print p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              QR kodni kamera bilan skanerlang yoki <strong>"Tekshirish"</strong> sahifasida <code className="text-amber-300 font-mono">{certificate.certificateNumber}</code> raqami bilan haqiqiyligini tekshiring.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onVerify && (
              <button
                onClick={handleTriggerVerify}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>QR Tekshirishni ochish</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
