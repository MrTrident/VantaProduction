'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

export default function HomePage() {
  const { homepageConfig, portfolioItems, artistProfiles, creators, services } = useVanta();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter approved items
  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');
  const categories = ['All', 'Thumbnail Design', 'Video Editing', 'Motion Graphics', 'Minecraft Development', 'Graphic Design'];

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
          <div className="relative z-20 max-w-4xl mx-auto px-4 text-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md mb-8 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300">
                Private Creative Production Network
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight font-mono text-white leading-[0.95]">
              {homepageConfig.heroHeadline || 'CREATIVITY. BUILT TOGETHER.'}
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
              {homepageConfig.heroSubheading ||
                'An independent creative production network bringing talented artists and creators together.'}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/work"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group"
              >
                Explore Our Work
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/artists"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-950 border border-white/20 text-white font-semibold uppercase tracking-wider text-xs hover:border-white hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
              >
                Meet Our Artists
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 max-w-3xl mx-auto">
              <div>
                <p className="text-2xl font-black font-mono text-white">500M+</p>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Creator Views Driven</p>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-white">100%</p>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Curated Talent</p>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-white">15+</p>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Production Roles</p>
              </div>
              <div>
                <p className="text-2xl font-black font-mono text-white">4K UHD</p>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Delivery Standard</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Selected Work Section */}
      {homepageConfig.sectionsVisibility?.work && (
        <section id="work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 block mb-2 font-semibold">
                Portfolio Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono text-white">
                Selected Work
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              View Full Archive ({approvedWorks.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-zinc-900">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-2 font-semibold">
                  Network Talent
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono text-white">
                  Featured Artists
                </h2>
              </div>
              <Link
                href="/artists"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                Explore All Artists ({artistProfiles.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 block mb-2 font-semibold">
              Trusted Partnerships
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono text-white">
              Creators We Work With
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Only verified creators with active production contracts are displayed here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.filter((c) => c.isPublic).map((creator) => (
              <div
                key={creator.id}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-zinc-950 hover:border-white/30 transition-all"
              >
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20 mb-4 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-base font-bold text-white font-mono">{creator.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{creator.handle}</p>
                <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  {creator.category}
                </span>

                <div className="mt-6 flex items-center justify-around w-full border-t border-zinc-900 pt-4 text-xs font-mono text-zinc-400">
                  <div>
                    <span className="block font-bold text-white">{creator.subscriberCount}</span>
                    <span className="text-[10px] text-zinc-500">Subscribers</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800" />
                  <div>
                    <span className="block font-bold text-white">{creator.viewCount}</span>
                    <span className="text-[10px] text-zinc-500">Total Views</span>
                  </div>
                </div>

                <a
                  href={creator.channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Visit Channel <ExternalLink className="w-3 h-3" />
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
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 block mb-2 font-semibold">
                Network Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono text-white">
                Production Services
              </h2>
              <p className="mt-3 text-sm text-zinc-400">
                End-to-end creative solutions tailored for modern digital creators and streaming networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter((s) => s.isActive).map((srv) => (
                <div
                  key={srv.id}
                  className="p-8 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-white/30 transition-colors">
                      {srv.iconName === 'Image' && <ImageIcon className="w-6 h-6" />}
                      {srv.iconName === 'Video' && <Video className="w-6 h-6" />}
                      {srv.iconName === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                      {srv.iconName === 'Palette' && <Palette className="w-6 h-6" />}
                      {srv.iconName === 'Code' && <Code className="w-6 h-6" />}
                      {srv.iconName === 'LayoutDashboard' && <LayoutDashboard className="w-6 h-6" />}
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-wider font-mono text-white">
                      {srv.title}
                    </h3>
                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    <div className="mt-6 space-y-2 border-t border-zinc-900 pt-4">
                      {srv.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/services"
                    className="mt-8 block text-center py-2.5 rounded-lg border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white transition-colors"
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
          <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto">
            Whether you are a creator seeking an elite production team or an exceptional artist ready to join our roster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Apply as an Artist
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-lg bg-zinc-900 border border-white/20 text-white font-semibold uppercase tracking-wider text-xs hover:border-white transition-colors"
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
