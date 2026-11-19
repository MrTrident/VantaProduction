'use client';

import React from 'react';
import { useVanta } from '@/lib/vanta-context';
import { BarChart3, TrendingUp, Users, FolderKanban, CheckCircle2, Award } from 'lucide-react';

export default function AdminReportsPage() {
  const { artistProfiles, portfolioItems, applications, departments, projects } = useVanta();

  const totalWorks = portfolioItems.length;
  const approvedWorks = portfolioItems.filter((i) => i.status === 'approved').length;
  const approvalRate = totalWorks > 0 ? Math.round((approvedWorks / totalWorks) * 100) : 100;

  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'approved').length;
  const acceptanceRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
          Operational Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Production & Talent Analytics
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Executive performance metrics, department throughput, quality benchmarks, and recruitment yield.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Quality Approval Rate</span>
          <p className="text-3xl font-black font-mono text-emerald-400">{approvalRate}%</p>
          <p className="text-[10px] font-mono text-zinc-500">{approvedWorks} of {totalWorks} deliverables approved</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Talent Acceptance Rate</span>
          <p className="text-3xl font-black font-mono text-blue-400">{acceptanceRate}%</p>
          <p className="text-[10px] font-mono text-zinc-500">Strict invite-only threshold</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Active Production Pipelines</span>
          <p className="text-3xl font-black font-mono text-purple-400">{projects.length}</p>
          <p className="text-[10px] font-mono text-zinc-500">Contracted creator deals</p>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Active Talent Roster</span>
          <p className="text-3xl font-black font-mono text-amber-400">{artistProfiles.length}</p>
          <p className="text-[10px] font-mono text-zinc-500">Spanning {departments.length} divisions</p>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-6">
        <h3 className="text-xs font-mono uppercase font-bold text-white tracking-wider pb-3 border-b border-zinc-900">
          Departmental Talent Distribution & Output
        </h3>

        <div className="space-y-4">
          {departments.map((dept) => {
            const count = portfolioItems.filter(
              (p) => p.category.toLowerCase().includes(dept.slug.split('-')[0])
            ).length;
            const percentage = totalWorks > 0 ? Math.min(100, Math.round((count / totalWorks) * 100)) : 20;

            return (
              <div key={dept.id} className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{dept.name}</span>
                  <span className="text-zinc-400">{count} Works Produced ({percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
