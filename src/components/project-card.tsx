'use client';

import React from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/types';
import { Eye, Heart, ExternalLink, Play } from 'lucide-react';

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
    <div
      onClick={() => onClick?.(project)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 transition-all duration-300 hover:border-white/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer"
    >
      {/* Media Preview Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={project.mediaUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Video / Embed badge if applicable */}
        {project.mediaType === 'video' && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-white/15">
            {project.category}
          </span>
        </div>

        {/* View / Likes on hover */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            {project.views?.toLocaleString() || '1.2K'}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Heart className="w-3.5 h-3.5 text-red-400" />
            {project.likes?.toLocaleString() || '240'}
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col justify-between p-4 bg-zinc-950">
        <div>
          <h3 className="line-clamp-1 text-sm font-bold uppercase tracking-wide text-white group-hover:text-zinc-200 transition-colors font-mono">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
            {project.description || 'Custom creative asset engineered for high performance and audience retention.'}
          </p>
        </div>

        {showArtist && (
          <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-3">
            <Link
              href={`/artists/${project.artistUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={project.artistAvatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${project.artistUsername}`}
                alt={project.artistDisplayName}
                className="w-5 h-5 rounded-full object-cover border border-white/20"
              />
              <span className="text-xs font-medium text-zinc-300 hover:text-white">
                @{project.artistUsername}
              </span>
            </Link>

            <span className="text-[10px] text-zinc-500 font-mono">
              {project.createdAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
