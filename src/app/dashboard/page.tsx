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
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { currentUser, portfolioItems, tasks, announcements } = useVanta();

  if (!currentUser) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-sm font-mono text-zinc-400">Please authenticate to access your Artist Workspace.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase"
        >
          Sign In
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
      <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block mb-1 font-bold">
            Verified Creative Workspace
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-white">
            Welcome back, {currentUser.displayName}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {currentUser.positionTitle || 'Artist'} • {currentUser.departmentName || 'Creative Division'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            className="px-5 py-2.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Submit New Work
          </Link>
          <Link
            href={`/artists/${currentUser.username}`}
            target="_blank"
            className="px-4 py-2.5 rounded-lg border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:border-white transition-colors flex items-center gap-1.5"
          >
            Live Portfolio <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Published Works</span>
            <FolderKanban className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-mono text-white">{publishedCount}</p>
          <p className="text-[10px] font-mono text-zinc-500">Live on public showcase</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">In Moderation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black font-mono text-white">{pendingCount}</p>
          <p className="text-[10px] font-mono text-zinc-500">Awaiting department review</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Draft Projects</span>
            <FileEdit className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black font-mono text-white">{draftCount}</p>
          <p className="text-[10px] font-mono text-zinc-500">Unsubmitted works</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Views Driven</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black font-mono text-white">{totalViews.toLocaleString()}</p>
          <p className="text-[10px] font-mono text-zinc-500">Across verified works</p>
        </div>
      </div>

      {/* Main Grid: Submissions & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Submissions Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
              Recent Submissions & Moderation
            </h3>
            <Link
              href="/dashboard/portfolio"
              className="text-xs font-mono text-zinc-400 hover:text-white"
            >
              View All ({userProjects.length}) →
            </Link>
          </div>

          {userProjects.length > 0 ? (
            <div className="space-y-3">
              {userProjects.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-white/10 bg-zinc-950 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white font-mono truncate">{item.title}</p>
                      <span className="text-[10px] font-mono text-zinc-400 block truncate">
                        {item.category} • {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'changes_requested'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : item.status === 'rejected'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    {item.moderationNotes && (
                      <p className="mt-1 text-[9px] font-mono text-zinc-500 max-w-[150px] truncate">
                        &quot;{item.moderationNotes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-xl">
              <p className="text-xs font-mono text-zinc-500">You have not submitted any projects yet.</p>
              <Link
                href="/dashboard/upload"
                className="mt-2 inline-block text-xs font-mono text-white underline"
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
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white pb-2 border-b border-zinc-900">
              Assigned Production Tasks ({assignedTasks.length})
            </h3>
            {assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {assignedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-white/10 bg-zinc-950 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Due {task.deadline || 'TBD'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white font-mono">{task.title}</p>
                    <p className="text-[11px] text-zinc-400">{task.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/60 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-mono text-zinc-400">All current production tasks completed.</p>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white pb-2 border-b border-zinc-900">
              Network Announcements
            </h3>
            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 space-y-1.5">
                  <p className="text-xs font-bold text-white font-mono">{ann.title}</p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{ann.content}</p>
                  <span className="text-[9px] font-mono text-zinc-500 block pt-1">
                    By {ann.authorName} • {ann.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
