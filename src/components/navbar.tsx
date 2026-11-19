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
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, isFounder, isAdmin, logout, homepageConfig } = useVanta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Exclude Creators if disabled by admin/user preference
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Work', href: '/work' },
    { name: 'Artists', href: '/artists' },
    ...(homepageConfig?.sectionsVisibility?.creators ? [{ name: 'Creators', href: '/creators' }] : []),
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div className="max-w-6xl mx-auto h-16 rounded-full border border-white/[0.12] bg-black/65 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] px-4 sm:px-6 flex items-center justify-between pointer-events-auto transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <VantaLogo size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-mono uppercase tracking-[0.16em] transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white font-bold bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions & User State */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/apply"
            className="text-xs uppercase font-mono tracking-wider px-4 py-2 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] transition-all hover:scale-105 active:scale-95"
          >
            Join Vanta
          </Link>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/20 hover:border-white/50 transition-all text-xs"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
                <span className="font-bold text-white max-w-[90px] truncate block text-xs font-mono">
                  {currentUser.displayName}
                </span>
                {currentUser.isFounder && (
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border border-amber-400/30">
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
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        Edit Profile & Avatar
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
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl transition-colors font-mono cursor-pointer"
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
              className="text-xs uppercase font-mono font-bold tracking-wider px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-2xl pointer-events-auto"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-mono uppercase tracking-wider py-2.5 px-3 rounded-xl transition-colors ${
                    pathname === link.href
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs uppercase font-mono py-2.5 rounded-xl border border-white/20 text-zinc-200 hover:text-white bg-white/5"
              >
                Join Vanta
              </Link>
              {currentUser ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs uppercase font-mono font-bold py-2.5 rounded-xl bg-white text-black"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs uppercase font-mono font-bold py-2.5 rounded-xl bg-white text-black"
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
