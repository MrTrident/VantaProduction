'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { VantaLogo } from '@/components/vanta-logo';
import { useVanta } from '@/lib/vanta-context';
import {
  Menu,
  X,
  Shield,
  Palette,
  ChevronDown,
  LogOut,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, isFounder, isAdmin, logout } = useVanta();
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <VantaLogo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white font-semibold bg-white/15 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & User State */}
        <div className="hidden lg:flex items-center gap-3.5">
          <Link
            href="/apply"
            className="text-xs uppercase font-mono tracking-wider px-5 py-2.5 rounded-xl border border-white/20 text-zinc-200 hover:text-white hover:border-white/60 bg-white/5 hover:bg-white/10 transition-all shadow-sm"
          >
            Join Vanta
          </Link>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/20 hover:border-white/50 transition-all text-xs"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-white/30"
                />
                <div className="text-left">
                  <span className="font-bold text-white max-w-[110px] truncate block text-xs">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    {currentUser.positionTitle || 'Member'}
                  </span>
                </div>
                {currentUser.isFounder && (
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-amber-400/30">
                    FOUNDER
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-zinc-950/95 border border-white/20 shadow-2xl p-3 z-50 backdrop-blur-2xl text-white"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-3 border-b border-white/10 mb-2 bg-white/[0.02] rounded-xl">
                      <p className="text-sm font-bold text-white font-mono">{currentUser.displayName}</p>
                      <p className="text-xs text-zinc-400">@{currentUser.username}</p>
                      <p className="text-[11px] font-mono text-amber-300/80 mt-1">
                        {currentUser.positionTitle || 'Staff'} • {currentUser.departmentName || 'General'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl font-medium transition-colors"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          Admin Platform
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-400" />
                        Artist Workspace
                      </Link>

                      <Link
                        href={`/artists/${currentUser.username}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl font-medium transition-colors"
                      >
                        <Palette className="w-4 h-4 text-purple-400" />
                        My Public Portfolio
                      </Link>
                    </div>

                    <div className="border-t border-white/10 my-2" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl transition-colors font-mono"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs uppercase font-mono font-bold tracking-wider px-6 py-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-5 py-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
                    pathname === link.href ? 'bg-white text-black font-bold' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 rounded-xl border border-white/20 text-white text-xs font-mono font-semibold uppercase tracking-wider"
              >
                Join Vanta Network
              </Link>

              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/10">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.displayName}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{currentUser.displayName}</p>
                      <p className="text-xs text-zinc-400">{currentUser.positionTitle}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-medium"
                  >
                    Artist Workspace
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-center py-2 text-xs text-red-400 font-mono"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 px-4 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
