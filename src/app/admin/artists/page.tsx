'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVanta } from '@/lib/vanta-context';
import { UserCheck, Sparkles, Eye, ExternalLink, Search } from 'lucide-react';

export default function AdminArtistsPage() {
  const { artistProfiles, portfolioItems, updateArtistProfile } = useVanta();
  const [search, setSearch] = useState('');

  const filteredArtists = artistProfiles.filter(
    (a) =>
      a.displayName.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFeatured = (userId: string, current: boolean) => {
    updateArtistProfile(userId, { isFeatured: !current });
  };

  const togglePublic = (userId: string, current: boolean) => {
    updateArtistProfile(userId, { isPublic: !current });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
          Creative Talent Registry
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Artist Roster Management
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Manage individual artist visibility, feature creative leads on the public homepage, and review portfolio depth.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => {
          const worksCount = portfolioItems.filter(
            (p) => p.artistUsername.toLowerCase() === artist.username.toLowerCase()
          ).length;

          return (
            <div
              key={artist.userId}
              className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white">{artist.displayName}</h3>
                      <p className="text-xs font-mono text-zinc-400">@{artist.username}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                      artist.availabilityStatus === 'available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {artist.availabilityStatus}
                  </span>
                </div>

                <p className="text-xs font-mono text-amber-300 font-bold uppercase">{artist.specialty}</p>
                <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {artist.bio || 'Verified creative professional.'}
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-900 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Projects</span>
                    <span className="text-white font-bold">{worksCount} Works</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Theme / Layout</span>
                    <span className="text-white font-bold uppercase text-[10px]">{artist.layoutMode}</span>
                  </div>
                </div>
              </div>

              {/* Toggles & Links */}
              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Featured on Homepage:</span>
                  <button
                    onClick={() => toggleFeatured(artist.userId, artist.isFeatured)}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors ${
                      artist.isFeatured
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {artist.isFeatured ? '★ Featured' : 'Not Featured'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Public Visibility:</span>
                  <button
                    onClick={() => togglePublic(artist.userId, artist.isPublic)}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors ${
                      artist.isPublic
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {artist.isPublic ? 'Public' : 'Hidden'}
                  </button>
                </div>

                <Link
                  href={`/artists/${artist.username}`}
                  target="_blank"
                  className="mt-2 w-full py-2 rounded-lg border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white hover:border-white transition-colors flex items-center justify-center gap-1.5"
                >
                  View Public Portfolio <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
