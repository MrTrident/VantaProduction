'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortfolioItem } from '@/types';
import { Eye, Heart, ExternalLink, Play, Sparkles, Maximize2 } from 'lucide-react';

interface ProjectCardProps {
  project: PortfolioItem;
  onClick?: (project: PortfolioItem) => void;
  showArtist?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  showArtist = true,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onClick?.(project)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.08)] cursor-pointer"
    >
      {/* Media Preview Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={project.mediaUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 border border-white/20 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {project.category}
          </span>
        </div>

        {/* Video / Embed badge if applicable */}
        {project.mediaType === 'video' && (
          <div className="absolute top-3.5 right-3.5 flex items-center justify-center w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-lg">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        )}

        {/* Quick Preview Hover Trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Maximize2 className="w-3.5 h-3.5" />
            Preview Artwork
          </div>
        </div>

        {/* View / Likes on bottom bar */}
        <div className="absolute bottom-3 right-3.5 flex items-center gap-3 text-xs text-zinc-200 font-mono">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            {project.views?.toLocaleString() || '1.2K'}
          </span>
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            <Heart className="w-3.5 h-3.5 text-red-400" />
            {project.likes?.toLocaleString() || '240'}
          </span>
        </div>
      </div>

      {/* Info Container with Clear, Readable Typography */}
      <div className="flex flex-1 flex-col justify-between p-5 bg-gradient-to-b from-zinc-950 to-black">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-white group-hover:text-zinc-100 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-2">
            {project.description || 'Custom creative asset engineered for high performance, audience retention and visual impact.'}
          </p>
        </div>

        {showArtist && (
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
            <Link
              href={`/artists/${project.artistUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <img
                src={project.artistAvatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${project.artistUsername}`}
                alt={project.artistDisplayName}
                className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
              />
              <div>
                <span className="text-xs font-semibold text-white group-hover:text-zinc-200 transition-colors block">
                  {project.artistDisplayName}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  @{project.artistUsername}
                </span>
              </div>
            </Link>

            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black text-zinc-300 transition-all"
                title="Open Source / Behance"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
