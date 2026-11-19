'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserById, profiles } = useVanta();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
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

  const handleQuickLogin = (userId: string, targetPath: string) => {
    setCurrentUserById(userId);
    router.push(targetPath);
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
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="smiiko@vantaproduction.com"
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
              className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In Securely
            </button>
          </form>

          {/* Quick Access Demo Accounts */}
          <div className="border-t border-zinc-900 pt-5 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold text-center">
              Quick Role Testing Logins
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('u-smiiko', '/admin')}
                className="w-full text-left p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Smiiko (Founder)
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">Supreme Admin Authority (Level 1)</p>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-semibold">Enter Admin →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('u-neon', '/admin')}
                className="w-full text-left p-2.5 rounded-lg border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-400" /> Neon The Dev
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">Executive Director (Level 3)</p>
                </div>
                <span className="text-[10px] font-mono text-blue-300 font-semibold">Enter Admin →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('u-mrtrident', '/dashboard')}
                className="w-full text-left p-2.5 rounded-lg border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> MrTrident
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">Head of Thumbnail Design (Artist Hub)</p>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-semibold">Enter Hub →</span>
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
