'use client';

import React from 'react';
import Link from 'next/link';
import { useVanta } from '@/lib/vanta-context';
import {
  FolderKanban,
  Clock,
  FileEdit,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UploadCloud,
  Palette,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { currentUser, portfolioItems, tasks, announcements } = useVanta();

  if (!currentUser) {
    return (
      <div className="text-center py-24 space-y-5 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-8 max-w-xl mx-auto shadow-2xl">
        <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold font-mono text-white">Private Artist Workspace</h2>
        <p className="text-sm font-sans text-zinc-300">Please sign in to access your dashboard, upload portfolio artwork, and manage projects.</p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-xl bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Sign In Securely
        </Link>
      </div>
    );
  }

  // Filter projects owned by current user
  const userProjects = portfolioItems.filter(
    (item) => item.artistUsername.toLowerCase() === currentUser.username.toLowerCase()
  );

  const publishedCount = userProjects.filter((i) => i.status === 'approved').length;
  const pendingCount = userProjects.filter((i) => i.status === 'submitted' || i.status === 'reviewing').length;
  const draftCount = userProjects.filter((i) => i.status === 'draft').length;
  const totalViews = userProjects.reduce((acc, curr) => acc + (curr.views || 0), 0);

  // Assigned tasks for this user
  const assignedTasks = tasks.filter((t) => t.assignedUserIds?.includes(currentUser.id));

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 sm:p-10 rounded-3xl border border-white/15 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-black flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 font-medium">
              Verified Production Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight text-white">
            Welcome back, {currentUser.displayName}
          </h1>
          <p className="mt-2 text-sm text-zinc-300 font-sans">
            {currentUser.positionTitle || 'Artist'} • {currentUser.departmentName || 'Creative Division'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/dashboard/upload"
            className="px-6 py-3.5 rounded-xl bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Submit Artwork
          </Link>
          <Link
            href={`/artists/${currentUser.username}`}
            target="_blank"
            className="px-5 py-3.5 rounded-xl border border-white/20 bg-zinc-900/80 text-white font-mono text-xs uppercase tracking-wider hover:border-white transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            Public Portfolio <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards (Glassmorphism + readable bold typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-2 shadow-xl hover:border-white/25 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Published Works</span>
            <FolderKanban className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-4xl font-black font-mono text-white">{publishedCount}</p>
          <p className="text-xs font-mono text-zinc-400">Live on public archive</p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-2 shadow-xl hover:border-white/25 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">In Moderation</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-4xl font-black font-mono text-white">{pendingCount}</p>
          <p className="text-xs font-mono text-zinc-400">Under department review</p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-2 shadow-xl hover:border-white/25 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Draft Assets</span>
            <FileEdit className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-4xl font-black font-mono text-white">{draftCount}</p>
          <p className="text-xs font-mono text-zinc-400">Private work-in-progress</p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-2 shadow-xl hover:border-white/25 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Views Driven</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-black font-mono text-white">{totalViews.toLocaleString()}</p>
          <p className="text-xs font-mono text-zinc-400">Verified portfolio reach</p>
        </div>
      </div>

      {/* Main Grid: Submissions & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Submissions Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold uppercase font-mono tracking-wider text-white">
              Recent Submissions & Status
            </h3>
            <Link
              href="/dashboard/portfolio"
              className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
            >
              View All ({userProjects.length}) →
            </Link>
          </div>

          {userProjects.length > 0 ? (
            <div className="space-y-3.5">
              {userProjects.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between gap-4 hover:border-white/25 transition-all shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded-xl border border-white/10 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white font-mono truncate">{item.title}</p>
                      <span className="text-xs font-mono text-zinc-400 block truncate mt-0.5">
                        {item.category} • {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'changes_requested'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : item.status === 'rejected'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    {item.moderationNotes && (
                      <p className="mt-1.5 text-xs font-mono text-zinc-400 max-w-[180px] truncate">
                        &quot;{item.moderationNotes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-white/15 rounded-2xl bg-zinc-950/40">
              <p className="text-sm font-mono text-zinc-400">You have not submitted any projects yet.</p>
              <Link
                href="/dashboard/upload"
                className="mt-3 inline-block px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Upload your first artwork
              </Link>
            </div>
          )}
        </div>

        {/* Assigned Production Tasks & Announcements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tasks */}
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase font-mono tracking-wider text-white pb-3 border-b border-white/10">
              Assigned Tasks ({assignedTasks.length})
            </h3>
            {assignedTasks.length > 0 ? (
              <div className="space-y-3.5">
                {assignedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-2.5 hover:border-white/25 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                        {task.priority}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Due {task.deadline || 'TBD'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white font-mono">{task.title}</p>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">{task.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/40 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-mono text-zinc-300">All caught up!</p>
                <p className="text-xs text-zinc-400 mt-1">No pending deliverables assigned to you right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
