'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Mail, Plus, Copy, CheckCircle2, Shield, Calendar, ArrowRight } from 'lucide-react';

export default function AdminInvitationsPage() {
  const { invitations, createInvitation, departments, positions, roles } = useVanta();

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [positionId, setPositionId] = useState(positions[13]?.id || '');
  const [departmentId, setDepartmentId] = useState(departments[1]?.id || '');
  const [roleId, setRoleId] = useState(roles[roles.length - 1]?.id || '');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !username.trim()) return;

    createInvitation({
      email: email.trim(),
      username: username.trim(),
      positionId: positionId || undefined,
      departmentId: departmentId || undefined,
      roleId: roleId || undefined,
    });

    setEmail('');
    setUsername('');
    setShowModal(false);
  };

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/invite/accept?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Access Provisioning
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Staff & Artist Invitations
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Generate cryptographically secure onboarding tokens with pre-configured titles and permissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue New Invitation
        </button>
      </div>

      {/* Invitations Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 text-zinc-400 uppercase text-[10px] border-b border-zinc-900">
              <tr>
                <th className="p-4">Recipient</th>
                <th className="p-4">Target Position</th>
                <th className="p-4">Target Department</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invitation Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">@{inv.username}</p>
                    <p className="text-[10px] text-zinc-500">{inv.email}</p>
                  </td>

                  <td className="p-4 text-amber-300">
                    {inv.positionTitle || 'Artist'}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {inv.departmentName || 'General'}
                  </td>

                  <td className="p-4 text-zinc-500">
                    {inv.expiresAt.substring(0, 10)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        inv.status === 'accepted'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {inv.status === 'pending' ? (
                      <button
                        onClick={() => copyInviteLink(inv.token)}
                        className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-white text-white text-[10px] font-mono uppercase inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copiedToken === inv.token ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied Link
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Link
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-mono">Claimed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold font-mono uppercase text-white">
                Issue Direct Invitation
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvitation} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@example.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Assigned Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. smiikogod"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Organizational Position
                </label>
                <select
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                >
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Level {p.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Assigned Department
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Generate Secure Token
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
