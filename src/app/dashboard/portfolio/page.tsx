'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVanta } from '@/lib/vanta-context';
import { ProjectModal } from '@/components/project-modal';
import { PortfolioItem } from '@/types';
import {
  UploadCloud,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function ArtistPortfolioManagementPage() {
  const { currentUser, portfolioItems, deletePortfolioItem, updatePortfolioItem } = useVanta();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [previewProject, setPreviewProject] = useState<PortfolioItem | null>(null);

  if (!currentUser) return null;

  const userItems = portfolioItems.filter(
    (item) => item.artistUsername.toLowerCase() === currentUser.username.toLowerCase() || item.artistId === currentUser.id
  );

  const filteredItems = activeTab === 'all'
    ? userItems
    : userItems.filter((i) => i.status === activeTab);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
    } catch {}
    deletePortfolioItem(id);
  };

  const handleStatusToggle = async (item: PortfolioItem) => {
    const isFounder = currentUser.isFounder;

    if (isFounder) {
      const nextStatus = item.status === 'approved' ? 'draft' : 'approved';
      try {
        await fetch('/api/portfolio', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, status: nextStatus }),
        });
      } catch {}
      updatePortfolioItem(item.id, {
        status: nextStatus,
        isPublic: nextStatus === 'approved',
      });
    } else {
      // Ordinary artist: can submit draft for review, cannot approve own item
      if (item.status === 'draft' || item.status === 'changes_requested') {
        try {
          await fetch('/api/portfolio', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, status: 'submitted' }),
          });
        } catch {}
        updatePortfolioItem(item.id, { status: 'submitted', isPublic: false });
      }
    }
  };

  const statusBadges = {
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    reviewing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    submitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    changes_requested: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            My Portfolio Projects
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Manage your verified works, drafts, and track moderation decisions from department heads.
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="px-5 py-2.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <UploadCloud className="w-4 h-4" /> Upload New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Projects', value: 'all', count: userItems.length },
          { label: 'Approved', value: 'approved', count: userItems.filter((i) => i.status === 'approved').length },
          { label: 'Pending Review', value: 'submitted', count: userItems.filter((i) => i.status === 'submitted' || i.status === 'reviewing').length },
          { label: 'Changes Requested', value: 'changes_requested', count: userItems.filter((i) => i.status === 'changes_requested').length },
          { label: 'Drafts', value: 'draft', count: userItems.filter((i) => i.status === 'draft').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === tab.value
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden flex flex-col justify-between group hover:border-white/30 transition-all"
            >
              <div>
                {/* Media Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                      statusBadges[item.status]
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>

                  {item.isFeatured && (
                    <span className="absolute top-3 right-3 p-1 rounded-full bg-amber-400 text-black">
                      <Sparkles className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold font-mono uppercase text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description || 'No description provided.'}
                  </p>

                  {item.moderationNotes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
                      <span className="text-amber-400 text-[10px] font-bold uppercase block">
                        Moderation Note:
                      </span>
                      <p className="text-zinc-300 text-[11px]">{item.moderationNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-zinc-900 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewProject(item)}
                  className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>

                <div className="flex items-center gap-2">
                  {currentUser.isFounder ? (
                    <button
                      onClick={() => handleStatusToggle(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-white/10 text-zinc-200 border border-white/20 hover:bg-white hover:text-black font-semibold'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status === 'approved' ? 'Public' : 'Publish'}
                    </button>
                  ) : item.status === 'draft' || item.status === 'changes_requested' ? (
                    <button
                      onClick={() => handleStatusToggle(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 font-semibold"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit for Review
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500 px-2">
                      {item.status === 'approved' ? 'Live on Portfolio' : 'Under Review'}
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-zinc-900 rounded-2xl space-y-3">
          <p className="text-sm font-mono text-zinc-400">No projects found in this category.</p>
        </div>
      )}

      {/* Preview Modal */}
      <ProjectModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
}
