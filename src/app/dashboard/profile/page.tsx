'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { UserCheck, CheckCircle2, Save, Sparkles } from 'lucide-react';

export default function ArtistProfileEditPage() {
  const { currentUser, artistProfiles, updateArtistProfile, updateProfile } = useVanta();

  const artist = artistProfiles.find((a) => a.userId === currentUser?.id);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(artist?.bio || currentUser?.bio || '');
  const [specialty, setSpecialty] = useState(artist?.specialty || 'High-CTR Thumbnails');
  const [yearsExperience, setYearsExperience] = useState(artist?.yearsExperience || 3);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(artist?.bannerUrl || '');
  const [availabilityStatus, setAvailabilityStatus] = useState<any>(artist?.availabilityStatus || 'available');
  const [twitter, setTwitter] = useState(artist?.socialLinks?.twitter || '');
  const [discord, setDiscord] = useState(artist?.socialLinks?.discord || '');
  const [youtube, setYoutube] = useState(artist?.socialLinks?.youtube || '');
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile(currentUser.id, {
      displayName,
      avatarUrl,
      bio,
    });

    if (artist) {
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
        },
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Artist Profile Settings
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Customize your public presence, client availability, and social links.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" /> Changes Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Visual Assets */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            01 // Visual Identity & Imagery
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Profile Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Header Banner URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            02 // Bio & Specialty
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Specialty Title
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
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
                <option value="available">Available Now</option>
                <option value="busy">Busy / In Production</option>
                <option value="booked">Fully Booked</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Artist Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950 space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-zinc-900 pb-2">
            03 // External Social Connections
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Discord Tag / Username
              </label>
              <input
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="username#0000"
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

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Details
        </button>
      </form>
    </div>
  );
}
