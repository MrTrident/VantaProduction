'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Settings, Shield, Crown, CheckCircle2, Lock, Database, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  const { isFounder, currentUser } = useVanta();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowPublicApplications, setAllowPublicApplications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block mb-1">
          Root Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Platform Security & Environment Settings
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Founder ownership protection protocols, database synchronization, and system toggles.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Platform settings saved.
        </div>
      )}

      {/* Founder Ownership Protection Card */}
      <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-zinc-950 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-400 flex items-center gap-2">
            <Crown className="w-4 h-4 fill-current" /> Supreme Founder Protection Protocol
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-black font-bold">
            ENFORCED
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The founder account (<strong className="text-white">smiikogod</strong>) is fortified by immutable database triggers and authorization middleware.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-2">
          <div className="flex items-center gap-2 p-2.5 rounded bg-black/60 border border-zinc-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cannot be demoted by any role</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded bg-black/60 border border-zinc-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authority revocation prohibited</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded bg-black/60 border border-zinc-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ownership transfer requires root token</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded bg-black/60 border border-zinc-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database RLS function active</span>
          </div>
        </div>
      </div>

      {/* Infrastructure Security Status */}
      <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
        <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> Platform Infrastructure & Data Protection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Encrypted Database Cluster</span>
              <span className="text-emerald-400 text-[10px] font-bold">SECURE & ISOLATED</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Row-Level Security (RLS) active. Internal connection credentials protected and masked.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Media CDN Pipeline</span>
              <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              High-resolution 4K asset storage, delivery caching, and WebP compression.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Toggles */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-6">
        <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
          Operational Toggles
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white font-mono">Accept Public Artist Applications (/apply)</p>
              <p className="text-[11px] text-zinc-400">Allow prospective creators to submit portfolio applications.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowPublicApplications(!allowPublicApplications)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                allowPublicApplications ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white font-mono">Platform Maintenance Lockdown</p>
              <p className="text-[11px] text-zinc-400">Restricts platform access exclusively to Founder & Executives.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                maintenanceMode ? 'bg-red-500 justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
        >
          Save Platform Configuration
        </button>
      </form>
    </div>
  );
}
