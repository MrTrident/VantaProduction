'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FloatingArtwork } from '@/components/floating-artwork';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { ArtistCard } from '@/components/artist-card';
import { useVanta } from '@/lib/vanta-context';
import { PortfolioItem } from '@/types';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Palette,
  Code,
  LayoutDashboard,
  ExternalLink,
  Flame,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const { homepageConfig, portfolioItems, artistProfiles, creators, services } = useVanta();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter approved items
  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');
  const categories = ['All', 'Thumbnail Design', 'Graphic Design', 'Video Editing', 'Motion Graphics', 'Minecraft Development'];

  const filteredWorks = selectedCategory === 'All'
    ? approvedWorks
    : approvedWorks.filter((item) => item.category === selectedCategory);

  const featuredArtists = artistProfiles.filter((a) => a.isPublic && a.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      {homepageConfig.sectionsVisibility?.hero && (
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-vanta-grid">
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-vanta-radial pointer-events-none" />

          {/* Floating Artwork System */}
          {homepageConfig.enableFloatingArtwork && (
            <FloatingArtwork onProjectClick={(item) => setSelectedProject(item)} />
          )}

          {/* Central Hero Headline (Protected Z-Index so cards never obstruct) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-20 max-w-4xl mx-auto px-4 text-center pointer-events-auto py-16"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-black/70 backdrop-blur-xl mb-8 shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-200 font-medium">
                Private Creative Production Network
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight font-mono text-white leading-[0.95] drop-shadow-2xl">
              {homepageConfig.heroHeadline || 'CREATIVITY. BUILT TOGETHER.'}
            </h1>

            <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
              {homepageConfig.heroSubheading ||
                'An independent creative production network bringing talented artists and creators together.'}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/work"
                className="w-full sm:w-auto px-9 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2.5 group hover:scale-105 active:scale-95"
              >
                Explore Our Work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/artists"
                className="w-full sm:w-auto px-9 py-4 rounded-xl bg-zinc-950/80 backdrop-blur-xl border border-white/20 text-white font-semibold uppercase tracking-wider text-xs font-mono hover:border-white hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Meet Our Artists
              </Link>
            </div>

            {/* Quick Stats Banner (Glass card style) */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border border-white/10 rounded-2xl bg-zinc-950/60 backdrop-blur-xl p-6 max-w-3xl mx-auto shadow-2xl">
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white">500M+</p>
                <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5">Views Driven</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white">100%</p>
                <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5">Vetted Talent</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white">Top 1%</p>
                <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5">Click-Through Rate</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white">4K UHD</p>
                <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5">Delivery Standard</p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Selected Work Section */}
      {homepageConfig.sectionsVisibility?.work && (
        <section id="work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 block mb-2 font-semibold">
                Portfolio Showcase
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-mono text-white">
                Selected Work
              </h2>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
                Real high-CTR thumbnail designs, graphic branding, and video edits crafted by Vanta artists.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all self-start md:self-auto"
            >
              View Full Archive ({approvedWorks.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category Filter Tabs (Glass pill styling) */}
          <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-4 border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]'
                    : 'bg-zinc-950/80 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-zinc-900 border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredWorks.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Artists Section */}
      {homepageConfig.sectionsVisibility?.artists && (
        <section className="py-24 border-t border-white/10 bg-zinc-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 block mb-2 font-semibold">
                  Network Talent
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-mono text-white">
                  Featured Artists
                </h2>
                <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
                  The verified creative masterminds behind Vanta Production.
                </p>
              </div>
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all self-start md:self-auto"
              >
                Explore All Artists ({artistProfiles.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.userId} artist={artist} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Creators We Work With Section */}
      {homepageConfig.sectionsVisibility?.creators && (
        <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold">
              Trusted Partnerships
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-mono text-white">
              Creators We Work With
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300">
              Only verified creators with active production contracts are displayed here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.filter((c) => c.isPublic).map((creator) => (
              <div
                key={creator.id}
                className="group relative flex flex-col items-center text-center p-7 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl hover:border-white/30 hover:shadow-2xl transition-all"
              >
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20 mb-4 group-hover:scale-105 transition-transform shadow-md"
                />
                <h3 className="text-base font-bold text-white font-mono">{creator.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{creator.handle}</p>
                <span className="mt-2.5 text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-zinc-200 border border-white/10">
                  {creator.category}
                </span>

                <div className="mt-6 flex items-center justify-around w-full border-t border-white/10 pt-4 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="block font-bold text-white text-sm">{creator.subscriberCount}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Subscribers</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800" />
                  <div>
                    <span className="block font-bold text-white text-sm">{creator.viewCount}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Total Views</span>
                  </div>
                </div>

                <a
                  href={creator.channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-300 hover:text-white"
                >
                  Visit Channel <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Production Services Section */}
      {homepageConfig.sectionsVisibility?.services && (
        <section className="py-24 border-t border-white/10 bg-zinc-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold">
                Network Capabilities
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-mono text-white">
                Production Services
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-300">
                End-to-end creative solutions tailored for modern digital creators and streaming networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter((s) => s.isActive).map((srv) => (
                <div
                  key={srv.id}
                  className="p-8 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl flex flex-col justify-between hover:border-white/30 hover:shadow-2xl transition-all group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-white/30 group-hover:scale-105 transition-all shadow-md">
                      {srv.iconName === 'Image' && <ImageIcon className="w-7 h-7" />}
                      {srv.iconName === 'Video' && <Video className="w-7 h-7" />}
                      {srv.iconName === 'Sparkles' && <Sparkles className="w-7 h-7" />}
                      {srv.iconName === 'Palette' && <Palette className="w-7 h-7" />}
                      {srv.iconName === 'Code' && <Code className="w-7 h-7" />}
                      {srv.iconName === 'LayoutDashboard' && <LayoutDashboard className="w-7 h-7" />}
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-wider font-mono text-white">
                      {srv.title}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-sans">
                      {srv.shortDesc}
                    </p>

                    <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                      {srv.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200 font-mono">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/services"
                    className="mt-8 block text-center py-3 rounded-xl border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-200 hover:text-white hover:border-white bg-white/5 hover:bg-white/10 transition-all font-semibold"
                  >
                    View Deliverables →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 border-t border-white/10 bg-[#050505] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-mono text-white leading-tight">
            Ready to Build With Vanta?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto">
            Whether you are a creator seeking an elite production team or an exceptional artist ready to join our roster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
            >
              Apply as an Artist
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-white/20 text-white font-semibold uppercase tracking-wider text-xs font-mono hover:border-white transition-all hover:scale-105 active:scale-95"
            >
              Commission Vanta
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Viewer */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </div>
  );
}
