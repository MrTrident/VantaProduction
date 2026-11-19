import {
  Profile,
  Department,
  OrganizationalPosition,
  Role,
  Permission,
  ArtistProfile,
  PortfolioItem,
  Application,
  Invitation,
  Creator,
  Service,
  Project,
  Task,
  Announcement,
  AuditLog,
  HomepageConfig,
} from '@/types';

// ==============================================================================
// 1. PERMISSIONS MATRIX (12 Categories)
// ==============================================================================
export const INITIAL_PERMISSIONS: Permission[] = [
  // User management
  { id: 'p1', slug: 'users.view', name: 'View Members', category: 'User Management', description: 'Can view roster of all platform users' },
  { id: 'p2', slug: 'users.create', name: 'Create Members', category: 'User Management', description: 'Can manually register new member profiles' },
  { id: 'p3', slug: 'users.edit', name: 'Edit Members', category: 'User Management', description: 'Can modify user details and credentials' },
  { id: 'p4', slug: 'users.suspend', name: 'Suspend Members', category: 'User Management', description: 'Can toggle account suspension' },
  { id: 'p5', slug: 'users.invite', name: 'Invite Members', category: 'User Management', description: 'Can generate invitation links' },

  // Staff management
  { id: 'p6', slug: 'staff.view', name: 'View Staff', category: 'Staff Management', description: 'Can inspect staff hierarchy & direct reports' },
  { id: 'p7', slug: 'staff.promote', name: 'Promote Staff', category: 'Staff Management', description: 'Can advance staff positions & titles' },
  { id: 'p8', slug: 'staff.transfer', name: 'Transfer Departments', category: 'Staff Management', description: 'Can move personnel between divisions' },

  // Artist management
  { id: 'p9', slug: 'artists.manage', name: 'Manage Artist Profiles', category: 'Artist Management', description: 'Can edit artist bios and portfolios' },
  { id: 'p10', slug: 'artists.feature', name: 'Feature Artists', category: 'Artist Management', description: 'Can feature artists on public homepage' },

  // Portfolio management
  { id: 'p11', slug: 'portfolio.review', name: 'Review Submissions', category: 'Portfolio Management', description: 'Can review pending portfolio submissions' },
  { id: 'p12', slug: 'portfolio.approve', name: 'Approve Submissions', category: 'Portfolio Management', description: 'Can approve and publish portfolio items' },
  { id: 'p13', slug: 'portfolio.feature', name: 'Feature Work', category: 'Portfolio Management', description: 'Can feature artwork on homepage floating grid' },

  // Project management
  { id: 'p14', slug: 'projects.manage', name: 'Manage Projects', category: 'Project Management', description: 'Can create production projects and deadlines' },
  { id: 'p15', slug: 'tasks.assign', name: 'Assign Tasks', category: 'Project Management', description: 'Can assign tasks to artists and staff' },

  // Department management
  { id: 'p16', slug: 'departments.manage', name: 'Manage Departments', category: 'Department Management', description: 'Can configure department structure' },

  // Creator management
  { id: 'p17', slug: 'creators.manage', name: 'Manage Creators', category: 'Creator Management', description: 'Can add, edit and feature creator partners' },

  // Recruitment
  { id: 'p18', slug: 'recruitment.review', name: 'Review Applications', category: 'Recruitment', description: 'Can review public /apply submissions' },
  { id: 'p19', slug: 'recruitment.approve', name: 'Approve Applications', category: 'Recruitment', description: 'Can accept applicants & issue invites' },

  // Website CMS
  { id: 'p20', slug: 'cms.edit', name: 'Edit Website CMS', category: 'Website CMS', description: 'Can modify homepage sections, text and media' },

  // Communication
  { id: 'p21', slug: 'comm.announce', name: 'Broadcast Announcements', category: 'Communication', description: 'Can post network-wide announcements' },

  // Administration
  { id: 'p22', slug: 'admin.audit', name: 'View Audit Logs', category: 'Administration', description: 'Can access immutable activity history' },
  { id: 'p23', slug: 'admin.roles', name: 'Manage Roles & Permissions', category: 'Administration', description: 'Can build custom roles & assign scopes' },
];

// ==============================================================================
// 2. DEPARTMENTS
// ==============================================================================
export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'd-exec', name: 'Executive Leadership', slug: 'executive', description: 'Network direction, creative governance, and creator acquisitions', headId: 'u-smiiko', headName: 'SmiikoGod (Founder)', isActive: true, displayOrder: 1, memberCount: 1, createdAt: '2024-01-01' },
  { id: 'd-dev', name: 'Development & Technology', slug: 'development', description: 'Custom Minecraft Paper systems, creator tools, modpacks, and server infrastructure', headId: 'u-smiiko', headName: 'SmiikoGod (Lead Developer)', isActive: true, displayOrder: 2, memberCount: 1, createdAt: '2024-01-02' },
  { id: 'd-thumb', name: 'Thumbnail Design', slug: 'thumbnail-design', description: 'High-CTR Minecraft & Roblox YouTube thumbnails, 3D modeling, and cinematic lighting', headId: 'u-sparky', headName: 'SparkyGFX', isActive: true, displayOrder: 3, memberCount: 1, createdAt: '2024-01-02' },
  { id: 'd-edit', name: 'Video Editing', slug: 'video-editing', description: 'Retention-focused narrative editing, sound design, and documentary pacing', isActive: true, displayOrder: 4, memberCount: 0, createdAt: '2024-01-02' },
  { id: 'd-motion', name: 'Motion Graphics & VFX', slug: 'motion-vfx', description: '3D motion design, broadcast packages, and visual effects', isActive: true, displayOrder: 5, memberCount: 0, createdAt: '2024-01-03' },
  { id: 'd-brand', name: 'Graphic Design & Branding', slug: 'branding', description: 'Channel rebrands, vector logos, merchandise styling, and social banners', isActive: true, displayOrder: 6, memberCount: 0, createdAt: '2024-01-03' },
  { id: 'd-creator', name: 'Creator Relations', slug: 'creator-relations', description: 'Creator liaison, upload schedules, and partnership management', isActive: true, displayOrder: 7, memberCount: 0, createdAt: '2024-01-05' },
];

// ==============================================================================
// 3. ORGANIZATIONAL POSITIONS
// ==============================================================================
export const INITIAL_POSITIONS: OrganizationalPosition[] = [
  { id: 'pos-1', title: 'Founder & Lead Developer', level: 1, isDefault: true, description: 'Ultimate network owner and lead Minecraft systems engineer. Non-revocable.', createdAt: '2024-01-01' },
  { id: 'pos-2', title: 'Co-Founder', level: 2, isDefault: true, description: 'Executive network co-leadership and governance.', createdAt: '2024-01-01' },
  { id: 'pos-3', title: 'Executive Director', level: 3, isDefault: true, description: 'Directs cross-department operations and major creator partnerships.', createdAt: '2024-01-01' },
  { id: 'pos-4', title: 'Department Head', level: 4, isDefault: true, description: 'Directs an entire creative or technical department.', createdAt: '2024-01-01' },
  { id: 'pos-5', title: 'Senior Thumbnail Artist', level: 5, isDefault: true, description: 'Master designer producing high-CTR Minecraft & Roblox thumbnail assets.', createdAt: '2024-01-01' },
  { id: 'pos-6', title: 'Senior Video Editor', level: 6, isDefault: true, description: 'Directs retention pacing and documentary editing.', createdAt: '2024-01-01' },
  { id: 'pos-7', title: 'Artist', level: 7, isDefault: true, description: 'Active member of Vanta creative roster.', createdAt: '2024-01-01' },
  { id: 'pos-8', title: 'Junior Artist / Trainee', level: 8, isDefault: true, description: 'Onboarding talent under mentorship.', createdAt: '2024-01-01' },
];

// ==============================================================================
// 4. ROLES
// ==============================================================================
export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-founder',
    name: 'Founder & Supreme Administrator',
    slug: 'founder',
    description: 'Unrestricted global authority across all systems, roles, personnel, and CMS.',
    isSystem: true,
    permissionIds: INITIAL_PERMISSIONS.map(p => p.id),
    scope: 'global',
    createdAt: '2024-01-01',
  },
  {
    id: 'role-dept-head',
    name: 'Department Head',
    slug: 'department-head',
    description: 'Manages department talent, assigns deliverables, and curates portfolio submissions.',
    isSystem: true,
    permissionIds: ['p1', 'p6', 'p9', 'p11', 'p12', 'p13', 'p14', 'p15', 'p21'],
    scope: 'department',
    createdAt: '2024-01-01',
  },
  {
    id: 'role-artist',
    name: 'Verified Creative Artist',
    slug: 'artist',
    description: 'Authenticated creator who manages personal portfolio and submits artwork for review.',
    isSystem: true,
    permissionIds: [],
    scope: 'own',
    createdAt: '2024-01-01',
  },
];

// ==============================================================================
// 5. PROFILES (SmiikoGod as Minecraft Mod Dev & SparkyGFX as Thumbnail Artist)
// ==============================================================================
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u-smiiko',
    username: 'smiikogod',
    displayName: 'SmiikoGod',
    email: 'smiiko@vantaproduction.com',
    avatarUrl: '/images/vanta-logo.jpg',
    bio: 'Founder of Vanta Production & Lead Minecraft Developer. Custom mods, Paper/Spigot systems, combat physics, and creator infrastructure.',
    isFounder: true,
    status: 'active',
    positionId: 'pos-1',
    positionTitle: 'Founder & Lead Developer',
    departmentId: 'd-dev',
    departmentName: 'Development & Technology',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'u-sparky',
    username: 'sparkygfx',
    displayName: 'SparkyGFX',
    email: 'sparky@vantaproduction.com',
    avatarUrl: '/images/sparky-pfp.jpg',
    bio: 'Senior Thumbnail Artist at Vanta Production. Specialist in high-CTR Minecraft and Roblox 3D renders, cinematic lighting, and thumbnail visual psychology.',
    isFounder: false,
    status: 'active',
    positionId: 'pos-5',
    positionTitle: 'Senior Thumbnail Artist',
    departmentId: 'd-thumb',
    departmentName: 'Thumbnail Design',
    reportingManagerId: 'u-smiiko',
    reportingManagerName: 'SmiikoGod (Founder)',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];

// ==============================================================================
// 6. ARTIST PROFILES
// ==============================================================================
export const INITIAL_ARTIST_PROFILES: ArtistProfile[] = [
  {
    userId: 'u-smiiko',
    username: 'smiikogod',
    displayName: 'SmiikoGod',
    avatarUrl: '/images/vanta-logo.jpg',
    bio: 'Founder of Vanta Production. Specialist in custom Minecraft mod development, server architecture, custom abilities, and creator gaming platforms.',
    specialty: 'Minecraft Mod Development & Systems',
    yearsExperience: 6,
    bannerUrl: '/images/vanta-welcome-banner.jpg',
    themeMode: 'dark',
    layoutMode: 'editorial',
    isFeatured: true,
    isPublic: true,
    availabilityStatus: 'busy',
    socialLinks: {
      discord: 'smiiko',
      portfolio: 'https://vantaproduction.com',
    },
    displayOrder: 1,
  },
  {
    userId: 'u-sparky',
    username: 'sparkygfx',
    displayName: 'SparkyGFX',
    avatarUrl: '/images/sparky-pfp.jpg',
    bio: 'Senior Thumbnail Artist at Vanta Production. Specialized in high-CTR Minecraft and Roblox 3D renders, cinematic lighting, and thumbnail visual psychology.',
    specialty: 'Minecraft & Roblox YouTube Thumbnails',
    yearsExperience: 4,
    bannerUrl: '/images/vanta-welcome-banner.jpg',
    themeMode: 'dark',
    layoutMode: 'grid',
    isFeatured: true,
    isPublic: true,
    availabilityStatus: 'available',
    socialLinks: {
      portfolio: 'https://behance.net/sparkygfx',
      discord: 'sparky.gfx',
      instagram: 'https://www.instagram.com/sparky.gfx',
    },
    displayOrder: 2,
  },
];

// ==============================================================================
// 7. APPROVED PORTFOLIO ITEMS (SparkyGFX: Minecraft & Roblox Thumbnails | SmiikoGod: Minecraft Mod Dev)
// ==============================================================================
export const INITIAL_PORTFOLIO_ITEMS: PortfolioItem[] = [
  // SparkyGFX: Real Minecraft & Roblox Thumbnails from Behance (behance.net/sparkygfx)
  {
    id: 'p-1',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'MINECRAFT: 100 DAYS SURVIVAL HARDCORE',
    description: 'Official SparkyGFX Behance Work: High-CTR Minecraft Hardcore thumbnail with custom 3D character lighting, rim illumination, and dragon boss visual framing.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-mc-1.png',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/216727731/Minecraft-Thumbnails',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1420,
    likes: 142,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: 'p-2',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'ROBLOX: STEAL A BRAIN CHALLENGE',
    description: 'Official SparkyGFX Behance Work: High-tension Roblox 3D gaming thumbnail with dual-tone neon lighting, dynamic perspective, and viral click psychology.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-roblox-1.png',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/244641139/Roblox-Thumbnail',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1850,
    likes: 194,
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12',
  },
  {
    id: 'p-3',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'MINECRAFT: SURVIVING IN THE APOCALYPSE ABYSS',
    description: 'Official SparkyGFX Behance Work: High contrast dark fantasy Minecraft thumbnail with custom bioluminescent 3D modeling and dramatic character focal framing.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-mc-2.jpg',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/216727731/Minecraft-Thumbnails',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1210,
    likes: 118,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
  },
  {
    id: 'p-4',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'ROBLOX: ESCAPE THE SUPERMAX PRISON',
    description: 'Official SparkyGFX Behance Work: Action-packed Roblox jailbreak escape thumbnail with sirens, expressive 3D character rigs, and vibrant cinematic VFX.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-roblox-2.png',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/244641139/Roblox-Thumbnail',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 2140,
    likes: 215,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: 'p-5',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'MINECRAFT: WE TRAPPED 100 PLAYERS IN A CUBE',
    description: 'Official SparkyGFX Behance Work: Massive scale 3D isometric Minecraft arena render with volumetric fog, dramatic spotlighting, and high-CTR color grading.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-mc-3.jpg',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/216727731/Minecraft-Thumbnails',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 2680,
    likes: 280,
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
  },
  {
    id: 'p-6',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'ROBLOX: BEDWARS CHAMPIONSHIP TOURNAMENT',
    description: 'Official SparkyGFX Behance Work: High energy Roblox competitive tournament thumbnail with custom 3D sword effects, player elimination tags, and dramatic tilt.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-roblox-3.png',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/244641139/Roblox-Thumbnail',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1520,
    likes: 164,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'p-10',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'MINECRAFT: MY SECRET UNDERGROUND BASE',
    description: 'Official SparkyGFX Behance Work: Detailed 3D interior bunker lighting, secret redstone vault entrance, and volumetric light shafts.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-mc-4.jpg',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/216727731/Minecraft-Thumbnails',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1350,
    likes: 138,
    createdAt: '2024-03-03',
    updatedAt: '2024-03-03',
  },
  {
    id: 'p-11',
    artistId: 'u-sparky',
    artistUsername: 'sparkygfx',
    artistDisplayName: 'SparkyGFX',
    artistAvatarUrl: '/images/sparky-pfp.jpg',
    title: 'ROBLOX: SURVIVING 99 NIGHTS AT HAUNTED MANSION',
    description: 'Official SparkyGFX Behance Work: Spooky cinematic Roblox thumbnail with custom fog particles, glowing lantern lighting, and intense facial expressions.',
    category: 'Thumbnail Design',
    mediaUrl: '/images/thumbnails/sparky-roblox-4.png',
    mediaType: 'image',
    externalUrl: 'https://www.behance.net/gallery/244641139/Roblox-Thumbnail',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1690,
    likes: 172,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },

  // SmiikoGod: Minecraft Mod & Systems Development
  {
    id: 'p-7',
    artistId: 'u-smiiko',
    artistUsername: 'smiikogod',
    artistDisplayName: 'SmiikoGod',
    artistAvatarUrl: '/images/vanta-logo.jpg',
    title: 'VANTACORE: CUSTOM MINECRAFT SMP ENGINE',
    description: 'High-performance Paper/Spigot custom server engine featuring custom abilities, real-time combat physics, event triggers, and anti-lag optimizations.',
    category: 'Minecraft Development',
    mediaUrl: '/images/thumbnails/sparky-mc-5.png',
    mediaType: 'image',
    externalUrl: 'https://vantaproduction.com',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 2350,
    likes: 246,
    createdAt: '2024-03-02',
    updatedAt: '2024-03-02',
  },
  {
    id: 'p-8',
    artistId: 'u-smiiko',
    artistUsername: 'smiikogod',
    artistDisplayName: 'SmiikoGod',
    artistAvatarUrl: '/images/vanta-logo.jpg',
    title: 'RINGSMP: CUSTOM ABILITIES & TIMELINES MOD',
    description: 'Specialized Minecraft ability system with custom display entities, item models, keyframe combat timelines, and server-side cooldown rules.',
    category: 'Minecraft Development',
    mediaUrl: '/images/thumbnails/sparky-mc-6.png',
    mediaType: 'image',
    externalUrl: 'https://vantaproduction.com',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1890,
    likes: 192,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
  {
    id: 'p-9',
    artistId: 'u-smiiko',
    artistUsername: 'smiikogod',
    artistDisplayName: 'SmiikoGod',
    artistAvatarUrl: '/images/vanta-logo.jpg',
    title: 'ELYTRAPVP: DYNAMIC FLIGHT & COMBAT ENGINE',
    description: 'Custom server-side plugin and modpack modifying player drag, kinetic velocity, aerial particle rings, and competitive duel arenas.',
    category: 'Minecraft Development',
    mediaUrl: '/images/vanta-welcome-banner.jpg',
    mediaType: 'image',
    externalUrl: 'https://vantaproduction.com',
    status: 'approved',
    isFeatured: true,
    isFloatingHero: true,
    isPublic: true,
    views: 1540,
    likes: 158,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-08',
  },
];

// ==============================================================================
// 8. CREATORS
// ==============================================================================
export const INITIAL_CREATORS: Creator[] = [
  {
    id: 'c-1',
    name: 'MythicSaga',
    handle: '@MythicSaga',
    channelUrl: 'https://youtube.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MythicSaga',
    subscriberCount: '2.4M',
    viewCount: '480M',
    category: 'Minecraft Gaming',
    isFeatured: true,
    isPublic: true,
    displayOrder: 1,
    createdAt: '2024-01-10',
  },
  {
    id: 'c-2',
    name: 'AetherGaming',
    handle: '@AetherGaming',
    channelUrl: 'https://youtube.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=AetherGaming',
    subscriberCount: '1.8M',
    viewCount: '320M',
    category: 'Storylines & SMPs',
    isFeatured: true,
    isPublic: true,
    displayOrder: 2,
    createdAt: '2024-01-12',
  },
  {
    id: 'c-3',
    name: 'VoltPlayz',
    handle: '@VoltPlayz',
    channelUrl: 'https://youtube.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=VoltPlayz',
    subscriberCount: '950K',
    viewCount: '185M',
    category: 'Challenge Videos',
    isFeatured: true,
    isPublic: true,
    displayOrder: 3,
    createdAt: '2024-01-15',
  },
];

// ==============================================================================
// 9. SERVICES
// ==============================================================================
export const INITIAL_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'High-CTR Thumbnails',
    slug: 'thumbnails',
    shortDesc: 'Engineered click-through concepts, 3D modeling, cinematic lighting & contrast mastery.',
    fullDesc: 'We engineer visual psychology to maximize impression click-through rate. Each piece combines bespoke 3D assets, custom lighting pipelines, expressive face enhancement, and bold framing.',
    iconName: 'Image',
    deliverables: ['3 Concept Sketches / Mockups', 'Full 4K Ultra HD Deliverable', 'Tailored Title & Packaging Synergy', 'Variant Colorway & A/B Test Options'],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 's-2',
    title: 'Cinema Video Editing',
    slug: 'video-editing',
    shortDesc: 'Story-driven pacing, orchestral sound design, retention engineering and color grading.',
    fullDesc: 'Full-scale editing pipelines built for demanding creators. Whether fast-paced challenge content or multi-part cinematic documentaries, we transform hours of raw capture into gripping experiences.',
    iconName: 'Video',
    deliverables: ['Retention-Optimized Master Edit', 'Bespoke SFX & Multi-Track Sound Mixing', 'Dynamic Motion Captions & Graphics', 'Complete Project Timeline Archive'],
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 's-3',
    title: '3D Motion Graphics & Intros',
    slug: 'motion-vfx',
    shortDesc: 'Broadcast-tier 3D logo resolves, explainer graphics, kinetic typography and visual effects.',
    fullDesc: 'Custom motion design powered by Blender, After Effects, and Cinema4D. We construct jaw-dropping channel intros, transparent stream alerts, lower thirds, and animated infographic breakdowns.',
    iconName: 'Sparkles',
    deliverables: ['Custom 3D Asset Modeling & Texturing', 'Alpha-Channel Transparent Video Exports', '60 FPS Ultra-Smooth Renders', 'Custom Sound Design Integration'],
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 's-4',
    title: 'Creator Brand Identity',
    slug: 'branding',
    shortDesc: 'Holistic channel rebranding, vector iconography, stream packages & merch guidelines.',
    fullDesc: 'A cohesive visual universe across your YouTube channel, Twitch overlays, Twitter banner, Discord server, and merchandise.',
    iconName: 'Palette',
    deliverables: ['Primary & Secondary Vector Logos', 'Brand Style Guide & Font Licensing', 'Social Headers & Stream Overlays', 'Full Vector Master Asset Package'],
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 's-5',
    title: 'Minecraft SMP & Systems',
    slug: 'minecraft-dev',
    shortDesc: 'High-performance Paper plugins, cinematic abilities, custom items and SMP infrastructure.',
    fullDesc: 'Tailored backend game architecture and interactive mechanics designed specifically for creator SMPs and YouTube events.',
    iconName: 'Code',
    deliverables: ['Custom Java Paper Plugins', 'Custom Resource Pack Models & UI', 'Zero-Lag Network Profiling', 'Full Documentation & Live Server Support'],
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 's-6',
    title: 'Production Management',
    slug: 'production-mgmt',
    shortDesc: 'End-to-end creative direction, scheduled delivery pipelines and artist coordination.',
    fullDesc: 'Hands-off peace of mind for top-tier creators. A dedicated Vanta Creative Director manages your entire production calendar, coordinates thumbnail artists, editors, and QA checks.',
    iconName: 'LayoutDashboard',
    deliverables: ['Dedicated Creative Director', 'Private Discord / Slack Workspace', 'Guaranteed Turnaround SLAs', 'Unlimited Revision Quality Checks'],
    isActive: true,
    displayOrder: 6,
  },
];

// ==============================================================================
// 10. HOMEPAGE CONFIG
// ==============================================================================
export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  heroHeadline: 'CREATIVITY. BUILT TOGETHER.',
  heroSubheading: 'An independent creative production network bringing talented artists and creators together.',
  enableFloatingArtwork: true,
  floatingSpeed: 1.0,
  floatingIntensity: 1.0,
  floatingCount: 6,
  floatingOpacity: 0.9,
  sectionsVisibility: {
    hero: true,
    floating: true,
    workRibbon: true,
    work: true,
    artists: true,
    creators: false,
    services: true,
    about: true,
    footer: true,
  },
};

// ==============================================================================
// 11. APPLICATIONS & TASKS
// ==============================================================================
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Vanta Production Platform Live',
    content: 'Welcome to the official creative platform of Vanta Production.',
    targetScope: 'global',
    authorId: 'u-smiiko',
    authorName: 'SmiikoGod (Founder)',
    isPinned: true,
    createdAt: '2024-03-01',
  },
];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'u-smiiko',
    userName: 'SmiikoGod (Founder)',
    action: 'PLATFORM_PUBLISHED',
    entityType: 'System',
    details: { message: 'Production platform initialized and published to network.' },
    ipAddress: '127.0.0.1',
    createdAt: '2024-03-01 10:00:00',
  },
];
