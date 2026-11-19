'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVanta } from '@/lib/vanta-context';
import { UploadCloud, Image as ImageIcon, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UploadArtworkPage() {
  const router = useRouter();
  const { currentUser, addPortfolioItem } = useVanta();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Thumbnail Design');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'embed'>('image');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80');
  const [externalUrl, setExternalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const categories = [
    'Thumbnail Design',
    'Video Editing',
    'Motion Graphics',
    'Graphic Design',
    'Minecraft Development',
    'Web Development',
  ];

  const handleAction = (status: 'draft' | 'submitted') => {
    if (!title.trim()) {
      alert('Please provide a project title.');
      return;
    }
    if (!mediaUrl.trim()) {
      alert('Please provide a media preview URL.');
      return;
    }

    setIsSubmitting(true);

    addPortfolioItem({
      artistId: currentUser.id,
      artistUsername: currentUser.username,
      artistDisplayName: currentUser.displayName,
      artistAvatarUrl: currentUser.avatarUrl,
      title: title.trim(),
      description: description.trim(),
      category,
      mediaUrl: mediaUrl.trim(),
      mediaType,
      externalUrl: externalUrl.trim(),
      status,
      isFeatured: false,
      isFloatingHero: false,
      isPublic: false,
      views: 0,
      likes: 0,
    });

    setTimeout(() => {
      router.push('/dashboard/portfolio');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-900">
        <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
          Submit Artwork Deliverable
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Upload your project assets for department quality assurance and public showcase curation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 100 DAYS SURVIVING IN THE VOID"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  <option value="image">Static Image / 4K Render</option>
                  <option value="video">Video Preview Link</option>
                  <option value="embed">Interactive / External Embed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Media Asset URL (Direct Image / Render) *
              </label>
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or Cloudflare R2 / Supabase Storage link"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                External Client / Project Link (Optional)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or Behance URL"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Description & Craft Notes
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention 3D lighting, Cinema4D techniques, retention considerations, or client metrics achieved..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('submitted')}
              className="flex-1 py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" /> Submit for Moderation
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('draft')}
              className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-wider hover:border-white hover:text-white transition-colors"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Live Card Preview
          </h3>

          <div className="rounded-2xl border border-white/15 bg-zinc-950 overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full bg-zinc-900">
              {mediaUrl ? (
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/70 border border-white/20 text-zinc-200">
                {category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="text-sm font-bold font-mono uppercase text-white truncate">
                {title || 'PROJECT TITLE PREVIEW'}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {description || 'Your project description and technical breakdown will appear here.'}
              </p>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>@{currentUser.username}</span>
                <span>Just Now</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs font-mono text-zinc-400 space-y-1.5">
            <p className="text-white font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Moderation Workflow
            </p>
            <p className="text-[11px] leading-relaxed">
              Once submitted, department heads verify color contrast, aspect ratio, and resolution before publishing to the global archive and floating artwork hero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
