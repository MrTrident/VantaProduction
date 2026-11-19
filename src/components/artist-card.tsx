'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArtistProfile } from '@/types';
import { useVanta } from '@/lib/vanta-context';
import { ArrowUpRight, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';

interface ArtistCardProps {
  artist: ArtistProfile;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { portfolioItems } = useVanta();

  // Find approved projects by this artist
  const artistWorks = portfolioItems
    .filter((item) => item.artistUsername === artist.username && item.status === 'approved')
    .slice(0, 3);

  const availabilityConfig = {
    available: { label: 'Available for Commission', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    busy: { label: 'Limited Bandwidth', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    booked: { label: 'Fully Booked', class: 'bg-red-500/15 text-red-300 border-red-500/30' },
  };

  const status = availabilityConfig[artist.availabilityStatus || 'available'];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-7 shadow-2xl transition-all duration-300 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(255,255,255,0.06)]"
    >
      <div>
        {/* Header: Avatar, Name, Specialty, Availability */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={artist.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${artist.username}`}
                alt={artist.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20 group-hover:border-white/60 transition-colors shadow-md"
              />
              {artist.isFeatured && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white group-hover:text-zinc-100 transition-colors font-mono">
                  {artist.displayName}
                </h3>
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs font-mono text-zinc-400">@{artist.username}</p>
              <div className="mt-1.5 inline-block text-xs font-mono font-medium text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {artist.specialty}
              </div>
            </div>
          </div>

          <span
            className={`self-start rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider border font-medium ${status.class}`}
          >
            {status.label}
          </span>
        </div>

        {/* Bio */}
        <p className="mt-5 text-sm text-zinc-300 font-sans leading-relaxed">
          {artist.bio || 'Verified creative professional in the Vanta Production network.'}
        </p>

        {/* Artwork Previews Strip */}
        {artistWorks.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Recent Verified Work
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {artistWorks.length} Highlights
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {artistWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/artists/${artist.username}`}
                  className="group/thumb relative aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/10 hover:border-white/40 transition-all block"
                >
                  <img
                    src={work.mediaUrl}
                    alt={work.title}
                    className="h-full w-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Links & Actions */}
      <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
        {artist.socialLinks?.portfolio ? (
          <a
            href={artist.socialLinks.portfolio}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Behance Portfolio
          </a>
        ) : (
          <span className="text-xs font-mono text-zinc-500">
            Verified Vanta Member
          </span>
        )}

        <Link
          href={`/artists/${artist.username}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md group-hover:shadow-white/20"
        >
          View Full Portfolio <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};
