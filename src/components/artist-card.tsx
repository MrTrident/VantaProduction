'use client';

import React from 'react';
import Link from 'next/link';
import { ArtistProfile } from '@/types';
import { useVanta } from '@/lib/vanta-context';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ArtistCardProps {
  artist: ArtistProfile;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { portfolioItems } = useVanta();

  // Find up to 3 approved projects by this artist
  const artistWorks = portfolioItems
    .filter((item) => item.artistUsername === artist.username && item.status === 'approved')
    .slice(0, 3);

  const availabilityColors = {
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    busy: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    booked: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all duration-300 hover:border-white/30 hover:shadow-2xl">
      <div>
        {/* Header: Avatar, Name, Specialty, Availability */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={artist.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${artist.username}`}
                alt={artist.displayName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/20 group-hover:border-white/60 transition-colors"
              />
              {artist.isFeatured && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black shadow-md">
                  <Sparkles className="w-3 h-3 fill-current" />
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors">
                {artist.displayName}
              </h3>
              <p className="text-xs font-mono text-zinc-400">@{artist.username}</p>
              <span className="mt-1 inline-block text-[11px] font-mono text-zinc-300">
                {artist.specialty}
              </span>
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
              availabilityColors[artist.availabilityStatus || 'available']
            }`}
          >
            {artist.availabilityStatus || 'available'}
          </span>
        </div>

        {/* Bio */}
        <p className="mt-4 line-clamp-2 text-xs text-zinc-400 leading-relaxed">
          {artist.bio || 'Verified creative professional in the Vanta Production network.'}
        </p>

        {/* Artwork Previews Strip */}
        {artistWorks.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {artistWorks.map((work) => (
              <div
                key={work.id}
                className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900 border border-white/10"
              >
                <img
                  src={work.mediaUrl}
                  alt={work.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-6 border-t border-zinc-900 pt-4 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-500">
          {artistWorks.length} Verified Works
        </span>
        <Link
          href={`/artists/${artist.username}`}
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-white hover:text-zinc-300 transition-colors group-hover:translate-x-0.5"
        >
          View Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
