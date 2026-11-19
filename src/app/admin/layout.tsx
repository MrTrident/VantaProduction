'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import {
  Shield,
  Users,
  Briefcase,
  GitBranch,
  Layers,
  KeyRound,
  FileCheck,
  Mail,
  FolderKanban,
  Video,
  Settings,
  Sparkles,
  LayoutTemplate,
  Bell,
  BarChart3,
  ScrollText,
  UserCheck,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Crown,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isFounder, isAdmin, logout } = useVanta();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const adminNav = [
    { name: 'Executive Overview', href: '/admin', icon: BarChart3 },
    { name: 'Organization Chart', href: '/admin/organization', icon: GitBranch },
    { name: 'Staff Management', href: '/admin/staff', icon: Briefcase },
    { name: 'Department Control', href: '/admin/departments', icon: Layers },
    { name: 'Custom Role Builder', href: '/admin/roles', icon: KeyRound },
    { name: 'Permission Matrix', href: '/admin/permissions', icon: Shield },
    { name: 'Artist Roster', href: '/admin/artists', icon: UserCheck },
    { name: 'Portfolio Moderation', href: '/admin/portfolio', icon: FolderKanban },
    { name: 'Recruitment (Apply)', href: '/admin/applications', icon: FileCheck },
    { name: 'Staff Invitations', href: '/admin/invitations', icon: Mail },
    { name: 'Production & Tasks', href: '/admin/projects', icon: Sliders },
    { name: 'Creator Partners', href: '/admin/creators', icon: Video },
    { name: 'Services Offerings', href: '/admin/services', icon: Sparkles },
    { name: 'Homepage CMS', href: '/admin/homepage', icon: LayoutTemplate },
    { name: 'Announcements', href: '/admin/notifications', icon: Bell },
    { name: 'Operational Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Immutable Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-[#f4f4f6] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-[#050505] flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-zinc-900 shrink-0">
            <VantaLogo size="sm" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" /> Central Platform
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                v2.4
              </span>
            </div>
          </div>

          {/* Current User Badge */}
          {currentUser && (
            <div className="p-3 mx-4 my-3 rounded-xl bg-zinc-950 border border-amber-500/20 flex items-center gap-2.5 shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover border border-amber-400"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">{currentUser.displayName}</span>
                  {currentUser.isFounder && (
                    <span className="text-[9px] bg-amber-400 text-black px-1 rounded font-bold font-mono">
                      F
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-mono truncate">{currentUser.positionTitle}</p>
              </div>
            </div>
          )}

          {/* Navigation Links (Scrollable) */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Shortcuts */}
          <div className="p-4 border-t border-zinc-900 shrink-0 space-y-2 bg-[#050505]">
            <Link
              href="/dashboard"
              className="flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white px-2 py-1.5 rounded hover:bg-zinc-900"
            >
              <span>Artist Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white px-2 py-1.5 rounded hover:bg-zinc-900"
            >
              <span>Live Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#050505] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <VantaLogo size="sm" />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded bg-zinc-900 text-zinc-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <VantaLogo size="sm" />
            <button onClick={() => setMobileSidebarOpen(false)} className="text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-300 hover:text-white"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
