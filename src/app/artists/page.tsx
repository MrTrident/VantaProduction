'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ArtistCard } from '@/components/artist-card';
import { useVanta } from '@/lib/vanta-context';
import { Search, Sparkles } from 'lucide-react';

export default function ArtistsDirectoryPage() {
  const { artistProfiles } = useVanta();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const publicArtists = artistProfiles.filter((a) => a.isPublic);

  const filtered = publicArtists.filter((artist) => {
    const matchesAvailability =
      availabilityFilter === 'all' || artist.availabilityStatus === availabilityFilter;
    const matchesSearch =
      artist.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAvailability && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300">
              Verified Production Roster
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase font-mono tracking-tight text-white leading-none">
            Artists & Creators
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Meet the hand-selected specialists powering the Vanta Production network across 3D thumbnail design, cinema editing, motion graphics, and software systems.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Availability Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Talent', value: 'all' },
              { label: 'Available Now', value: 'available' },
              { label: 'In Production', value: 'busy' },
              { label: 'Fully Booked', value: 'booked' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setAvailabilityFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  availabilityFilter === tab.value
                    ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.02]'
                    : 'bg-zinc-950/80 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-zinc-900 border border-white/10 hover:border-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by artist or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/90 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 backdrop-blur-md transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Artist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((artist) => (
            <ArtistCard key={artist.userId} artist={artist} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
