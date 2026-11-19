'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Settings, Lock, Shield, CheckCircle2 } from 'lucide-react';

export default function DashboardSettingsPage() {
  const { currentUser } = useVanta();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!currentUser) return null;

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-zinc-900">
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Account & Security Settings
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Manage your authentication credentials, session security, and access keys.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Details Readonly */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            01 // Account Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 uppercase block text-[10px]">User ID</span>
              <span className="text-white font-bold">{currentUser.id}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 uppercase block text-[10px]">Registered Email</span>
              <span className="text-white font-bold">{currentUser.email}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 uppercase block text-[10px]">Organizational Position</span>
              <span className="text-amber-400 font-bold">{currentUser.positionTitle || 'Artist'}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-500 uppercase block text-[10px]">Assigned Department</span>
              <span className="text-blue-400 font-bold">{currentUser.departmentName || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider">
              02 // Security & Password
            </h3>
            {passwordSaved && (
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Password Updated!
              </span>
            )}
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                New Security Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
