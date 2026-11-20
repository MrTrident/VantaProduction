'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { useVanta } from '@/lib/vanta-context';
import { PortfolioItem } from '@/types';
import {
  Globe,
  Sparkles,
  Calendar,
  Grid,
  Columns,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { TwitterIcon, YoutubeIcon, DiscordIcon, InstagramIcon } from '@/components/social-icons';

function ArtistPortfolioContent() {
  const params = useParams();
  const username = params?.username as string;
  const { artistProfiles, portfolioItems, currentUser } = useVanta();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const artist = artistProfiles.find(
    (a) => a.username.toLowerCase() === username?.toLowerCase()
  );

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-black font-mono text-white mb-2">ARTIST NOT FOUND</h1>
          <p className="text-sm text-zinc-400 max-w-md">
            The artist &quot;@{username}&quot; could not be found or has not made their portfolio public.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Get approved items for this artist
  const works = portfolioItems.filter(
    (item) => item.artistUsername.toLowerCase() === artist.username.toLowerCase() && item.status === 'approved'
  );

  const categories = ['All', ...Array.from(new Set(works.map((w) => w.category)))];

  const filteredWorks = activeCategory === 'All'
    ? works
    : works.filter((w) => w.category === activeCategory);

  const isLight = artist.themeMode === 'light';
  const layout = artist.layoutMode || 'grid';

  const availabilityBadge = {
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    busy: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    booked: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[artist.availabilityStatus || 'available'];

  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-[#050505] text-[#f4f4f6]'}`}>
      <Navbar />

      {/* Banner / Cover Header */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-zinc-900">
        {artist.bannerUrl ? (
          <img
            src={artist.bannerUrl}
            alt={`${artist.displayName} Banner`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Profile Bio Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-24 sm:-mt-28 relative z-20 pb-24">
        <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl ${
          isLight ? 'bg-white/95 border-zinc-200' : 'bg-zinc-950/90 border-white/15'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Avatar & Ident */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={artist.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${artist.username}`}
                  alt={artist.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-black shadow-2xl"
                />
                {artist.isFeatured && (
                  <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight">
                    {artist.displayName}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${availabilityBadge}`}>
                    {artist.availabilityStatus || 'available'}
                  </span>
                </div>
                <p className="text-sm font-mono text-zinc-400">@{artist.username}</p>
                <p className="mt-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  {artist.specialty} • {artist.yearsExperience} Years Experience
                </p>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {currentUser?.username?.toLowerCase() === artist.username.toLowerCase() && (
                <Link
                  href="/dashboard/profile"
                  className="px-4 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-amber-400/30 transition-all shadow-md"
                >
                  Edit Profile
                </Link>
              )}

              {(artist.socialLinks?.behance || artist.socialLinks?.portfolio) && (
                <a
                  href={artist.socialLinks?.behance || artist.socialLinks?.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 h-10 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Behance Portfolio
                </a>
              )}
              {artist.socialLinks?.twitter && (
                <a
                  href={artist.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/15 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {artist.socialLinks?.youtube && (
                <a
                  href={artist.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/15 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {artist.socialLinks?.discord && (
                <div
                  title={artist.socialLinks.discord}
                  className="px-3 h-10 rounded-lg border border-white/15 bg-zinc-900 flex items-center gap-1.5 text-xs font-mono text-zinc-300"
                >
                  <DiscordIcon className="w-4 h-4 text-indigo-400" />
                  <span>{artist.socialLinks.discord}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-6 border-t border-zinc-800/60 pt-4">
            <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
              {artist.bio || 'Verified creative professional in the Vanta Production network.'}
            </p>
          </div>
        </div>

        {/* Portfolio Gallery Section */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-900">
            <div>
              <h2 className="text-2xl font-black uppercase font-mono tracking-tight">
                Portfolio Showcase ({works.length})
              </h2>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-black font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Render based on layoutMode */}
          {filteredWorks.length > 0 ? (
            <div
              className={
                layout === 'editorial'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : layout === 'masonry'
                  ? 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {filteredWorks.map((work) => (
                <div key={work.id} className={layout === 'masonry' ? 'break-inside-avoid' : ''}>
                  <ProjectCard
                    project={work}
                    onClick={(p) => setSelectedProject(p)}
                    showArtist={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-sm font-mono text-zinc-500">No public projects published in this category yet.</p>
            </div>
          )}
        </div>
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </div>
  );
}

export default function ArtistPortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Loading artist portfolio...</div>}>
      <ArtistPortfolioContent />
    </Suspense>
  );
}
