'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Bell, Send, Pin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { announcements, createAnnouncement, departments } = useVanta();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetScope, setTargetScope] = useState<'global' | 'department' | 'team'>('global');
  const [departmentId, setDepartmentId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      targetScope,
      departmentId: departmentId || undefined,
      departmentName: departments.find((d) => d.id === departmentId)?.name,
      isPinned,
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-bold block mb-1">
          Internal Communication
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Network Announcements
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Broadcast executive notices, division guidelines, or alert specific creative teams.
        </p>
      </div>

      {broadcastSent && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Announcement broadcast dispatched across selected scope!
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
        <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
          Dispatch New Notice
        </h3>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
            Announcement Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q2 Creator Retainer Updates"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Target Audience Scope *
            </label>
            <select
              value={targetScope}
              onChange={(e) => setTargetScope(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
            >
              <option value="global">Global (All Members & Artists)</option>
              <option value="department">Specific Department</option>
            </select>
          </div>

          {targetScope === 'department' && (
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Target Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
            Content & Instructions *
          </label>
          <textarea
            rows={4}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detailed broadcast body..."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700"
            />
            <span>Pin Announcement to Artist Dashboards</span>
          </label>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast Notice
          </button>
        </div>
      </form>

      {/* History */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
          Broadcast History ({announcements.length})
        </h3>
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-amber-300">
                  {ann.targetScope} {ann.departmentName ? `• ${ann.departmentName}` : ''}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{ann.createdAt}</span>
              </div>
              <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                {ann.title}
                {ann.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-current" />}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{ann.content}</p>
              <p className="text-[10px] font-mono text-zinc-600">Dispatched by: {ann.authorName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
