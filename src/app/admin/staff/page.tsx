'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Search, UserCheck, Shield, ArrowUpRight, Crown, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminStaffPage() {
  const { profiles, departments, positions, promoteStaff, transferStaff, updateProfile } = useVanta();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [activeModalUser, setActiveModalUser] = useState<any | null>(null);
  const [targetPositionId, setTargetPositionId] = useState('');
  const [targetDepartmentId, setTargetDepartmentId] = useState('');
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const filteredStaff = profiles.filter((member) => {
    const matchesDept = selectedDept === 'all' || member.departmentId === selectedDept;
    const matchesSearch =
      member.displayName.toLowerCase().includes(search.toLowerCase()) ||
      member.username.toLowerCase().includes(search.toLowerCase()) ||
      (member.positionTitle || '').toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleOpenAction = (member: any) => {
    setActiveModalUser(member);
    setTargetPositionId(member.positionId || '');
    setTargetDepartmentId(member.departmentId || '');
    setModalFeedback(null);
  };

  const handlePromote = () => {
    if (!activeModalUser || !targetPositionId) return;
    const res = promoteStaff(activeModalUser.id, targetPositionId);
    setModalFeedback(res.message);
  };

  const handleTransfer = () => {
    if (!activeModalUser || !targetDepartmentId) return;
    const res = transferStaff(activeModalUser.id, targetDepartmentId);
    setModalFeedback(res.message);
  };

  const handleToggleStatus = (id: string, currentStatus: string, isFounder: boolean) => {
    if (isFounder) {
      alert('CRITICAL SECURITY: The Founder cannot be suspended or deactivated.');
      return;
    }
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateProfile(id, { status: newStatus as any });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-bold block mb-1">
          Personnel Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Staff Directory & Appointments
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Supervise production staff, execute promotions, transfer departments, and enforce reporting lines.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search staff by name or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/40"
          />
        </div>

        {/* Dept Select */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-white/15 rounded-lg text-xs font-mono text-white focus:outline-none"
        >
          <option value="all">All Departments ({profiles.length})</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 text-zinc-400 uppercase text-[10px] border-b border-zinc-900">
              <tr>
                <th className="p-4">Personnel</th>
                <th className="p-4">Position / Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Reporting Manager</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatarUrl}
                        alt={staff.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {staff.displayName}
                          {staff.isFounder && (
                            <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold font-mono">
                              FOUNDER
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-zinc-500">@{staff.username}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                      {staff.positionTitle || 'Staff Member'}
                    </span>
                  </td>

                  <td className="p-4 text-zinc-400">
                    {staff.departmentName || 'General Operations'}
                  </td>

                  <td className="p-4 text-zinc-500">
                    {staff.reportingManagerName || '—'}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        staff.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenAction(staff)}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-white text-white text-[11px] transition-colors"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleToggleStatus(staff.id, staff.status, staff.isFounder)}
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-colors ${
                        staff.status === 'active'
                          ? 'text-zinc-500 hover:text-red-400'
                          : 'text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {staff.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog */}
      {activeModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Manage {activeModalUser.displayName}
              </h3>
              <button
                onClick={() => setActiveModalUser(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {modalFeedback && (
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-amber-300">
                {modalFeedback}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Promote / Demote Position
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetPositionId}
                    onChange={(e) => setTargetPositionId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Level {p.level})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handlePromote}
                    className="px-4 py-2 bg-white text-black font-bold font-mono text-xs uppercase rounded-lg hover:bg-zinc-200"
                  >
                    Apply Title
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Transfer Department
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetDepartmentId}
                    onChange={(e) => setTargetDepartmentId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleTransfer}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase rounded-lg hover:border-white"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
