'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Service } from '@/types';
import { Sparkles, Edit2, CheckCircle2, X } from 'lucide-react';

export default function AdminServicesPage() {
  const { services, updateService } = useVanta();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const openEdit = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setShortDesc(s.shortDesc);
    setFullDesc(s.fullDesc);
    setDeliverablesText(s.deliverables.join('\n'));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    updateService(editingService.id, {
      title,
      shortDesc,
      fullDesc,
      deliverables: deliverablesText
        .split('\n')
        .map((d) => d.trim())
        .filter((d) => d.length > 0),
    });

    setEditingService(null);
  };

  const toggleActive = (id: string, current: boolean) => {
    updateService(id, { isActive: !current });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
          Capability Offerings CMS
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Services & Deliverables
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Configure production capability cards, deliverable checklists, and service visibility on the public site.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {srv.iconName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(srv)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleActive(srv.id, srv.isActive)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      srv.isActive ? 'text-emerald-400' : 'text-zinc-600'
                    }`}
                  >
                    {srv.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold font-mono uppercase text-white">{srv.title}</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{srv.shortDesc}</p>

              <div className="mt-4 pt-4 border-t border-zinc-900 space-y-1.5">
                <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Deliverables:</p>
                {srv.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold font-mono uppercase text-white">
                Edit Production Service: {editingService.title}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Deliverables Checklist (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Save Deliverable Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
