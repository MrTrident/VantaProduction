import React from 'react';
import Link from 'next/link';

interface VantaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withLink?: boolean;
}

export const VantaLogo: React.FC<VantaLogoProps> = ({
  className = '',
  size = 'md',
  withLink = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base tracking-widest',
    md: 'text-lg tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.3em]',
  };

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Cinematic Geometric V Monogram */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center bg-black border border-white/20 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-white/50 transition-all duration-300`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1.5 text-white fill-none stroke-current stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized Vanta V Monogram */}
          <path d="M8 8 L20 32 L32 8" strokeWidth="3" />
          <path d="M14 8 L20 22 L26 8" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="20" cy="22" r="1.5" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black uppercase text-white font-mono leading-none ${textSizes[size]}`}>
          VANTA
        </span>
        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-400 font-mono mt-0.5">
          PRODUCTION
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
