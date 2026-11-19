'use client';

import React from 'react';
import Link from 'next/link';
import { PortfolioItem } from '@/types';
import { X, ExternalLink, Eye, Heart, Calendar, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-zinc-950 p-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
          <img
            src={project.mediaUrl}
            alt={project.title}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Project Meta & Details */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono uppercase text-zinc-300">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  ID: {project.id}
                </span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wider font-mono text-white">
                {project.title}
              </h2>
            </div>

            {/* Social / Link buttons */}
            <div className="flex items-center gap-3">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  Visit Project <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed border-t border-zinc-900 pt-4">
            {project.description || 'Custom crafted creative asset engineered for high performance, audience retention and visual impact.'}
          </p>

          {/* Artist attribution card */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-3">
              <img
                src={project.artistAvatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${project.artistUsername}`}
                alt={project.artistDisplayName}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <p className="text-sm font-bold text-white">{project.artistDisplayName}</p>
                <p className="text-xs text-zinc-400">@{project.artistUsername}</p>
              </div>
            </div>

            <Link
              href={`/artists/${project.artistUsername}`}
              onClick={onClose}
              className="text-xs uppercase font-mono tracking-wider px-3.5 py-1.5 rounded-md border border-white/20 text-zinc-200 hover:text-white hover:border-white transition-colors"
            >
              View Full Portfolio →
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                {project.views?.toLocaleString() || '1.2K'} Views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                {project.likes?.toLocaleString() || '240'} Likes
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Published {project.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
