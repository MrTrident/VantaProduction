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
  Sparkles,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isAdmin, logout } = useVanta();

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
    <div className="min-h-screen bg-[#070709] text-[#f4f4f6] flex flex-col md:flex-row selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-white/10 bg-[#050505]/95 backdrop-blur-2xl flex flex-col justify-between p-6 shrink-0 shadow-2xl">
        <div className="space-y-6">
          <div className="pb-5 border-b border-white/10">
            <VantaLogo size="sm" />
            <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                Artist Workspace
              </span>
            </div>
          </div>

          {/* User Badge */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/15 backdrop-blur-xl flex items-center gap-3.5 shadow-md">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate font-mono">{currentUser.displayName}</p>
                <p className="text-xs text-zinc-400 font-mono truncate">@{currentUser.username}</p>
                <span className="text-[11px] font-mono text-amber-300/90 block truncate font-medium">
                  {currentUser.positionTitle || 'Artist'}
                </span>
              </div>
            </div>
          )}

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.02]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/90'
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
        <div className="pt-6 border-t border-white/10 space-y-2">
          {currentUser && (
            <Link
              href={`/artists/${currentUser.username}`}
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors border border-transparent hover:border-white/10"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all font-semibold"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Platform</span>
            </Link>
          )}

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-30 h-20 border-b border-white/10 bg-[#070709]/80 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">VANTA</Link>
            <span>/</span>
            <span className="text-white font-semibold">ARTISTS HUB</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/upload"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              + Submit Work
            </Link>
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
