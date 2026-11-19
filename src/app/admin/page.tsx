'use client';

import React from 'react';
import Link from 'next/link';
import { useVanta } from '@/lib/vanta-context';
import {
  Users,
  Briefcase,
  Layers,
  FileCheck,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ScrollText,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const {
    artistProfiles,
    profiles,
    departments,
    applications,
    portfolioItems,
    auditLogs,
    isFounder,
    currentUser,
  } = useVanta();

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const pendingSubmissions = portfolioItems.filter(
    (i) => i.status === 'submitted' || i.status === 'reviewing'
  );
  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Executive Command Console
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-white">
            Vanta Operations Center
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {currentUser?.displayName} • {currentUser?.positionTitle} • Supreme Security Protocol Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            Review Works ({pendingSubmissions.length})
          </Link>
          <Link
            href="/admin/applications"
            className="px-4 py-2.5 rounded-lg border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:border-white transition-colors"
          >
            Applications ({pendingApps.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Verified Artists</span>
          <p className="text-2xl font-black font-mono text-white">{artistProfiles.length}</p>
          <p className="text-[10px] font-mono text-emerald-400">Active Talent Pool</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Active Staff</span>
          <p className="text-2xl font-black font-mono text-white">{profiles.length}</p>
          <p className="text-[10px] font-mono text-blue-400">Hierarchy & Mgmt</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Departments</span>
          <p className="text-2xl font-black font-mono text-white">{departments.length}</p>
          <p className="text-[10px] font-mono text-purple-400">Production Divisions</p>
        </div>

        <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <span className="text-[10px] font-mono uppercase text-amber-300">Pending Review</span>
          <p className="text-2xl font-black font-mono text-amber-400">{pendingSubmissions.length}</p>
          <p className="text-[10px] font-mono text-amber-500">Requires Moderation</p>
        </div>

        <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
          <span className="text-[10px] font-mono uppercase text-blue-300">Pending Apps</span>
          <p className="text-2xl font-black font-mono text-blue-400">{pendingApps.length}</p>
          <p className="text-[10px] font-mono text-blue-500">Recruitment Queue</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Published Works</span>
          <p className="text-2xl font-black font-mono text-white">{approvedWorks.length}</p>
          <p className="text-[10px] font-mono text-zinc-500">Live on Public Site</p>
        </div>
      </div>

      {/* Main Grid: Action Queues & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Action Queues */}
        <div className="lg:col-span-7 space-y-6">
          {/* Submissions Queue */}
          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-amber-400" /> Pending Portfolio Moderation ({pendingSubmissions.length})
              </h3>
              <Link href="/admin/portfolio" className="text-[11px] font-mono text-zinc-400 hover:text-white">
                Open Queue →
              </Link>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div className="space-y-3">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sub.mediaUrl}
                        alt={sub.title}
                        className="w-12 h-9 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white font-mono truncate">{sub.title}</p>
                        <p className="text-[10px] font-mono text-zinc-400 truncate">
                          by @{sub.artistUsername} • {sub.category}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/portfolio"
                      className="shrink-0 px-3 py-1 rounded bg-white text-black font-bold text-[10px] font-mono uppercase"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-500 py-4 text-center">
                All submissions have been reviewed and moderated.
              </p>
            )}
          </div>

          {/* Applications Queue */}
          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" /> Public Recruitment Applications ({pendingApps.length})
              </h3>
              <Link href="/admin/applications" className="text-[11px] font-mono text-zinc-400 hover:text-white">
                View All →
              </Link>
            </div>

            {pendingApps.length > 0 ? (
              <div className="space-y-3">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-white font-mono">{app.displayName} (@{app.username})</p>
                      <p className="text-[10px] font-mono text-zinc-400">{app.services.join(', ')}</p>
                    </div>
                    <Link
                      href="/admin/applications"
                      className="px-3 py-1 rounded bg-blue-500 text-white font-bold text-[10px] font-mono uppercase"
                    >
                      Examine
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-500 py-4 text-center">
                No pending artist applications awaiting evaluation.
              </p>
            )}
          </div>
        </div>

        {/* Live Immutable Audit Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-emerald-400" /> Live Audit Trail
              </h3>
              <Link href="/admin/audit-logs" className="text-[11px] font-mono text-zinc-400 hover:text-white">
                Full Log →
              </Link>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400 font-bold">{log.action}</span>
                    <span className="text-zinc-500">{log.createdAt}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">By: {log.userName}</p>
                  <p className="text-[10px] text-zinc-500 font-mono truncate">
                    {JSON.stringify(log.details)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
