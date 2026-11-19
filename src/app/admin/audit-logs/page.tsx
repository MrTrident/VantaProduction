'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { ScrollText, Search, Shield, Filter } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useVanta();
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  const actionTypes = ['all', ...Array.from(new Set(auditLogs.map((l) => l.action)))];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
          Immutable Security Trail
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          System Audit Logs
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Chronological record of all administrative approvals, personnel promotions, role assignments, and CMS updates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by actor or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/40"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white focus:outline-none"
        >
          {actionTypes.map((act) => (
            <option key={act} value={act}>
              {act === 'all' ? 'All Event Types' : act}
            </option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 text-zinc-400 uppercase text-[10px] border-b border-zinc-900">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Event Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 text-zinc-500 whitespace-nowrap">
                    {log.createdAt}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="p-4 text-zinc-400">
                    {log.entityType}
                  </td>
                  <td className="p-4 text-[11px] text-zinc-400 max-w-md truncate font-mono">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
