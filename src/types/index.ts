export type UserStatus = 'active' | 'suspended' | 'pending';
export type ItemStatus = 'draft' | 'submitted' | 'reviewing' | 'changes_requested' | 'approved' | 'rejected';
export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'submitted' | 'review' | 'completed';
export type ProjectStatus = 'planning' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
export type AvailabilityStatus = 'available' | 'busy' | 'booked';
export type PermissionScope = 'global' | 'department' | 'team' | 'assigned' | 'own';

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  isFounder: boolean;
  status: UserStatus;
  password?: string;
  positionId?: string;
  positionTitle?: string;
  departmentId?: string;
  departmentName?: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  headId?: string;
  headName?: string;
  isActive: boolean;
  displayOrder: number;
  memberCount?: number;
  createdAt: string;
}

export interface OrganizationalPosition {
  id: string;
  title: string;
  level: number; // 1=Founder, 2=Co-Founder, 3=Executive, etc.
  departmentId?: string;
  departmentName?: string;
  isDefault: boolean;
  description: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  departmentName?: string;
  leaderId?: string;
  leaderName?: string;
  memberIds: string[];
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
  scope: PermissionScope;
  departmentId?: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  roleName?: string;
  scope: PermissionScope;
  departmentId?: string;
  teamId?: string;
  expiresAt?: string;
  assignedBy: string;
  createdAt: string;
}

export interface ArtistProfile {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  specialty: string;
  yearsExperience: number;
  bannerUrl: string;
  themeMode: 'dark' | 'light';
  layoutMode: 'grid' | 'masonry' | 'editorial';
  isFeatured: boolean;
  isPublic: boolean;
  availabilityStatus: AvailabilityStatus;
  socialLinks: {
    twitter?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
    portfolio?: string;
    behance?: string;
  };
  displayOrder: number;
}

export interface PortfolioItem {
  id: string;
  artistId: string;
  artistUsername: string;
  artistDisplayName: string;
  artistAvatarUrl: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video' | 'embed';
  externalUrl?: string;
  status: ItemStatus;
  moderationNotes?: string;
  isFeatured: boolean;
  isFloatingHero: boolean;
  isPublic: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
  activeRevisionId?: string;
}

export interface PortfolioRevision {
  id: string;
  portfolioItemId: string;
  submittedBy: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  status: 'submitted' | 'approved' | 'rejected';
  moderationNotes?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  displayName: string;
  username: string;
  email: string;
  discordTag: string;
  services: string[];
  experience: string;
  portfolioLinks: string[];
  socialLinks: Record<string, string>;
  introduction: string;
  status: ApplicationStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  username: string;
  positionId?: string;
  positionTitle?: string;
  departmentId?: string;
  departmentName?: string;
  roleId?: string;
  roleName?: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  avatarUrl: string;
  subscriberCount: string;
  viewCount: string;
  category: string;
  isFeatured: boolean;
  isPublic: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  deliverables: string[];
  isActive: boolean;
  displayOrder: number;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  creatorId?: string;
  creatorName?: string;
  departmentId?: string;
  departmentName?: string;
  status: ProjectStatus;
  deadline?: string;
  budget?: number;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectTitle?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  deliverableUrl?: string;
  assignedUserIds: string[];
  assignedUserNames?: string[];
  createdBy: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetScope: 'global' | 'department' | 'team';
  departmentId?: string;
  departmentName?: string;
  authorId: string;
  authorName: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'approval' | 'rejection' | 'task' | 'warning';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface HomepageConfig {
  heroHeadline: string;
  heroSubheading: string;
  enableFloatingArtwork: boolean;
  floatingSpeed: number;
  floatingIntensity: number;
  floatingCount: number;
  floatingOpacity: number;
  sectionsVisibility: {
    hero: boolean;
    floating: boolean;
    workRibbon?: boolean;
    work: boolean;
    artists: boolean;
    creators: boolean;
    services: boolean;
    about: boolean;
    footer: boolean;
  };
}
