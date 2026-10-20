import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
}

export const IIVLogo: React.FC<Props> = ({ className = '', size = 'md', showText = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]} flex-shrink-0 drop-shadow-xl select-none flex items-center justify-center`}>
        {/* Official 3D Insignia of the Ministry of Internal Affairs of Uzbekistan uploaded by user */}
        <img
          src="/assets/aistudio/image_376cdd9c.png"
          alt="O'zbekiston Respublikasi Ichki Ishlar Vazirligi"
          className="w-full h-full object-contain filter drop-shadow-md rounded-full pointer-events-none"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-amber-400 uppercase font-serif-title">
              O'ZBEKISTON RESPUBLIKASI
            </span>
          </div>
          <span className="text-sm sm:text-base font-black text-white tracking-wide">
            ICHKI ISHLAR VAZIRLIGI
          </span>
          <span className="text-[11px] text-blue-200/80 font-medium tracking-tight">
            Yagona Ta'lim va Elektron Sertifikatlash Portali
          </span>
        </div>
      )}
    </div>
  );
};
