'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Profile } from '@/types';
import { Shield, Users, ChevronRight, GitBranch, Crown } from 'lucide-react';

export const OrgChart: React.FC<{ onSelectMember?: (member: Profile) => void }> = ({
  onSelectMember,
}) => {
  const { profiles, departments, positions } = useVanta();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  // Filter profiles based on department if selected
  const filteredProfiles = selectedDeptId === 'all'
    ? profiles
    : profiles.filter(p => p.departmentId === selectedDeptId);

  // Group by level / position tier
  const founder = profiles.find(p => p.isFounder);
  const executives = profiles.filter(p => !p.isFounder && (p.positionTitle?.includes('Executive') || p.positionTitle?.includes('Co-Founder') || p.positionTitle?.includes('Head Manager')));
  const departmentHeads = profiles.filter(p => p.positionTitle?.includes('Department Head') || p.positionTitle?.includes('Senior Manager'));
  const staffAndArtists = profiles.filter(p => !p.isFounder && !executives.includes(p) && !departmentHeads.includes(p));

  return (
    <div className="w-full space-y-8">
      {/* Department Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-900">
        <button
          onClick={() => setSelectedDeptId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            selectedDeptId === 'all'
              ? 'bg-white text-black font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          All Divisions ({profiles.length})
        </button>
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              selectedDeptId === dept.id
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Visual Hierarchy Tiers */}
      <div className="flex flex-col items-center space-y-12 py-6">
        {/* Tier 1: Founder */}
        {founder && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-2 flex items-center gap-1 font-bold">
              <Crown className="w-3.5 h-3.5 fill-current" /> Supreme Authority (Level 1)
            </span>
            <div
              onClick={() => onSelectMember?.(founder)}
              className="group relative cursor-pointer w-72 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-400 transition-all text-center"
            >
              <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-3 shadow-lg">
                <img src={founder.avatarUrl} alt={founder.displayName} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">{founder.displayName}</h4>
              <p className="text-xs text-amber-300 font-mono font-semibold">@{founder.username}</p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-200">
                Founder & Creative Director
              </div>
              <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2">{founder.bio}</p>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-px h-10 bg-gradient-to-b from-amber-500/50 to-zinc-700" />
          </div>
        )}

        {/* Tier 2: Executive Leadership */}
        {executives.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 mb-4 flex items-center gap-1 font-bold">
              <Shield className="w-3.5 h-3.5" /> Executive Tier (Level 2 - 4)
            </span>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
              {executives.map(exec => (
                <div
                  key={exec.id}
                  onClick={() => onSelectMember?.(exec)}
                  className="cursor-pointer w-64 rounded-xl border border-blue-500/30 bg-zinc-950 p-4 shadow-xl hover:border-blue-400/60 transition-all text-center"
                >
                  <img src={exec.avatarUrl} alt={exec.displayName} className="mx-auto w-12 h-12 rounded-full object-cover border border-blue-400 mb-2" />
                  <h5 className="text-sm font-bold text-white font-mono uppercase">{exec.displayName}</h5>
                  <p className="text-[11px] text-blue-300 font-mono">@{exec.username}</p>
                  <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded bg-blue-500/10 text-[10px] font-mono text-blue-300 border border-blue-500/20">
                    {exec.positionTitle}
                  </span>
                  <p className="mt-1 text-[10px] text-zinc-500">{exec.departmentName}</p>
                </div>
              ))}
            </div>

            <div className="w-px h-10 bg-zinc-800" />
          </div>
        )}

        {/* Tier 3: Department Heads & Senior Managers */}
        {departmentHeads.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-400 mb-4 flex items-center gap-1 font-bold">
              <GitBranch className="w-3.5 h-3.5" /> Department Leadership (Level 5 - 7)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full">
              {departmentHeads.map(head => (
                <div
                  key={head.id}
                  onClick={() => onSelectMember?.(head)}
                  className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={head.avatarUrl} alt={head.displayName} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                    <div>
                      <h6 className="text-xs font-bold text-white font-mono">{head.displayName}</h6>
                      <p className="text-[10px] text-zinc-400 font-mono">@{head.username}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-purple-300 font-semibold block">
                      {head.positionTitle}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 block truncate">
                      {head.departmentName}
                    </span>
                  </div>
                  {head.reportingManagerName && (
                    <p className="mt-2 text-[9px] text-zinc-600 font-mono border-t border-zinc-900 pt-1.5">
                      Reports to: {head.reportingManagerName}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="w-px h-10 bg-zinc-800" />
          </div>
        )}

        {/* Tier 4: Creative Roster & Staff */}
        {staffAndArtists.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-1 font-bold">
              <Users className="w-3.5 h-3.5" /> Creative Artists & Production Specialists
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
              {staffAndArtists.map(artist => (
                <div
                  key={artist.id}
                  onClick={() => onSelectMember?.(artist)}
                  className="cursor-pointer rounded-xl border border-zinc-800/80 bg-zinc-950 p-3.5 flex items-center justify-between hover:border-zinc-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={artist.avatarUrl} alt={artist.displayName} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div>
                      <p className="text-xs font-bold text-white">{artist.displayName}</p>
                      <p className="text-[10px] font-mono text-zinc-400">@{artist.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded">
                      {artist.positionTitle || 'Artist'}
                    </span>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{artist.departmentName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
