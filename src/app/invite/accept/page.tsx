'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, KeyRound, Loader2 } from 'lucide-react';

function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
  }, [tokenParam]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to accept invitation.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError('Network error while processing invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6] flex flex-col justify-center items-center p-4">
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <VantaLogo size="lg" className="justify-center" />
          <h1 className="text-xl font-black uppercase font-mono tracking-wider text-white pt-2">
            Accept Network Invitation
          </h1>
          <p className="text-xs text-zinc-400">
            Activate your verified creator account and establish your security credentials.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black uppercase font-mono text-white">
                Account Activated
              </h2>
              <p className="text-xs text-zinc-400">
                Your credentials have been securely registered. Redirecting to your Artist Workspace...
              </p>
            </div>
          ) : (
            <form onSubmit={handleAccept} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Invitation Token *
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your 48-character invitation token"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Creator Display Name
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{loading ? 'Activating Account...' : 'Activate & Enter Workspace'}</span>
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="text-xs font-mono text-zinc-500 hover:text-white">
            Already have an active account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>}>
      <InviteAcceptContent />
    </Suspense>
  );
}
