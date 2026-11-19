'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useVanta } from '@/lib/vanta-context';
import { ExternalLink, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function CreatorsPage() {
  const { creators } = useVanta();
  const publicCreators = creators.filter((c) => c.isPublic);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Creator Alliances
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-mono tracking-tight text-white">
            Creators We Work With
          </h1>
          <p className="mt-4 text-base text-zinc-400">
            Vanta Production partners directly with leading content creators, streamers, and media companies to engineer high-CTR packaging, cinematic retention edits, and immersive Minecraft events.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {publicCreators.map((creator) => (
            <div
              key={creator.id}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/10 bg-zinc-950 hover:border-white/30 transition-all hover:shadow-2xl"
            >
              <div className="relative mb-5">
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/20 group-hover:scale-105 transition-transform"
                />
                {creator.isFeatured && (
                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white font-mono">{creator.name}</h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{creator.handle}</p>
              
              <span className="mt-3 text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                {creator.category}
              </span>

              {/* Stats Box */}
              <div className="mt-6 grid grid-cols-2 gap-4 w-full border-t border-zinc-900 pt-5 text-xs font-mono">
                <div>
                  <span className="block text-sm font-black text-white">{creator.subscriberCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Subscribers</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-white">{creator.viewCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Views</span>
                </div>
              </div>

              <a
                href={creator.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full py-2.5 rounded-lg border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-1.5"
              >
                Visit Channel <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Creator Onboarding Callout */}
        <div className="mt-20 p-10 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black uppercase font-mono text-white">
              Are you an established digital creator?
            </h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Elevate your click-through rate, retention curves, and visual brand identity with a dedicated production pipeline.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 px-8 py-3.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            Commission Vanta <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
