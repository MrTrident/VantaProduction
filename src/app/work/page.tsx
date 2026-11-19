'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { useVanta } from '@/lib/vanta-context';
import { PortfolioItem } from '@/types';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function WorkPage() {
  const { portfolioItems } = useVanta();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Thumbnail Design',
    'Graphic Design',
    'Video Editing',
    'Motion Graphics',
    'Minecraft Development',
  ];

  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');

  const filtered = approvedWorks.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artistUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artistDisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
              Verified Production Works
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase font-mono tracking-tight text-white leading-none">
            Selected Work
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Explore verified high-CTR thumbnail designs, cinematic edits, and custom creative assets produced by Vanta artists.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.02]'
                    : 'bg-zinc-950/80 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-zinc-900 border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, artist, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/90 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 backdrop-blur-md transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Showing {filtered.length} of {approvedWorks.length} verified projects</span>
          <span className="text-[11px] text-zinc-500">Click any card to inspect full high-res artwork</span>
        </div>

        {/* Project Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl">
            <p className="text-sm font-mono text-zinc-400">No projects found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Modal Lightbox */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </div>
  );
}
