'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Creator } from '@/types';
import { Video, Plus, Edit2, Trash2, ExternalLink, Sparkles, X } from 'lucide-react';

export default function AdminCreatorsPage() {
  const { creators, addCreator, updateCreator, deleteCreator } = useVanta();

  const [showModal, setShowModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
  const [subscribers, setSubscribers] = useState('');
  const [views, setViews] = useState('');
  const [category, setCategory] = useState('Minecraft Gaming');
  const [isFeatured, setIsFeatured] = useState(true);

  const handleOpenCreate = () => {
    setEditingCreator(null);
    setName('');
    setHandle('');
    setChannelUrl('');
    setSubscribers('');
    setViews('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Creator) => {
    setEditingCreator(c);
    setName(c.name);
    setHandle(c.handle);
    setChannelUrl(c.channelUrl);
    setAvatarUrl(c.avatarUrl);
    setSubscribers(c.subscriberCount);
    setViews(c.viewCount);
    setCategory(c.category);
    setIsFeatured(c.isFeatured);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCreator) {
      updateCreator(editingCreator.id, {
        name,
        handle,
        channelUrl,
        avatarUrl,
        subscriberCount: subscribers,
        viewCount: views,
        category,
        isFeatured,
      });
    } else {
      addCreator({
        name,
        handle,
        channelUrl,
        avatarUrl,
        subscriberCount: subscribers,
        viewCount: views,
        category,
        isFeatured,
        isPublic: true,
        displayOrder: creators.length + 1,
      });
    }

    setShowModal(false);
  };

  const toggleVisibility = (id: string, current: boolean) => {
    updateCreator(id, { isPublic: !current });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
            Partnership CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Creator Partnerships
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Control the creator showcase presented on the public homepage and /creators directory.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Creator Partner
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {creators.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all space-y-4"
          >
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20 mx-auto"
                />
                {c.isFeatured && (
                  <span className="absolute bottom-0 right-0 p-1 rounded-full bg-amber-400 text-black">
                    <Sparkles className="w-3 h-3 fill-current" />
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold font-mono text-white">{c.name}</h3>
              <p className="text-xs text-zinc-400 font-mono">{c.handle}</p>
              <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300">
                {c.category}
              </span>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-900 pt-3 text-xs font-mono">
                <div>
                  <span className="block font-bold text-white">{c.subscriberCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Subs</span>
                </div>
                <div>
                  <span className="block font-bold text-white">{c.viewCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Views</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => toggleVisibility(c.id, c.isPublic)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.isPublic ? 'text-emerald-400' : 'text-zinc-600'
                }`}
              >
                {c.isPublic ? 'Public' : 'Hidden'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCreator(c.id)}
                  className="p-1 text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold font-mono uppercase text-white">
                {editingCreator ? 'Edit Creator' : 'Register Creator Partner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Creator Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MythicSaga"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Channel Handle *
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@MythicSaga"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Channel URL *
                </label>
                <input
                  type="url"
                  required
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Subscriber Count
                  </label>
                  <input
                    type="text"
                    value={subscribers}
                    onChange={(e) => setSubscribers(e.target.value)}
                    placeholder="2.4M"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Total View Count
                  </label>
                  <input
                    type="text"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    placeholder="480M"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Save Creator Partner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
