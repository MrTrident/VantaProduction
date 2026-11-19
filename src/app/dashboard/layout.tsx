'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  UserCheck,
  Palette,
  Bell,
  Settings,
  Shield,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isFounder, isAdmin, logout } = useVanta();

  const navItems = [
    { name: 'Hub Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Portfolio', href: '/dashboard/portfolio', icon: FolderKanban },
    { name: 'Submit Artwork', href: '/dashboard/upload', icon: UploadCloud },
    { name: 'Artist Profile', href: '/dashboard/profile', icon: UserCheck },
    { name: 'Appearance Studio', href: '/dashboard/appearance', icon: Palette },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4f4f6] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-[#050505] flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-6">
          <div className="pb-4 border-b border-zinc-900">
            <VantaLogo size="sm" />
            <span className="mt-2 block text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Artist Workspace
            </span>
          </div>

          {/* User Badge */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                <p className="text-[10px] text-zinc-400 font-mono truncate">@{currentUser.username}</p>
                <span className="text-[9px] font-mono text-amber-400 block truncate">
                  {currentUser.positionTitle || 'Artist'}
                </span>
              </div>
            </div>
          )}

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-900 space-y-2">
          {currentUser && (
            <Link
              href={`/artists/${currentUser.username}`}
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#070709]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white">VANTA</Link>
            <span>/</span>
            <span className="text-white">ARTISTS HUB</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/upload"
              className="px-4 py-1.5 rounded-lg bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              + Submit Work
            </Link>
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
