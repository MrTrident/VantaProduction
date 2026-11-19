'use client';

import React from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Bell, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function ArtistNotificationsPage() {
  const { currentUser, announcements, portfolioItems } = useVanta();

  if (!currentUser) return null;

  // Derive notifications from moderation feedback and announcements
  const userProjects = portfolioItems.filter(
    (item) => item.artistUsername.toLowerCase() === currentUser.username.toLowerCase()
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-zinc-900">
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Notifications & Activity
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Moderation feedback, department alerts, and executive broadcasts.
        </p>
      </div>

      <div className="space-y-4">
        {/* Moderation Alerts */}
        {userProjects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-xl border border-white/10 bg-zinc-950 flex items-start gap-4"
          >
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
              {p.status === 'approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : p.status === 'changes_requested' ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono uppercase text-white">
                  Submission Status: {p.status.replace('_', ' ')}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">{p.updatedAt}</span>
              </div>
              <p className="text-xs text-zinc-300">
                Project &quot;{p.title}&quot; is currently marked as <span className="font-bold text-white uppercase">{p.status}</span>.
              </p>
              {p.moderationNotes && (
                <div className="mt-2 p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  <span className="text-amber-400 font-bold">Feedback: </span>
                  {p.moderationNotes}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Announcements */}
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-xl border border-white/10 bg-zinc-950 flex items-start gap-4"
          >
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono uppercase text-white">
                  {ann.title}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">{ann.createdAt}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{ann.content}</p>
              <span className="text-[10px] font-mono text-zinc-500 block pt-1">
                From: {ann.authorName} ({ann.targetScope.toUpperCase()})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
