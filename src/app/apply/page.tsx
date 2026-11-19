'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useVanta } from '@/lib/vanta-context';
import { Sparkles, CheckCircle2, ArrowRight, Send, AlertCircle } from 'lucide-react';

export default function ApplyPage() {
  const { submitApplication } = useVanta();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    discordTag: '',
    services: [] as string[],
    experience: '',
    portfolioLinks: '',
    twitter: '',
    introduction: '',
  });

  const availableServices = [
    'Thumbnail Design',
    'Video Editing',
    'Motion Graphics & 3D',
    'Graphic Design & Branding',
    'Minecraft Plugin Development',
    'Web & Tooling Development',
  ];

  const toggleService = (srv: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(srv)
        ? prev.services.filter((s) => s !== srv)
        : [...prev.services, srv],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert('Please select at least one service offered.');
      return;
    }

    const links = formData.portfolioLinks
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    submitApplication({
      displayName: formData.displayName,
      username: formData.username.toLowerCase().replace(/\s+/g, ''),
      email: formData.email,
      discordTag: formData.discordTag,
      services: formData.services,
      experience: formData.experience,
      portfolioLinks: links.length > 0 ? links : ['https://behance.net'],
      socialLinks: { twitter: formData.twitter },
      introduction: formData.introduction,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 block mb-2 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Artist Recruitment
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-mono tracking-tight text-white">
            Join Vanta Production
          </h1>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            We are an invite-only creative production network. Complete this application with your best real-world work. Applications are vetted directly by department heads.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 rounded-2xl border border-emerald-500/30 bg-zinc-950 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black uppercase font-mono text-white">
              Application Submitted
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your application for <span className="text-white font-mono font-bold">@{formData.username}</span> has been securely entered into our recruitment queue. If approved, you will receive a secure onboarding invitation token.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/work"
                className="px-6 py-2.5 rounded-lg border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:border-white transition-colors"
              >
                Explore Selected Work
              </Link>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-zinc-950 p-8 sm:p-12 shadow-2xl space-y-8"
          >
            {/* Personal Identifiers */}
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white border-b border-zinc-900 pb-2 mb-4">
                01 // Identity & Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Smiiko"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Requested Username (Handle) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. smiikogod"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Discord Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.discordTag}
                    onChange={(e) => setFormData({ ...formData, discordTag: e.target.value })}
                    placeholder="username or username#0000"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white border-b border-zinc-900 pb-2 mb-4">
                02 // Specialization & Services
              </h3>
              <p className="text-xs text-zinc-400 mb-3">
                Select all disciplines you produce at an elite professional level:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableServices.map((srv) => {
                  const isSelected = formData.services.includes(srv);
                  return (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`text-left px-4 py-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-white bg-white/10 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span>{srv}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience & Portfolio */}
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white border-b border-zinc-900 pb-2 mb-4">
                03 // Proof of Work & Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Portfolio Links (Behance, ArtStation, YouTube playlist, GitHub, etc.) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.portfolioLinks}
                    onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                    placeholder="https://behance.net/yourprofile&#10;https://youtube.com/playlist?list=...&#10;https://artstation.com/..."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Professional Experience & Software Proficiency *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Tell us how many years you've worked in production, software you master (Blender, Premiere, Octane, Java, etc.), and prominent channels or clients you've collaborated with."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Why Vanta Production?
                  </label>
                  <textarea
                    rows={2}
                    value={formData.introduction}
                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                    placeholder="What drives your creative ambition? Why do you want to join our network?"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-2xl"
            >
              <Send className="w-4 h-4" /> Submit Application for Department Review
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
