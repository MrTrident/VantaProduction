-- ==============================================================================
-- VANTA PRODUCTION — SEED DATA
-- Default positions, departments, roles, permissions, categories & mock assets
-- ==============================================================================

-- 1. Default Departments
INSERT INTO public.departments (name, slug, description, display_order) VALUES
('Management & Executive', 'executive', 'High-level network leadership, executive operations and strategy', 1),
('Thumbnail Design', 'thumbnail-design', 'High-CTR YouTube and platform thumbnail design specialists', 2),
('Video Editing', 'video-editing', 'Narrative, retention-focused long-form and short-form video editors', 3),
('Motion Graphics & VFX', 'motion-vfx', '3D motion design, intros, lower-thirds and visual effects', 4),
('Graphic Design & Branding', 'branding', 'Brand identities, social banners, typography and marketing assets', 5),
('Development & Technology', 'development', 'Minecraft plugin architecture, custom bots and web applications', 6),
('Creator Relations', 'creator-relations', 'Partnership onboarding, creator liaison and client success', 7),
('Recruitment & Talent', 'recruitment', 'Artist discovery, application screening and onboarding', 8)
ON CONFLICT (slug) DO NOTHING;

-- 2. Default Organizational Positions
INSERT INTO public.organizational_positions (title, level, is_default, description) VALUES
('Founder', 1, TRUE, 'Ultimate authority and creator of Vanta Production'),
('Co-Founder', 2, TRUE, 'Executive network co-leadership and governance'),
('Executive Director', 3, TRUE, 'Directs cross-department strategy and high-stakes creator deals'),
('Head Manager', 4, TRUE, 'Oversees multiple operational divisions'),
('Department Head', 5, TRUE, 'Directs a specific creative or technical department'),
('Senior Manager', 6, TRUE, 'Supervises production teams and complex deliverables'),
('Production Manager', 7, TRUE, 'Coordinates deadlines, artist allocations and reviews'),
('Assistant Manager', 8, TRUE, 'Assists production manager in daily artist workflows'),
('Team Leader', 9, TRUE, 'Leads an assigned squad of artists or developers'),
('Creative Supervisor', 10, TRUE, 'Quality assurance and stylistic alignment reviewer'),
('Senior Staff', 11, TRUE, 'Core operational member supporting administration'),
('Staff Member', 12, TRUE, 'General production and support personnel'),
('Senior Artist', 13, TRUE, 'Elite creative producing headline work'),
('Artist', 14, TRUE, 'Active member of Vanta creative roster'),
('Junior Artist / Trainee', 15, TRUE, 'Onboarding talent under mentorship')
ON CONFLICT DO NOTHING;

-- 3. Default Categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Thumbnail Design', 'thumbnails', 'High-converting custom YouTube thumbnails', 'Image'),
('Video Editing', 'editing', 'Paced YouTube editing, retention cuts and documentaries', 'Video'),
('Motion Graphics', 'motion', '3D renders, kinetic typography and visual effects', 'Sparkles'),
('Graphic Design', 'graphic-design', 'Logos, branding kits, Twitch graphics and packaging', 'Palette'),
('Minecraft Development', 'minecraft', 'Paper plugins, SMP systems and custom mechanics', 'Code'),
('Web Development', 'web-dev', 'High-performance web apps, portfolios and tooling', 'Globe')
ON CONFLICT (slug) DO NOTHING;

-- 4. Initial Homepage Config
INSERT INTO public.homepage_config (id, hero_headline, hero_subheading, enable_floating_artwork, floating_speed, floating_intensity, floating_count)
VALUES (
  1,
  'CREATIVITY. BUILT TOGETHER.',
  'An independent creative production network bringing talented artists and creators together.',
  TRUE,
  1.0,
  1.0,
  8
)
ON CONFLICT (id) DO UPDATE SET
  hero_headline = EXCLUDED.hero_headline,
  hero_subheading = EXCLUDED.hero_subheading;

-- 5. Default Services
INSERT INTO public.services (title, slug, short_desc, full_desc, icon_name, deliverables, display_order) VALUES
('High-CTR Thumbnails', 'thumbnails', 'Extreme click-through-rate concepts, 3D modeling and lighting.', 'Engineered thumbnail graphics designed to capture attention in competitive feeds, combining hand-crafted lighting, custom 3D renders, facial expression enhancement, and contrast mastery.', 'Image', ARRAY['3 Initial concepts', '4K Deliverables', 'Iterative title pairing', 'Color variation tests'], 1),
('Cinema Video Editing', 'video-editing', 'Story-driven pacing, sound design, soundscapes and color grading.', 'Full-scale editing pipelines for top-tier creators. Fast-paced retention editing, documentary deep-dives, seamless B-roll integration, and studio-grade audio mixing.', 'Video', ARRAY['Complete retention edit', 'Sound design & SFX mix', 'Dynamic subtitles', 'Project timeline backup'], 2),
('3D Motion Graphics & Intros', 'motion-graphics', 'Custom 3D logo resolves, explainer graphics and kinetic titles.', 'Broadcast-quality motion graphics built in Blender and After Effects. We turn abstract topics into breathtaking visual explanations that hold viewer attention.', 'Sparkles', ARRAY['Custom 3D assets', 'Alpha channel exports', '60 FPS renders', 'Sound design match'], 3),
('Creator Brand Identity', 'brand-identity', 'Holistic channel rebranding, vector logos and streaming packages.', 'Complete aesthetic overhaul for digital creators and gaming networks. From iconography and typography to stream overlays and merchandise guides.', 'Palette', ARRAY['Primary & alternate logos', 'Color & typography guide', 'Social banners', 'Vector source files'], 4),
('Minecraft SMP & Systems', 'minecraft-development', 'Custom Paper plugins, custom abilities and interactive SMP servers.', 'Backend server architecture and unique gameplay mechanics designed specifically for cinematic YouTube SMPs and creator events.', 'Code', ARRAY['Optimized Java plugins', 'Resource pack integration', 'Performance profiling', 'Documentation'], 5),
('Production Management', 'production-management', 'Dedicated creative direction and hands-off delivery pipeline.', 'Full executive production management where Vanta handles your weekly scheduling, asset routing, thumbnail-to-title synergy, and artist coordination.', 'LayoutDashboard', ARRAY['Dedicated art director', 'Slack/Discord workspace', 'Quality check guarantees', 'Turnaround guarantees'], 6)
ON CONFLICT (slug) DO NOTHING;
