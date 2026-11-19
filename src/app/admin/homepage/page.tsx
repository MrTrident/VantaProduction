'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { LayoutTemplate, Sparkles, CheckCircle2, Save, Sliders, Eye } from 'lucide-react';

export default function AdminHomepageCMSPage() {
  const { homepageConfig, updateHomepageConfig, portfolioItems } = useVanta();

  const [headline, setHeadline] = useState(homepageConfig.heroHeadline);
  const [subheading, setSubheading] = useState(homepageConfig.heroSubheading);
  const [enableFloating, setEnableFloating] = useState(homepageConfig.enableFloatingArtwork);
  const [floatingSpeed, setFloatingSpeed] = useState(homepageConfig.floatingSpeed);
  const [floatingIntensity, setFloatingIntensity] = useState(homepageConfig.floatingIntensity);
  const [floatingCount, setFloatingCount] = useState(homepageConfig.floatingCount);
  const [floatingOpacity, setFloatingOpacity] = useState(homepageConfig.floatingOpacity);
  const [sections, setSections] = useState(homepageConfig.sectionsVisibility);
  const [saved, setSaved] = useState(false);

  const heroArtworkCount = portfolioItems.filter((i) => i.isFloatingHero && i.status === 'approved').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageConfig({
      heroHeadline: headline,
      heroSubheading: subheading,
      enableFloatingArtwork: enableFloating,
      floatingSpeed,
      floatingIntensity,
      floatingCount,
      floatingOpacity,
      sectionsVisibility: sections,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Dynamic Website CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Homepage Content Management
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Control headlines, hero floating artwork physics, and section visibility without code changes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save CMS Changes
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Homepage configuration updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section Copy */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            01 // Cinematic Hero Headline & Subtitle
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Primary Hero Headline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="CREATIVITY. BUILT TOGETHER."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Hero Supporting Subtitle *
              </label>
              <textarea
                rows={2}
                required
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="An independent creative production network..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>
          </div>
        </div>

        {/* Floating Artwork System Physics & Controls */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> 02 // Floating Artwork Parallax Engine
            </h3>
            <span className="text-[10px] font-mono text-amber-300">
              {heroArtworkCount} Approved Pieces Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white font-mono">Enable Floating Artwork System</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Renders real approved portfolio artwork floating dynamically with 3D cursor parallax.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnableFloating(!enableFloating)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                enableFloating ? 'bg-amber-400 justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black shadow-md" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Mouse Parallax Intensity:</span>
                <span className="text-white font-bold">{floatingIntensity}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={floatingIntensity}
                onChange={(e) => setFloatingIntensity(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Max Artwork Cards on Screen:</span>
                <span className="text-white font-bold">{floatingCount} cards</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={floatingCount}
                onChange={(e) => setFloatingCount(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Floating Card Opacity:</span>
                <span className="text-white font-bold">{Math.round(floatingOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={floatingOpacity}
                onChange={(e) => setFloatingOpacity(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>

        {/* Section Toggles */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            03 // Public Sections Visibility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(sections).map((key) => {
              const isEnabled = sections[key as keyof typeof sections];
              return (
                <div
                  key={key}
                  onClick={() => toggleSection(key as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-mono uppercase ${
                    isEnabled
                      ? 'border-white bg-white/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-500'
                  }`}
                >
                  <span>{key} section</span>
                  <span className={`text-[10px] ${isEnabled ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {isEnabled ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
        >
          Publish Changes to Live Homepage
        </button>
      </form>
    </div>
  );
}
