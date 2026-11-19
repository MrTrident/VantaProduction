'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { ProjectModal } from '@/components/project-modal';
import { PortfolioItem } from '@/types';
import {
  FolderKanban,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';

export default function AdminPortfolioPage() {
  const { portfolioItems, moderatePortfolioItem, toggleFloatingArtwork } = useVanta();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewProject, setPreviewProject] = useState<PortfolioItem | null>(null);
  const [actionNotes, setActionNotes] = useState<{ [id: string]: string }>({});

  const filteredItems = filterStatus === 'all'
    ? portfolioItems
    : portfolioItems.filter((i) => i.status === filterStatus);

  const handleApprove = (id: string) => {
    moderatePortfolioItem(id, 'approved', actionNotes[id] || 'Approved by quality assurance curator.');
  };

  const handleReject = (id: string) => {
    if (!actionNotes[id]) {
      alert('Please provide a moderation note explaining why this submission was rejected.');
      return;
    }
    moderatePortfolioItem(id, 'rejected', actionNotes[id]);
  };

  const handleRequestChanges = (id: string) => {
    if (!actionNotes[id]) {
      alert('Please provide change instructions for the artist.');
      return;
    }
    moderatePortfolioItem(id, 'changes_requested', actionNotes[id]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Quality Assurance & Curation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Portfolio Moderation System
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Review submissions, request craft revisions, publish to archive, and curate hero floating artwork.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Submissions', value: 'all', count: portfolioItems.length },
          { label: 'Pending Review', value: 'submitted', count: portfolioItems.filter((i) => i.status === 'submitted' || i.status === 'reviewing').length },
          { label: 'Approved', value: 'approved', count: portfolioItems.filter((i) => i.status === 'approved').length },
          { label: 'Changes Requested', value: 'changes_requested', count: portfolioItems.filter((i) => i.status === 'changes_requested').length },
          { label: 'Rejected', value: 'rejected', count: portfolioItems.filter((i) => i.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              filterStatus === tab.value
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Moderation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all shadow-xl"
          >
            <div>
              {/* Media Preview & Status */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 mb-4">
                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/80 border border-white/20 text-white">
                  {item.category}
                </span>

                <button
                  onClick={() => setPreviewProject(item)}
                  className="absolute bottom-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 hover:bg-white hover:text-black transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Fullscreen
                </button>
              </div>

              {/* Title & Artist */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    By @{item.artistUsername} ({item.artistDisplayName})
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                    item.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'changes_requested'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : item.status === 'rejected'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                {item.description || 'No description notes provided.'}
              </p>

              {/* Floating Hero Toggle */}
              <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Floating Artwork Hero System
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Include in the interactive 3D hero card cloud on the public homepage.
                  </p>
                </div>

                <button
                  onClick={() => toggleFloatingArtwork(item.id)}
                  className={`px-3 py-1 rounded text-xs font-mono uppercase font-bold transition-colors ${
                    item.isFloatingHero
                      ? 'bg-amber-400 text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.isFloatingHero ? 'Active in Hero' : 'Inactive'}
                </button>
              </div>

              {/* Moderation Notes Field */}
              <div className="mt-4">
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Curator / Moderation Feedback:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Contrast in bottom right needs boost; excellent rim light."
                  value={actionNotes[item.id] || item.moderationNotes || ''}
                  onChange={(e) => setActionNotes({ ...actionNotes, [item.id]: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-2">
              <button
                onClick={() => handleRequestChanges(item.id)}
                className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs font-mono uppercase tracking-wider"
              >
                Request Revision
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="px-3.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono uppercase tracking-wider"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(item.id)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
}
