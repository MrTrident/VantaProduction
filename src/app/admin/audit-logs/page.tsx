'use client';

import React, { useState, useEffect } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { ScrollText, Search, Shield, Filter, Loader2 } from 'lucide-react';
import { AuditLog } from '@/types';

export default function AdminAuditLogsPage() {
  const { auditLogs: contextLogs } = useVanta();
  const [logs, setLogs] = useState<AuditLog[]>(contextLogs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.auditLogs && Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
          setLogs(data.auditLogs);
        }
      })
      .catch((err) => console.warn('Audit logs fetch notice:', err))
      .finally(() => setLoading(false));
  }, []);

  const actionTypes = ['all', ...Array.from(new Set(logs.map((l) => l.action)))];

  const filteredLogs = logs.filter((log) => {
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
          Chronological record of all administrative approvals, personnel promotions, role assignments, and CMS updates stored in PostgreSQL.
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

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-400" />
                    <span>Loading immutable audit records from database...</span>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">{log.createdAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 font-bold text-white">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">{log.userName}</td>
                    <td className="py-3 px-4 text-zinc-400">{log.entityType}</td>
                    <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No audit records matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
