'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { useVanta } from '@/lib/vanta-context';
import { PortfolioItem } from '@/types';
import { Search, Filter } from 'lucide-react';

export default function WorkPage() {
  const { portfolioItems } = useVanta();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Thumbnail Design',
    'Video Editing',
    'Motion Graphics',
    'Minecraft Development',
    'Graphic Design',
  ];

  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');

  const filtered = approvedWorks.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artistUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold">
            Archived Deliverables
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-mono tracking-tight text-white">
            Selected Work
          </h1>
          <p className="mt-4 text-base text-zinc-400">
            Browse verified production assets produced by the Vanta network for world-class creators and gaming studios.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-900">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search title, artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-xs font-mono text-zinc-500">
          Showing {filtered.length} of {approvedWorks.length} verified projects
        </div>

        {/* Project Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-900 rounded-2xl">
            <p className="text-sm font-mono text-zinc-400">No projects found matching your search.</p>
          </div>
        )}
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </div>
  );
}
