import React from 'react';
import Link from 'next/link';
import { VantaLogo } from '@/components/vanta-logo';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { TwitterIcon, YoutubeIcon, DiscordIcon } from '@/components/social-icons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050505] pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-zinc-900">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <VantaLogo size="lg" />
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Vanta Production is an independent, invite-only creative production network bringing together elite thumbnail artists, video editors, motion designers and technical directors.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NETWORK ONLINE • PRIVATE PRODUCTION PLATFORM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-white transition-colors">
                  Artist Roster
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-white transition-colors">
                  Creators We Work With
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Vanta
                </Link>
              </li>
            </ul>
          </div>

          {/* Artists & Talent */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold">
              Talent
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/apply" className="hover:text-white transition-colors flex items-center gap-1 text-amber-300">
                  Join Vanta <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Artist Workspace
                </Link>
              </li>
              <li>
                <Link href="/invite/accept" className="hover:text-white transition-colors">
                  Accept Invitation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  Management <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold">
              Connect
            </h4>
            <p className="text-xs text-zinc-400">
              For high-stakes creator inquiries and private production partnerships:
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/40 transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2025 VANTA PRODUCTION. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Creators & Elite Talent</span>
            <span className="text-zinc-700">•</span>
            <span>Security & RLS Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
