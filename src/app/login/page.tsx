'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import { Lock, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const { setCurrentUser } = useVanta();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
        return;
      }

      setCurrentUser(data.user);

      if (redirectPath && redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else if (data.user.isFounder) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Network or server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              disabled={loading}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
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
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-zinc-500 font-mono">
          Have an onboarding invitation link?{' '}
          <Link href="/invite/accept" className="text-zinc-300 hover:text-white underline">
            Accept Invitation
          </Link>
        </p>
        <p className="text-xs text-zinc-500 font-mono">
          Want to join Vanta?{' '}
          <Link href="/apply" className="text-amber-400 hover:text-amber-300 underline">
            Submit Application
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-vanta-radial pointer-events-none" />
      <Suspense fallback={<div className="text-xs font-mono text-zinc-500">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
