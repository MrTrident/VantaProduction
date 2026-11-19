'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVanta } from '@/lib/vanta-context';
import { Palette, CheckCircle2, Save, LayoutGrid, Columns, Layers, ExternalLink } from 'lucide-react';

export default function AppearanceStudioPage() {
  const { currentUser, artistProfiles, updateArtistProfile } = useVanta();

  const artist = artistProfiles.find((a) => a.userId === currentUser?.id);

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(artist?.themeMode || 'dark');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'editorial'>(artist?.layoutMode || 'grid');
  const [isPublic, setIsPublic] = useState<boolean>(artist?.isPublic ?? true);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    updateArtistProfile(currentUser.id, {
      themeMode,
      layoutMode,
      isPublic,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Appearance Studio
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Customize the editorial layout and visual aesthetics of your public portfolio page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Applied!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Appearance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Layout Modes */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            01 // Portfolio Display Layout
          </h3>
          <p className="text-xs text-zinc-400">
            Select how your project cards are arranged across screen sizes:
          </p>

          <div className="space-y-3">
            {[
              {
                id: 'grid',
                title: 'Clean Grid Layout',
                desc: 'Balanced 3-column uniform ratio presentation, ideal for 16:9 YouTube thumbnails.',
                icon: LayoutGrid,
              },
              {
                id: 'masonry',
                title: 'Staggered Masonry',
                desc: 'Dynamic Pinterest-style heights for mixed thumbnails, posters, and vertical art.',
                icon: Columns,
              },
              {
                id: 'editorial',
                title: 'Cinematic Editorial',
                desc: 'Large 2-column magazine layout emphasizing in-depth typography and case studies.',
                icon: Layers,
              },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = layoutMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-white bg-white/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase text-white">{mode.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{mode.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme & Visibility */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-6">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            02 // Color Tone & Privacy
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Background Color Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`py-3 px-4 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                  themeMode === 'dark'
                    ? 'border-white bg-black text-white font-bold'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-black border border-white/40" />
                Vanta Dark Mode
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`py-3 px-4 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                  themeMode === 'light'
                    ? 'border-white bg-zinc-200 text-black font-bold'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white border border-black/40" />
                Editorial Light
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4">
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
              Public Visibility
            </label>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div>
                <p className="text-xs font-bold text-white font-mono">
                  {isPublic ? 'Publicly Visible in Directory' : 'Hidden / Unlisted Portfolio'}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {isPublic
                    ? 'Anyone can view your verified works at /artists/' + currentUser.username
                    : 'Your portfolio is hidden from public artist directory'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  isPublic ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/artists/${currentUser.username}`}
              target="_blank"
              className="w-full py-2.5 rounded-lg border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:border-white transition-colors flex items-center justify-center gap-2"
            >
              Open Live Public Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
