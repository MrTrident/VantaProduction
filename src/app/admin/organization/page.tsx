'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { OrgChart } from '@/components/org-chart';
import { Profile, OrganizationalPosition } from '@/types';
import {
  GitBranch,
  Crown,
  Shield,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminOrganizationPage() {
  const {
    profiles,
    departments,
    positions,
    addPosition,
    promoteStaff,
    transferStaff,
    updateProfile,
    isFounder,
  } = useVanta();

  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [showNewPositionModal, setShowNewPositionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState(7);
  const [newDeptId, setNewDeptId] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Promote / Transfer state for selectedMember
  const [targetPositionId, setTargetPositionId] = useState('');
  const [targetDepartmentId, setTargetDepartmentId] = useState('');
  const [targetManagerId, setTargetManagerId] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleMemberClick = (member: Profile) => {
    setSelectedMember(member);
    setTargetPositionId(member.positionId || '');
    setTargetDepartmentId(member.departmentId || '');
    setTargetManagerId(member.reportingManagerId || '');
    setActionFeedback(null);
  };

  const handleExecutePromotion = () => {
    if (!selectedMember || !targetPositionId) return;
    const res = promoteStaff(selectedMember.id, targetPositionId, 'Updated via visual hierarchy manager');
    setActionFeedback(res);
  };

  const handleExecuteTransfer = () => {
    if (!selectedMember || !targetDepartmentId) return;
    const res = transferStaff(selectedMember.id, targetDepartmentId, 'Department transfer executed');
    setActionFeedback(res);
  };

  const handleAssignManager = () => {
    if (!selectedMember) return;
    const manager = profiles.find((p) => p.id === targetManagerId);
    updateProfile(selectedMember.id, {
      reportingManagerId: targetManagerId || undefined,
      reportingManagerName: manager ? `${manager.displayName}` : undefined,
    });
    setActionFeedback({ success: true, message: 'Reporting manager updated successfully.' });
  };

  const handleCreatePosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addPosition({
      title: newTitle.trim(),
      level: Number(newLevel),
      departmentId: newDeptId || undefined,
      departmentName: departments.find((d) => d.id === newDeptId)?.name,
      isDefault: false,
      description: newDesc.trim(),
    });

    setNewTitle('');
    setNewDesc('');
    setShowNewPositionModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Hierarchy Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Organizational Structure & Hierarchy
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Interactive visual network tree, reporting line configuration, and custom position architecture.
          </p>
        </div>

        <button
          onClick={() => setShowNewPositionModal(true)}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Custom Position
        </button>
      </div>

      {/* Visual Chart */}
      <div className="p-6 sm:p-10 rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400" /> Interactive Hierarchy Tree
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            Click on any personnel card to manage position or reporting manager
          </span>
        </div>

        <OrgChart onSelectMember={handleMemberClick} />
      </div>

      {/* Selected Member Hierarchy Controller Drawer / Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Member Profile */}
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
              <img
                src={selectedMember.avatarUrl}
                alt={selectedMember.displayName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h3 className="text-lg font-bold font-mono uppercase text-white flex items-center gap-2">
                  {selectedMember.displayName}
                  {selectedMember.isFounder && (
                    <span className="text-[10px] font-mono font-bold bg-amber-400 text-black px-2 py-0.5 rounded">
                      FOUNDER
                    </span>
                  )}
                </h3>
                <p className="text-xs font-mono text-zinc-400">@{selectedMember.username}</p>
                <p className="text-[11px] font-mono text-amber-300 mt-0.5">
                  Current: {selectedMember.positionTitle} • {selectedMember.departmentName}
                </p>
              </div>
            </div>

            {actionFeedback && (
              <div
                className={`p-3 rounded-lg text-xs font-mono ${
                  actionFeedback.success
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {actionFeedback.message}
              </div>
            )}

            {/* Actions Form */}
            <div className="space-y-4">
              {/* Promotion / Position Change */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Appoint Organizational Position (Level)
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetPositionId}
                    onChange={(e) => setTargetPositionId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Level {p.level})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleExecutePromotion}
                    className="px-4 py-2 bg-white text-black font-bold font-mono text-xs uppercase rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Promote
                  </button>
                </div>
              </div>

              {/* Department Transfer */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Department Assignment
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetDepartmentId}
                    onChange={(e) => setTargetDepartmentId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleExecuteTransfer}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase rounded-lg hover:border-white transition-colors"
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* Reporting Manager */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Assign Reporting Manager
                </label>
                <div className="flex gap-2">
                  <select
                    value={targetManagerId}
                    onChange={(e) => setTargetManagerId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="">No Direct Reporting Manager</option>
                    {profiles
                      .filter((p) => p.id !== selectedMember.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.displayName} ({p.positionTitle})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleAssignManager}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase rounded-lg hover:border-white transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>

            {selectedMember.isFounder && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                <Crown className="w-3.5 h-3.5 inline mr-1" />
                CRITICAL IMMUTABILITY: The Founder account cannot be demoted or removed by any platform role.
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Position Creation Modal */}
      {showNewPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <button
              onClick={() => setShowNewPositionModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-mono uppercase text-white">
              Create Custom Position
            </h3>
            <p className="text-xs text-zinc-400">
              Add a specialized title to Vanta&apos;s organizational hierarchy (e.g. Head of Thumbnail Design, Senior VFX Lead).
            </p>

            <form onSubmit={handleCreatePosition} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Thumbnail Stylist"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Hierarchy Level (1-15) *
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    required
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Target Department
                  </label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="">Cross-Departmental</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Role Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Responsibilities and expected deliverables..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Register Organizational Position
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
