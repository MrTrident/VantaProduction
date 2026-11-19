'use client';

import React, { useState, useRef } from 'react';
import { useVanta } from '@/lib/vanta-context';
import {
  UserCheck,
  CheckCircle2,
  Save,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Shield,
  Palette,
  Eye,
  Camera,
} from 'lucide-react';

export default function ArtistProfileEditPage() {
  const { currentUser, artistProfiles, updateArtistProfile, updateProfile } = useVanta();

  const artist = artistProfiles.find((a) => a.userId === currentUser?.id);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [positionTitle, setPositionTitle] = useState(currentUser?.positionTitle || 'Senior Creative Artist');
  const [specialty, setSpecialty] = useState(artist?.specialty || 'High-CTR 3D Thumbnails');
  const [bio, setBio] = useState(artist?.bio || currentUser?.bio || '');
  const [yearsExperience, setYearsExperience] = useState(artist?.yearsExperience || 3);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '/images/vanta-logo.jpg');
  const [bannerUrl, setBannerUrl] = useState(artist?.bannerUrl || '/images/vanta-welcome-banner.jpg');
  const [availabilityStatus, setAvailabilityStatus] = useState<any>(artist?.availabilityStatus || 'available');
  const [twitter, setTwitter] = useState(artist?.socialLinks?.twitter || '');
  const [discord, setDiscord] = useState(artist?.socialLinks?.discord || '');
  const [youtube, setYoutube] = useState(artist?.socialLinks?.youtube || '');
  const [behance, setBehance] = useState(artist?.socialLinks?.behance || '');
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  // Handle local avatar file upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local banner file upload
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile(currentUser.id, {
      displayName,
      positionTitle,
      avatarUrl,
      bio,
    });

    updateArtistProfile(currentUser.id, {
      displayName,
      avatarUrl,
      bannerUrl,
      bio,
      specialty,
      yearsExperience: Number(yearsExperience),
      availabilityStatus,
      socialLinks: {
        twitter,
        discord,
        youtube,
        behance,
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Identity & Portfolio Customizer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Profile & Avatar Settings
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Customize your avatar picture, role title, biography, specialty, and public availability.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" /> Changes Saved Across Site!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Avatar & Banner Customization */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-6">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            01 // Profile Picture & Header Banner
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-white/10 bg-zinc-900/40">
            {/* Live Avatar Preview */}
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white/30 shadow-2xl group-hover:border-amber-400 transition-all"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-mono transition-opacity cursor-pointer"
              >
                <Upload className="w-5 h-5 mb-1 text-amber-400" />
                Change PFP
              </button>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo From Device
                </button>

                {/* Quick Presets */}
                <button
                  type="button"
                  onClick={() => setAvatarUrl('/images/sparky-pfp.jpg')}
                  className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-300 transition-colors"
                >
                  SparkyGFX PFP
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarUrl('/images/vanta-logo.jpg')}
                  className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-300 transition-colors"
                >
                  Vanta Emblem
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`)}
                  className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-300 transition-colors"
                >
                  3D Bot Avatar
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... or /images/..."
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Portfolio Banner Image URL or Upload
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerFileUpload}
                accept="image/*"
                className="hidden"
              />
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="/images/vanta-welcome-banner.jpg or https://..."
                className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono border border-white/10 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Identity, Title & Specialty */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            02 // Display Name, Title & Specialty
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Role / Position Title (e.g. Lead Minecraft Developer, Senior 3D Artist) *
              </label>
              <input
                type="text"
                required
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Creative Specialty *
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="High-CTR Minecraft & Roblox Thumbnails"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Client Availability
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              >
                <option value="available">🟢 Available for New Projects</option>
                <option value="busy">🟡 In Production / Limited Slots</option>
                <option value="booked">🔴 Fully Booked</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Artist Biography & Production Description *
            </label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients and collaborators about your design expertise, custom mechanics, and creative philosophy..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>
        </div>

        {/* Section 3: Social & Portfolio Connections */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            03 // External Portfolio & Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Behance Portfolio URL
              </label>
              <input
                type="url"
                value={behance}
                onChange={(e) => setBehance(e.target.value)}
                placeholder="https://behance.net/username"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Discord Tag / Server
              </label>
              <input
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="username#0000 or discord.gg/..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900/60 to-black/80 backdrop-blur-xl">
          <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Live Preview: Public Artist Card
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl border border-white/10 bg-zinc-950/80">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shrink-0 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-base font-bold text-white font-mono">{displayName}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {positionTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {availabilityStatus === 'available' ? 'Available' : availabilityStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">@{currentUser.username} • {specialty}</p>
              <p className="text-xs text-zinc-300 font-sans mt-2 line-clamp-2 max-w-xl">
                {bio || 'Custom creative asset engineer at Vanta Production.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-all flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Profile & Deploy Updates
        </button>
      </form>
    </div>
  );
}
