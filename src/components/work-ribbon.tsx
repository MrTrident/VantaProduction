'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioItem } from '@/types';
import { useVanta } from '@/lib/vanta-context';
import { Heart, Eye, Sparkles, ExternalLink, Play, Flame } from 'lucide-react';

interface WorkRibbonProps {
  onProjectClick: (item: PortfolioItem) => void;
}

export const WorkRibbon: React.FC<WorkRibbonProps> = ({ onProjectClick }) => {
  const { portfolioItems, toggleLike, isLiked, homepageConfig } = useVanta();
  const [isPausedTrack1, setIsPausedTrack1] = useState(false);
  const [isPausedTrack2, setIsPausedTrack2] = useState(false);

  // Filter approved items
  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');

  // Split into two distinct rows for continuous dual-lane motion
  const row1Items = approvedWorks.slice(0, Math.ceil(approvedWorks.length / 2));
  const row2Items = approvedWorks.slice(Math.ceil(approvedWorks.length / 2));

  // Duplicate items for seamless continuous looping
  const track1 = [...row1Items, ...row1Items, ...row1Items];
  const track2 = [...row2Items, ...row2Items, ...row2Items];

  if (!homepageConfig.sectionsVisibility?.workRibbon && homepageConfig.sectionsVisibility?.workRibbon !== undefined) {
    return null;
  }

  const renderCard = (item: PortfolioItem, idx: number) => {
    const liked = isLiked(item.id);

    return (
      <div
        key={`${item.id}-${idx}`}
        onClick={() => onProjectClick(item)}
        className="group relative flex-shrink-0 w-[300px] sm:w-[360px] md:w-[420px] cursor-pointer rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-2.5 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-white/40 hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.08)] select-none"
      >
        {/* Thumbnail Aspect Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900">
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Top Category Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 border border-amber-300/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {item.category.replace(' Development', '').replace(' Design', '')}
            </span>
          </div>

          {/* Bottom Controls: Views & Interactive Like Button */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 text-xs font-mono z-20">
            <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-zinc-300 text-[11px]">
              <Eye className="w-3 h-3 text-zinc-400" />
              {item.views?.toLocaleString() || '1.2K'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              className={`flex items-center gap-1 backdrop-blur-md px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                liked
                  ? 'bg-red-500/25 border-red-500/60 text-red-400'
                  : 'bg-black/70 border-white/10 text-zinc-300 hover:border-red-400/50 hover:text-red-400'
              }`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              <span>{item.likes?.toLocaleString() || '0'}</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="mt-2.5 px-1.5 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h4 className="text-xs sm:text-sm font-bold font-mono text-white truncate group-hover:text-amber-300 transition-colors uppercase tracking-tight">
              {item.title}
            </h4>
            <p className="text-[11px] text-zinc-400 font-sans truncate">
              by <span className="text-zinc-200 font-mono">@{item.artistUsername}</span>
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">
            Preview →
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/10 bg-black/40">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 mb-4 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold">
            Live Production Ribbon
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono uppercase tracking-tight text-white">
          Real Works In Motion
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          High-CTR 3D YouTube thumbnails and custom gameplay engines crafted by Vanta talent. Click any piece to inspect details.
        </p>
      </div>

      {/* Dual Ribbon Container with Smooth Fade Mask on Left & Right */}
      <div className="relative w-full space-y-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {/* Track 1: Moving Left */}
        <div
          onMouseEnter={() => setIsPausedTrack1(true)}
          onMouseLeave={() => setIsPausedTrack1(false)}
          className="flex overflow-hidden select-none"
        >
          <motion.div
            animate={{
              x: isPausedTrack1 ? undefined : ['0%', '-50%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              },
            }}
            className="flex gap-5 shrink-0 pr-5"
          >
            {track1.map((item, idx) => renderCard(item, idx))}
          </motion.div>
          <motion.div
            aria-hidden
            animate={{
              x: isPausedTrack1 ? undefined : ['0%', '-50%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              },
            }}
            className="flex gap-5 shrink-0 pr-5"
          >
            {track1.map((item, idx) => renderCard(item, idx + 100))}
          </motion.div>
        </div>

        {/* Track 2: Moving Right */}
        <div
          onMouseEnter={() => setIsPausedTrack2(true)}
          onMouseLeave={() => setIsPausedTrack2(false)}
          className="flex overflow-hidden select-none"
        >
          <motion.div
            animate={{
              x: isPausedTrack2 ? undefined : ['-50%', '0%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              },
            }}
            className="flex gap-5 shrink-0 pr-5"
          >
            {track2.map((item, idx) => renderCard(item, idx))}
          </motion.div>
          <motion.div
            aria-hidden
            animate={{
              x: isPausedTrack2 ? undefined : ['-50%', '0%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              },
            }}
            className="flex gap-5 shrink-0 pr-5"
          >
            {track2.map((item, idx) => renderCard(item, idx + 100))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
