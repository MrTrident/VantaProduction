'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Application } from '@/types';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
  Sparkles,
} from 'lucide-react';
import { DiscordIcon } from '@/components/social-icons';

export default function AdminApplicationsPage() {
  const { applications, moderateApplication, createInvitation, departments, positions } = useVanta();

  const [filter, setFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [invitedAppId, setInvitedAppId] = useState<string | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const filteredApps = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter);

  const handleApproveWithInvite = (app: Application) => {
    // Generate onboarding invitation
    const newInv = createInvitation({
      email: app.email,
      username: app.username,
      positionId: positions.find((p) => p.title === 'Artist')?.id,
      departmentId: departments.find((d) => d.slug === 'thumbnail-design')?.id,
    });

    moderateApplication(app.id, 'approved', 'Approved for onboarding. Invitation issued.');
    setInvitedAppId(app.id);
    setInviteToken(newInv.token);
  };

  const handleReject = (id: string) => {
    const notes = prompt('Enter rejection feedback or reason:');
    if (notes !== null) {
      moderateApplication(id, 'rejected', notes || 'Application does not meet current network standards.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-bold block mb-1">
          Talent Acquisition
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Recruitment Applications
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Review incoming artist applications submitted via /apply and issue secure account invitations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Applicants', value: 'all', count: applications.length },
          { label: 'Pending Evaluation', value: 'pending', count: applications.filter((a) => a.status === 'pending').length },
          { label: 'Approved & Invited', value: 'approved', count: applications.filter((a) => a.status === 'approved').length },
          { label: 'Rejected', value: 'rejected', count: applications.filter((a) => a.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              filter === tab.value
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-white">
                    {app.displayName}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400">@{app.username}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : app.status === 'rejected'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Contact Info Chips */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded">
                  <Mail className="w-3.5 h-3.5" /> {app.email}
                </span>
                <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded text-indigo-300">
                  <DiscordIcon className="w-3.5 h-3.5" /> {app.discordTag}
                </span>
              </div>

              {/* Specialization */}
              <div>
                <p className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5 font-bold">
                  Services Offered:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Experience:</p>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{app.experience}</p>
              </div>

              {/* Introduction */}
              {app.introduction && (
                <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-900 text-xs font-mono space-y-1">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">Why Vanta:</p>
                  <p className="text-zinc-400 text-[11px] italic leading-relaxed">&quot;{app.introduction}&quot;</p>
                </div>
              )}

              {/* Portfolio Links */}
              <div>
                <p className="text-[10px] font-mono uppercase text-zinc-500 mb-1 font-bold">
                  Submitted Portfolios:
                </p>
                <div className="space-y-1">
                  {app.portfolioLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-400 hover:text-blue-300 underline flex items-center gap-1 truncate"
                    >
                      <span>{link}</span> <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Token Display if approved */}
              {invitedAppId === app.id && inviteToken && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1">
                  <p className="text-emerald-400 font-bold">Onboarding Invitation Link Generated:</p>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/invite/accept?token=${inviteToken}`}
                    className="w-full px-2 py-1 bg-black border border-emerald-500/40 rounded text-[11px] text-white select-all"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            {app.status === 'pending' && (
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleReject(app.id)}
                  className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono uppercase tracking-wider"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveWithInvite(app)}
                  className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approve & Issue Invite
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
