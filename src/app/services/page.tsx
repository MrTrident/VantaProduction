'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useVanta } from '@/lib/vanta-context';
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Palette,
  Code,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function ServicesPage() {
  const { services } = useVanta();
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channelUrl: '',
    service: 'High-CTR Thumbnails',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2 font-semibold">
            Capabilities & Deliverables
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-mono tracking-tight text-white">
            Production Services
          </h1>
          <p className="mt-4 text-base text-zinc-400">
            From high-conversion 3D thumbnails to full-scale YouTube documentary post-production and custom Minecraft event architectures.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-12 mb-24">
          {services.filter((s) => s.isActive).map((srv, idx) => (
            <div
              key={srv.id}
              className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-white/30 transition-all"
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    {srv.iconName === 'Image' && <ImageIcon className="w-5 h-5" />}
                    {srv.iconName === 'Video' && <Video className="w-5 h-5" />}
                    {srv.iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                    {srv.iconName === 'Palette' && <Palette className="w-5 h-5" />}
                    {srv.iconName === 'Code' && <Code className="w-5 h-5" />}
                    {srv.iconName === 'LayoutDashboard' && <LayoutDashboard className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Service // 0{idx + 1}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-wide text-white">
                  {srv.title}
                </h2>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                  {srv.fullDesc}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-zinc-900 pt-5">
                  {srv.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="lg:border-l lg:border-zinc-900 lg:pl-10 shrink-0">
                <a
                  href="#inquiry"
                  onClick={() => setFormData((prev) => ({ ...prev, service: srv.title }))}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors w-full sm:w-auto"
                >
                  Commission This Service <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Inquiry Form */}
        <section id="inquiry" className="max-w-3xl mx-auto rounded-2xl border border-white/15 bg-zinc-950 p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-2 font-semibold">
              Direct Production Request
            </span>
            <h2 className="text-3xl font-black uppercase font-mono text-white">
              Commission Vanta Production
            </h2>
            <p className="mt-2 text-xs text-zinc-400">
              Submit your project specifications. Our management team will evaluate within 24 hours.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold font-mono text-white">Inquiry Received</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Thank you, {formData.name}. Our production coordinator will review your channel and contact you directly at {formData.email}.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="mt-4 text-xs font-mono text-zinc-400 hover:text-white underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Your Name / Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex (VoltPlayz)"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="creator@gmail.com"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Channel / Studio URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.channelUrl}
                    onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Primary Service Needed
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Project Brief & Scope *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Describe your upcoming video concept, upload frequency, target turnaround, or specific design direction..."
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Production Commission
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
