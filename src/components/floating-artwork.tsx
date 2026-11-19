'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { PortfolioItem } from '@/types';
import Link from 'next/link';

interface FloatingCardProps {
  item: PortfolioItem;
  index: number;
  mouseX: number;
  mouseY: number;
  speed: number;
  intensity: number;
  opacity: number;
  onSelect?: (item: PortfolioItem) => void;
}

// Preset positioning coordinates spread around the hero periphery to ensure zero obstruction of central headline
const CARD_LAYOUTS = [
  // Top Left
  { top: '8%', left: '4%', width: 'w-48 sm:w-60 md:w-72', rotate: '-4deg', depth: 0.035, delay: '0s' },
  // Top Right
  { top: '10%', right: '4%', width: 'w-44 sm:w-56 md:w-68', rotate: '3deg', depth: 0.045, delay: '1.2s' },
  // Middle Left
  { top: '48%', left: '2%', width: 'w-40 sm:w-52 md:w-64', rotate: '2deg', depth: 0.025, delay: '2.4s' },
  // Middle Right
  { top: '45%', right: '2%', width: 'w-48 sm:w-60 md:w-76', rotate: '-3deg', depth: 0.04, delay: '0.8s' },
  // Bottom Left
  { bottom: '6%', left: '8%', width: 'w-44 sm:w-56 md:w-68', rotate: '-2deg', depth: 0.03, delay: '1.8s' },
  // Bottom Right
  { bottom: '8%', right: '8%', width: 'w-48 sm:w-64 md:w-72', rotate: '4deg', depth: 0.05, delay: '2.1s' },
  // Far Top Center-Left
  { top: '3%', left: '26%', width: 'w-36 sm:w-48 md:w-56', rotate: '1deg', depth: 0.02, delay: '3s' },
  // Far Top Center-Right
  { top: '4%', right: '24%', width: 'w-36 sm:w-44 md:w-52', rotate: '-2deg', depth: 0.025, delay: '1.5s' },
];

export const FloatingArtwork: React.FC<{ onProjectClick?: (item: PortfolioItem) => void }> = ({ onProjectClick }) => {
  const { portfolioItems, homepageConfig } = useVanta();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter approved items designated for hero
  const heroItems = portfolioItems
    .filter((item) => item.isFloatingHero && item.status === 'approved')
    .slice(0, homepageConfig.floatingCount || 8);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!homepageConfig.enableFloatingArtwork || heroItems.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10"
      aria-hidden="true"
    >
      {heroItems.map((item, index) => {
        const layout = CARD_LAYOUTS[index % CARD_LAYOUTS.length];
        const depth = (layout.depth || 0.03) * (homepageConfig.floatingIntensity || 1);
        const translateX = mousePos.x * 60 * depth;
        const translateY = mousePos.y * 60 * depth;

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: layout.top,
              bottom: layout.bottom,
              left: layout.left,
              right: layout.right,
              transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${layout.rotate})`,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: homepageConfig.floatingOpacity ?? 0.85,
            }}
            className={`pointer-events-auto transition-opacity duration-300 ${layout.width}`}
          >
            <div
              onClick={() => onProjectClick?.(item)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-zinc-950/80 p-2 shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              {/* Aspect Ratio Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Hover Details Preview */}
              <div className="mt-2 flex items-center justify-between px-1">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-[11px] font-bold text-white font-mono uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="truncate text-[10px] text-zinc-400">
                    by <span className="text-zinc-200">@{item.artistUsername}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
                  {item.category.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
