'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, KeyRound } from 'lucide-react';

function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';
  const { invitations, acceptInvitation } = useVanta();

  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check matching invitation
  const currentInv = invitations.find((i) => i.token === token && i.status === 'pending');

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = acceptInvitation(token, password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setError(res.message);
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
            Activate your verified account and establish your credentials.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold font-mono text-white">Account Activated!</h2>
              <p className="text-xs text-zinc-400">
                Welcome to Vanta Production. Redirecting to your Artist Workspace...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Invitation Security Token *
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="inv_xxxxxxxx"
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                    />
                  </div>
                </div>

                {currentInv && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono space-y-1">
                    <p className="text-white font-bold">Assigned to: {currentInv.username}</p>
                    <p className="text-zinc-400">Department: {currentInv.departmentName || 'General'}</p>
                    <p className="text-zinc-400">Position: {currentInv.positionTitle || 'Artist'}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Create Password *
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

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Establish Account & Enter Platform
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center text-xs text-zinc-500 font-mono">
          <Link href="/login" className="hover:text-white underline">
            Already have an active account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Loading invitation...</div>}>
      <InviteAcceptContent />
    </Suspense>
  );
}
