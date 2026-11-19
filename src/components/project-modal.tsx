'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '@/types';
import { X, ExternalLink, Eye, Heart, Calendar, Sparkles, User, ArrowRight, Share2, Check } from 'lucide-react';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!project) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl my-auto rounded-3xl border border-white/20 bg-zinc-950/95 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.1)] text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/20 transition-all shadow-lg hover:scale-105 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Preview Stage */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner flex items-center justify-center">
            <img
              src={project.mediaUrl}
              alt={project.title}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Project Details & Metadata */}
          <div className="mt-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-300 border border-amber-300/30">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Production Asset #{project.id}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-mono text-white">
                  {project.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-zinc-200 hover:text-white hover:border-white text-xs font-mono font-medium transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Link Copied' : 'Share Work'}
                </button>

                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95"
                  >
                    View on Behance <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Project Description (Large and comfortable to read) */}
            <div className="border-t border-white/10 pt-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Production Overview
              </h4>
              <p className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed">
                {project.description ||
                  'Custom crafted creative asset engineered for high performance, audience retention and maximum visual impact for premier content creators.'}
              </p>
            </div>

            {/* Artist Attribution Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/15 bg-zinc-900/70 backdrop-blur-xl p-5">
              <div className="flex items-center gap-3.5">
                <img
                  src={project.artistAvatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${project.artistUsername}`}
                  alt={project.artistDisplayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-white font-mono">{project.artistDisplayName}</p>
                    <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                      Verified Artist
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">@{project.artistUsername}</p>
                </div>
              </div>

              <Link
                href={`/artists/${project.artistUsername}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all border border-white/10 self-start sm:self-auto"
              >
                Explore Artist Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
