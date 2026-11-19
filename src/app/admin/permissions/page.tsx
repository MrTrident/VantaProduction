'use client';

import React from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Shield, Check, Minus } from 'lucide-react';

export default function AdminPermissionsPage() {
  const { permissions, roles } = useVanta();

  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
          Security Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Permission Matrix & Access Mapping
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Inspect granular privileges granted across the 12 platform permission categories.
        </p>
      </div>

      {/* Permission Table Matrix */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const categoryPerms = permissions.filter((p) => p.category === cat);
          return (
            <div key={cat} className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
              <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  {cat} ({categoryPerms.length} capabilities)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] border-b border-zinc-900">
                    <tr>
                      <th className="p-4 w-1/3">Privilege / Action</th>
                      {roles.map((r) => (
                        <th key={r.id} className="p-4 text-center">
                          {r.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {categoryPerms.map((perm) => (
                      <tr key={perm.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{perm.name}</p>
                          <p className="text-[10px] text-zinc-400">{perm.description}</p>
                        </td>
                        {roles.map((role) => {
                          const hasPerm = role.slug === 'founder' || role.permissionIds.includes(perm.id);
                          return (
                            <td key={role.id} className="p-4 text-center">
                              {hasPerm ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 text-zinc-700">
                                  <Minus className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
