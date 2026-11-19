'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import {
  Menu,
  X,
  Shield,
  Palette,
  User,
  ChevronDown,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, isFounder, isAdmin, isArtist, setCurrentUserById, logout, profiles } = useVanta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Work', href: '/work' },
    { name: 'Artists', href: '/artists' },
    { name: 'Creators', href: '/creators' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <VantaLogo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-wider transition-colors duration-200 ${
                  isActive
                    ? 'text-white border-b-2 border-white pb-1 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & User State */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/apply"
            className="text-xs uppercase tracking-widest px-4 py-2 border border-white/20 text-zinc-300 hover:text-white hover:border-white rounded transition-colors"
          >
            Join Vanta
          </Link>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/15 hover:border-white/40 transition-all text-xs"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
                <span className="font-medium text-white max-w-[100px] truncate">
                  {currentUser.displayName}
                </span>
                {currentUser.isFounder && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    FOUNDER
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-lg bg-zinc-950 border border-zinc-800 shadow-2xl p-2 z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                    <p className="text-xs font-semibold text-white">{currentUser.displayName}</p>
                    <p className="text-[11px] text-zinc-400">@{currentUser.username}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {currentUser.positionTitle || 'Staff'} • {currentUser.departmentName || 'General'}
                    </p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 rounded font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 rounded font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Artist Workspace
                  </Link>

                  <Link
                    href={`/artists/${currentUser.username}`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 rounded font-medium"
                  >
                    <Palette className="w-4 h-4 text-purple-400" />
                    My Public Portfolio
                  </Link>

                  {/* Switch User Session (For Testing Roles) */}
                  <div className="border-t border-zinc-800 mt-2 pt-2">
                    <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Quick Role Switcher
                    </p>
                    {profiles.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentUserById(p.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[11px] rounded flex items-center justify-between ${
                          currentUser.id === p.id
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                      >
                        <span>{p.displayName}</span>
                        <span className="text-[9px] text-zinc-500">{p.positionTitle}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs uppercase tracking-widest px-4 py-2 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-white/20 text-white font-mono"
            >
              {isAdmin ? "Admin" : "Hub"}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#050505] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-zinc-300 hover:text-white font-medium py-1"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-amber-400 font-medium py-1"
            >
              Join Vanta (Apply)
            </Link>
          </nav>

          <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{currentUser.displayName}</p>
                    <p className="text-xs text-zinc-400">{currentUser.positionTitle}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-4 rounded bg-zinc-900 border border-zinc-700 text-white text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 rounded bg-zinc-900 border border-zinc-700 text-white text-sm font-medium"
                >
                  Artist Workspace
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center py-2 text-sm text-red-400 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 px-4 rounded bg-white text-black text-sm font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
