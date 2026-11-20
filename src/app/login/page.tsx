'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import { Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserById, profiles } = useVanta();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = email.trim().toLowerCase();
    const found = profiles.find(
      (p) => p.email.toLowerCase() === cleanInput || p.username.toLowerCase() === cleanInput
    );
    if (found) {
      setCurrentUserById(found.id);
      if (found.isFounder || found.positionTitle?.includes('Executive') || found.positionTitle?.includes('Head')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid credentials or unregistered account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col justify-center items-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-vanta-radial pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <VantaLogo size="lg" className="justify-center" />
          <h1 className="text-xl font-black uppercase font-mono tracking-wider text-white pt-2">
            Private Authentication Portal
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to access your private Artist Workspace or Administrative Platform.
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Email Address or Username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="smiikogod or sparkygfx"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In Securely
            </button>
          </form>

          {/* Quick 1-Click Access */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 text-center">
              Quick 1-Click Team Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentUserById('u-smiiko');
                  router.push('/admin');
                }}
                className="p-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-left transition-all cursor-pointer flex items-center gap-2.5"
              >
                <img
                  src="/images/vanta-logo.jpg"
                  alt="SmiikoGod"
                  className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
                />
                <div className="min-w-0">
                  <p className="text-xs font-mono font-bold text-white truncate">SmiikoGod</p>
                  <p className="text-[10px] font-mono text-amber-300">Founder Access →</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentUserById('u-sparky');
                  router.push('/dashboard');
                }}
                className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-left transition-all cursor-pointer flex items-center gap-2.5"
              >
                <img
                  src="/images/sparky-pfp.jpg"
                  alt="SparkyGFX"
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0">
                  <p className="text-xs font-mono font-bold text-white truncate">SparkyGFX</p>
                  <p className="text-[10px] font-mono text-zinc-300">Artist Access →</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500 font-mono space-y-2">
          <p>
            Have an onboarding invitation link?{' '}
            <Link href="/invite/accept" className="text-zinc-300 hover:text-white underline">
              Accept Invitation
            </Link>
          </p>
          <p>
            Want to join Vanta?{' '}
            <Link href="/apply" className="text-zinc-300 hover:text-white underline">
              Submit Application
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
