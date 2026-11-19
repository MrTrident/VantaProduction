'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { OrgChart } from '@/components/org-chart';
import { Shield, Sparkles, Target, Flame, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Manifest & Network
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase font-mono tracking-tight text-white leading-none">
            About Vanta Production
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Vanta Production was founded on a singular conviction: the era of generic freelance marketplaces and uninspired agency templates is over. Modern content creators need a private, specialized production network that operates with military precision, artistic obsession, and deep technical mastery.
          </p>
        </div>

        {/* Pillars / Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono uppercase text-white">
              Retention Engineering
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We design every thumbnail, title pairing, and edit cut through the lens of audience psychology. We treat CTR and APV as non-negotiable metrics.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono uppercase text-white">
              Invite-Only Collective
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every artist in the Vanta roster is vetted for technical caliber, delivery discipline, and original artistic voice. Zero AI slop, zero template reuse.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono uppercase text-white">
              Full-Stack Capabilities
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              From 3D Blender modeling to Cinema4D motion graphics, complex documentary editing, and custom Paper Minecraft plugins, we cover the full creator spectrum.
            </p>
          </div>
        </div>

        {/* Leadership & Organizational Structure */}
        <section className="mb-24 border-t border-zinc-900 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-2 font-semibold">
              Governance & Structure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-mono text-white">
              Organizational Hierarchy
            </h2>
            <p className="mt-3 text-xs text-zinc-400">
              Vanta operates with dedicated department leads, senior production supervisors, and artist teams managed through our central platform.
            </p>
          </div>

          {/* Embedded Interactive Org Chart */}
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950/60 shadow-2xl">
            <OrgChart />
          </div>
        </section>

        {/* Join CTA */}
        <div className="text-center py-16 border-t border-zinc-900">
          <h3 className="text-2xl font-black uppercase font-mono text-white">
            Think You Belong In Vanta?
          </h3>
          <p className="mt-2 text-xs text-zinc-400 max-w-md mx-auto">
            We are always scouting exceptional thumbnail artists, editors, and technical creators.
          </p>
          <Link
            href="/apply"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
          >
            Apply to Join the Network <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
