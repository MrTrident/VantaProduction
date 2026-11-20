'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  Department,
  OrganizationalPosition,
  Role,
  Permission,
  ArtistProfile,
  PortfolioItem,
  Creator,
  Service,
  Application,
  Invitation,
  Project,
  Task,
  Announcement,
  Notification,
  AuditLog,
  HomepageConfig,
} from '@/types';
import {
  INITIAL_PROFILES,
  INITIAL_DEPARTMENTS,
  INITIAL_POSITIONS,
  INITIAL_ROLES,
  INITIAL_PERMISSIONS,
  INITIAL_ARTIST_PROFILES,
  INITIAL_PORTFOLIO_ITEMS,
  INITIAL_CREATORS,
  INITIAL_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_HOMEPAGE_CONFIG,
} from './data-store';

interface VantaContextType {
  // Current Session & Permissions
  currentUser: Profile | null;
  currentRole: Role;
  setCurrentUserById: (userId: string) => void;
  isFounder: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  logout: () => void;

  // Global State Stores
  profiles: Profile[];
  departments: Department[];
  positions: OrganizationalPosition[];
  roles: Role[];
  permissions: Permission[];
  artistProfiles: ArtistProfile[];
  portfolioItems: PortfolioItem[];
  creators: Creator[];
  services: Service[];
  applications: Application[];
  invitations: Invitation[];
  projects: Project[];
  tasks: Task[];
  announcements: Announcement[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  homepageConfig: HomepageConfig;

  // Like System
  userLikes: string[];
  toggleLike: (projectId: string) => void;
  isLiked: (projectId: string) => boolean;

  // Actions
  updateHomepageConfig: (newConfig: Partial<HomepageConfig>) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  moderatePortfolioItem: (id: string, status: PortfolioItem['status'], notes?: string) => void;
  deletePortfolioItem: (id: string) => void;
  toggleFloatingArtwork: (id: string) => void;

  // Artist & Profile Actions
  updateArtistProfile: (userId: string, updates: Partial<ArtistProfile>) => void;
  updateProfile: (userId: string, updates: Partial<Profile>) => void;

  // Recruitment & Invitations
  submitApplication: (app: Omit<Application, 'id' | 'createdAt' | 'status'>) => void;
  moderateApplication: (id: string, status: Application['status'], notes?: string) => void;
  createInvitation: (inv: { email: string; username: string; positionId?: string; departmentId?: string; roleId?: string }) => Invitation;
  acceptInvitation: (token: string, password?: string) => { success: boolean; message: string };

  // Department & Position Actions
  addDepartment: (dept: Omit<Department, 'id' | 'createdAt'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addPosition: (pos: Omit<OrganizationalPosition, 'id' | 'createdAt'>) => void;
  updatePosition: (id: string, updates: Partial<OrganizationalPosition>) => void;

  // Personnel Promotions & Transfers
  promoteStaff: (userId: string, newPositionId: string, notes?: string) => { success: boolean; message: string };
  transferStaff: (userId: string, newDepartmentId: string, notes?: string) => { success: boolean; message: string };

  // Roles & Permissions Builder
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;

  // Creators & Services
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt'>) => void;
  updateCreator: (id: string, updates: Partial<Creator>) => void;
  deleteCreator: (id: string) => void;
  updateService: (id: string, updates: Partial<Service>) => void;

  // Project / Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Announcements
  createAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => void;

  // Audit Logs
  logAuditEvent: (action: string, entityType: string, details: Record<string, unknown>, entityId?: string) => void;
}

const VantaContext = createContext<VantaContextType | undefined>(undefined);

export const VantaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles & Auth State (default: null / unauthenticated visitor)
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  // Organization
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [positions, setPositions] = useState<OrganizationalPosition[]>(INITIAL_POSITIONS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [permissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
  const [artistProfiles, setArtistProfiles] = useState<ArtistProfile[]>(INITIAL_ARTIST_PROFILES);

  // Content & Operations
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO_ITEMS);
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(INITIAL_HOMEPAGE_CONFIG);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate all user changes and active sessions from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('vanta_current_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedItems = localStorage.getItem('vanta_portfolio_items');
      if (storedItems) {
        setPortfolioItems(JSON.parse(storedItems));
      }

      const storedArtists = localStorage.getItem('vanta_artist_profiles');
      if (storedArtists) {
        setArtistProfiles(JSON.parse(storedArtists));
      }

      const storedProfiles = localStorage.getItem('vanta_profiles');
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      }

      const storedConfig = localStorage.getItem('vanta_homepage_config');
      if (storedConfig) {
        setHomepageConfig(JSON.parse(storedConfig));
      }

      const storedCreators = localStorage.getItem('vanta_creators');
      if (storedCreators) {
        setCreators(JSON.parse(storedCreators));
      }

      const storedLikes = localStorage.getItem('vanta_user_likes');
      if (storedLikes) {
        setUserLikes(JSON.parse(storedLikes));
      }
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const toggleLike = (projectId: string) => {
    setUserLikes(prev => {
      const isCurrentlyLiked = prev.includes(projectId);
      const updated = isCurrentlyLiked ? prev.filter(id => id !== projectId) : [...prev, projectId];
      try {
        localStorage.setItem('vanta_user_likes', JSON.stringify(updated));
      } catch {}

      setPortfolioItems(items => {
        const nextItems = items.map(item => {
          if (item.id === projectId) {
            const currentLikes = item.likes || 0;
            return {
              ...item,
              likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
            };
          }
          return item;
        });
        try {
          localStorage.setItem('vanta_portfolio_items', JSON.stringify(nextItems));
        } catch {}
        return nextItems;
      });

      return updated;
    });
  };

  const isLiked = (projectId: string) => userLikes.includes(projectId);

  // Real-time synchronization of applications from cloud API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          if (data.applications && Array.isArray(data.applications)) {
            setApplications(prev => {
              const combined = [...data.applications];
              for (const p of prev) {
                if (!combined.some(c => c.id === p.id || (c.email === p.email && c.createdAt === p.createdAt))) {
                  combined.push(p);
                }
              }
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn('Applications sync note:', err);
      }
    };
    fetchApplications();
    const interval = setInterval(fetchApplications, 8000);
    return () => clearInterval(interval);
  }, []);

  const setCurrentUserById = (userId: string) => {
    const found = profiles.find(p => p.id === userId);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem('vanta_current_user', JSON.stringify(found));
      } catch {}
      logAuditEvent('USER_SWITCHED_SESSION', 'User', { userId, username: found.username }, found.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vanta_current_user');
    } catch {}
  };

  const isFounder = currentUser?.isFounder === true;
  const isAdmin = isFounder || currentUser?.positionTitle === 'Executive Director' || currentUser?.positionTitle === 'Head Manager' || currentUser?.positionTitle === 'Department Head';
  const isArtist = !!artistProfiles.find(a => a.userId === currentUser?.id);

  const currentRole = roles.find(r => {
    if (isFounder) return r.slug === 'founder';
    if (currentUser?.positionTitle === 'Executive Director') return r.slug === 'executive';
    if (currentUser?.positionTitle === 'Department Head') return r.slug === 'department-head';
    return r.slug === 'artist';
  }) || roles[roles.length - 1];

  const logAuditEvent = (action: string, entityType: string, details: Record<string, unknown>, entityId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'anonymous',
      userName: currentUser ? `${currentUser.displayName} (${currentUser.positionTitle || 'Guest'})` : 'Anonymous / System',
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateHomepageConfig = (newConfig: Partial<HomepageConfig>) => {
    setHomepageConfig(prev => {
      const updated = {
        ...prev,
        ...newConfig,
        sectionsVisibility: {
          ...prev.sectionsVisibility,
          ...(newConfig.sectionsVisibility || {}),
        },
      };
      try {
        localStorage.setItem('vanta_homepage_config', JSON.stringify(updated));
      } catch {}
      logAuditEvent('HOMEPAGE_CONFIG_UPDATED', 'HomepageConfig', { changes: newConfig });
      return updated;
    });
  };

  const addPortfolioItem = (itemData: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const shouldBePublic = itemData.status === 'approved' || isFounder;
    const newItem: PortfolioItem = {
      ...itemData,
      id: `p-${Date.now()}`,
      status: isFounder ? 'approved' : (itemData.status || 'submitted'),
      isPublic: shouldBePublic,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };
    setPortfolioItems(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('vanta_portfolio_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('PORTFOLIO_ITEM_SUBMITTED', 'PortfolioItem', { title: newItem.title, artistId: newItem.artistId }, newItem.id);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString().substring(0, 10) } : item));
      try {
        localStorage.setItem('vanta_portfolio_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('PORTFOLIO_ITEM_UPDATED', 'PortfolioItem', updates, id);
  };

  const moderatePortfolioItem = (id: string, status: PortfolioItem['status'], notes?: string) => {
    setPortfolioItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            moderationNotes: notes || item.moderationNotes,
            isPublic: status === 'approved',
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return item;
      });
      try {
        localStorage.setItem('vanta_portfolio_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('PORTFOLIO_MODERATED', 'PortfolioItem', { status, notes }, id);
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      try {
        localStorage.setItem('vanta_portfolio_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('PORTFOLIO_ITEM_DELETED', 'PortfolioItem', { id }, id);
  };

  const toggleFloatingArtwork = (id: string) => {
    setPortfolioItems(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, isFloatingHero: !item.isFloatingHero } : item));
      try {
        localStorage.setItem('vanta_portfolio_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('PORTFOLIO_FLOATING_TOGGLED', 'PortfolioItem', { id }, id);
  };

  const updateArtistProfile = (userId: string, updates: Partial<ArtistProfile>) => {
    setArtistProfiles(prev => {
      const exists = prev.some(p => p.userId === userId);
      let updatedArtists: ArtistProfile[];
      if (!exists) {
        const user = profiles.find(p => p.id === userId) || currentUser;
        const newProfile: ArtistProfile = {
          userId,
          username: user?.username || 'artist',
          displayName: user?.displayName || 'Artist',
          avatarUrl: user?.avatarUrl || '/images/vanta-logo.jpg',
          bio: user?.bio || '',
          specialty: 'Digital Creative',
          yearsExperience: 2,
          bannerUrl: '/images/vanta-welcome-banner.jpg',
          themeMode: 'dark',
          layoutMode: 'grid',
          isFeatured: true,
          isPublic: true,
          availabilityStatus: 'available',
          socialLinks: {},
          displayOrder: prev.length + 1,
          ...updates,
        };
        updatedArtists = [...prev, newProfile];
      } else {
        updatedArtists = prev.map(p => (p.userId === userId ? { ...p, ...updates } : p));
      }
      try {
        localStorage.setItem('vanta_artist_profiles', JSON.stringify(updatedArtists));
      } catch {}
      return updatedArtists;
    });

    // Cascade avatar/name changes to portfolio items authored by this user
    if (updates.avatarUrl || updates.displayName) {
      setPortfolioItems(prev => {
        const updatedWorks = prev.map(item =>
          item.artistId === userId
            ? {
                ...item,
                ...(updates.avatarUrl ? { artistAvatarUrl: updates.avatarUrl } : {}),
                ...(updates.displayName ? { artistDisplayName: updates.displayName } : {}),
              }
            : item
        );
        try {
          localStorage.setItem('vanta_portfolio_items', JSON.stringify(updatedWorks));
        } catch {}
        return updatedWorks;
      });
    }
    logAuditEvent('ARTIST_PROFILE_UPDATED', 'ArtistProfile', updates, userId);
  };

  const updateProfile = (userId: string, updates: Partial<Profile>) => {
    setProfiles(prev => {
      const updatedProfiles = prev.map(p => (p.id === userId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
      try {
        localStorage.setItem('vanta_profiles', JSON.stringify(updatedProfiles));
      } catch {}
      return updatedProfiles;
    });

    if (currentUser?.id === userId) {
      setCurrentUser(prev => {
        const updatedUser = prev ? { ...prev, ...updates } : null;
        try {
          if (updatedUser) {
            localStorage.setItem('vanta_current_user', JSON.stringify(updatedUser));
          }
        } catch {}
        return updatedUser;
      });
    }

    // Cascade avatar/name/bio changes across artist profile and portfolio items
    if (updates.avatarUrl || updates.displayName || updates.bio) {
      setPortfolioItems(prev => {
        const updatedWorks = prev.map(item =>
          item.artistId === userId
            ? {
                ...item,
                ...(updates.avatarUrl ? { artistAvatarUrl: updates.avatarUrl } : {}),
                ...(updates.displayName ? { artistDisplayName: updates.displayName } : {}),
              }
            : item
        );
        try {
          localStorage.setItem('vanta_portfolio_items', JSON.stringify(updatedWorks));
        } catch {}
        return updatedWorks;
      });

      setArtistProfiles(prev => {
        const updatedArtists = prev.map(a =>
          a.userId === userId
            ? {
                ...a,
                ...(updates.avatarUrl ? { avatarUrl: updates.avatarUrl } : {}),
                ...(updates.displayName ? { displayName: updates.displayName } : {}),
                ...(updates.bio ? { bio: updates.bio } : {}),
              }
            : a
        );
        try {
          localStorage.setItem('vanta_artist_profiles', JSON.stringify(updatedArtists));
        } catch {}
        return updatedArtists;
      });
    }
    logAuditEvent('USER_PROFILE_UPDATED', 'Profile', updates, userId);
  };

  const submitApplication = async (appData: Omit<Application, 'id' | 'createdAt' | 'status'>) => {
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setApplications(prev => [newApp, ...prev]);

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData),
      });
    } catch (e) {
      console.warn('Cloud API application submission fallback:', e);
    }

    logAuditEvent('APPLICATION_SUBMITTED', 'Application', { username: newApp.username, email: newApp.email }, newApp.id);
  };

  const moderateApplication = async (id: string, status: Application['status'], notes?: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status, reviewNotes: notes, reviewedBy: currentUser?.displayName } : app))
    );

    try {
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes, reviewedBy: currentUser?.displayName }),
      });
    } catch (e) {
      console.warn('Cloud API moderation fallback:', e);
    }

    logAuditEvent('APPLICATION_MODERATED', 'Application', { status, notes }, id);
  };

  const createInvitation = (invData: { email: string; username: string; positionId?: string; departmentId?: string; roleId?: string }): Invitation => {
    const token = `inv_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    const position = positions.find(p => p.id === invData.positionId);
    const department = departments.find(d => d.id === invData.departmentId);
    const role = roles.find(r => r.id === invData.roleId);

    const newInv: Invitation = {
      id: `inv-${Date.now()}`,
      email: invData.email,
      username: invData.username,
      token,
      positionId: invData.positionId,
      positionTitle: position?.title,
      departmentId: invData.departmentId,
      departmentName: department?.name,
      roleId: invData.roleId,
      roleName: role?.name,
      invitedBy: currentUser?.displayName || 'Founder',
      status: 'pending',
      createdAt: new Date().toISOString().substring(0, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    };

    setInvitations(prev => [newInv, ...prev]);
    logAuditEvent('INVITATION_CREATED', 'Invitation', { email: newInv.email, username: newInv.username, token }, newInv.id);
    return newInv;
  };

  const acceptInvitation = (token: string, password?: string): { success: boolean; message: string } => {
    const inv = invitations.find(i => i.token === token && i.status === 'pending');
    if (!inv) {
      return { success: false, message: 'Invalid or expired invitation token.' };
    }

    const newProfile: Profile = {
      id: `u-${Date.now()}`,
      username: inv.username,
      displayName: inv.username,
      email: inv.email,
      password: password || 'artist2024',
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${inv.username}`,
      bio: `Creative producer in the ${inv.departmentName || 'Creative'} Department.`,
      isFounder: false,
      status: 'active',
      positionId: inv.positionId,
      positionTitle: inv.positionTitle,
      departmentId: inv.departmentId,
      departmentName: inv.departmentName,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };

    const newArtistProfile: ArtistProfile = {
      userId: newProfile.id,
      username: newProfile.username,
      displayName: newProfile.displayName,
      avatarUrl: newProfile.avatarUrl,
      bio: newProfile.bio,
      specialty: inv.departmentName || 'Digital Creative',
      yearsExperience: 2,
      bannerUrl: '/images/vanta-welcome-banner.jpg',
      themeMode: 'dark',
      layoutMode: 'grid',
      isFeatured: false,
      isPublic: true,
      availabilityStatus: 'available',
      socialLinks: {},
      displayOrder: artistProfiles.length + 1,
    };

    setProfiles(prev => {
      const updated = [...prev, newProfile];
      try {
        localStorage.setItem('vanta_profiles', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setArtistProfiles(prev => {
      const updated = [...prev, newArtistProfile];
      try {
        localStorage.setItem('vanta_artist_profiles', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setInvitations(prev =>
      prev.map(i => (i.id === inv.id ? { ...i, status: 'accepted' } : i))
    );

    setCurrentUser(newProfile);
    try {
      localStorage.setItem('vanta_current_user', JSON.stringify(newProfile));
    } catch {}

    logAuditEvent('INVITATION_ACCEPTED', 'User', { username: newProfile.username }, newProfile.id);
    return { success: true, message: 'Welcome to Vanta Production!' };
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'createdAt'>) => {
    const newDept: Department = {
      ...dept,
      id: `d-${Date.now()}`,
      memberCount: 0,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setDepartments(prev => [...prev, newDept]);
    logAuditEvent('DEPARTMENT_CREATED', 'Department', { name: newDept.name }, newDept.id);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    logAuditEvent('DEPARTMENT_UPDATED', 'Department', updates, id);
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    logAuditEvent('DEPARTMENT_DELETED', 'Department', { id }, id);
  };

  const addPosition = (pos: Omit<OrganizationalPosition, 'id' | 'createdAt'>) => {
    const newPos: OrganizationalPosition = {
      ...pos,
      id: `pos-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setPositions(prev => [...prev, newPos]);
    logAuditEvent('POSITION_CREATED', 'Position', { title: newPos.title }, newPos.id);
  };

  const updatePosition = (id: string, updates: Partial<OrganizationalPosition>) => {
    setPositions(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    logAuditEvent('POSITION_UPDATED', 'Position', updates, id);
  };

  const promoteStaff = (userId: string, newPositionId: string, notes?: string): { success: boolean; message: string } => {
    const pos = positions.find(p => p.id === newPositionId);
    if (!pos) return { success: false, message: 'Target position does not exist.' };

    setProfiles(prev => {
      const updated = prev.map(p => {
        if (p.id === userId) {
          return {
            ...p,
            positionId: pos.id,
            positionTitle: pos.title,
            departmentId: pos.departmentId,
            departmentName: pos.departmentName,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return p;
      });
      try {
        localStorage.setItem('vanta_profiles', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAuditEvent('STAFF_PROMOTED', 'Personnel', { userId, newPosition: pos.title, notes }, userId);
    return { success: true, message: `Staff member promoted to ${pos.title}` };
  };

  const transferStaff = (userId: string, newDepartmentId: string, notes?: string): { success: boolean; message: string } => {
    const dept = departments.find(d => d.id === newDepartmentId);
    if (!dept) return { success: false, message: 'Target department does not exist.' };

    setProfiles(prev => {
      const updated = prev.map(p => {
        if (p.id === userId) {
          return {
            ...p,
            departmentId: dept.id,
            departmentName: dept.name,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return p;
      });
      try {
        localStorage.setItem('vanta_profiles', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAuditEvent('STAFF_TRANSFERRED', 'Personnel', { userId, newDepartment: dept.name, notes }, userId);
    return { success: true, message: `Staff member transferred to ${dept.name}` };
  };

  const addRole = (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setRoles(prev => [...prev, newRole]);
    logAuditEvent('ROLE_CREATED', 'Role', { name: newRole.name }, newRole.id);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    logAuditEvent('ROLE_UPDATED', 'Role', updates, id);
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    logAuditEvent('ROLE_DELETED', 'Role', { id }, id);
  };

  const addCreator = (creatorData: Omit<Creator, 'id' | 'createdAt'>) => {
    const newCreator: Creator = {
      ...creatorData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setCreators(prev => {
      const updated = [newCreator, ...prev];
      try {
        localStorage.setItem('vanta_creators', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('CREATOR_ADDED', 'Creator', { name: newCreator.name }, newCreator.id);
  };

  const updateCreator = (id: string, updates: Partial<Creator>) => {
    setCreators(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem('vanta_creators', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('CREATOR_UPDATED', 'Creator', updates, id);
  };

  const deleteCreator = (id: string) => {
    setCreators(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('vanta_creators', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    logAuditEvent('CREATOR_DELETED', 'Creator', { id }, id);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAuditEvent('SERVICE_UPDATED', 'Service', updates, id);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setTasks(prev => [newTask, ...prev]);
    logAuditEvent('TASK_CREATED', 'Task', { title: newTask.title }, newTask.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    logAuditEvent('TASK_UPDATED', 'Task', updates, id);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    logAuditEvent('TASK_DELETED', 'Task', { id }, id);
  };

  const createAnnouncement = (annData: Omit<Announcement, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      authorId: currentUser?.id || 'sys',
      authorName: currentUser?.displayName || 'Administration',
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAuditEvent('ANNOUNCEMENT_BROADCAST', 'Announcement', { title: newAnn.title, scope: newAnn.targetScope }, newAnn.id);
  };

  return (
    <VantaContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentUserById,
        isFounder,
        isAdmin,
        isArtist,
        logout,
        profiles,
        departments,
        positions,
        roles,
        permissions,
        artistProfiles,
        portfolioItems,
        creators,
        services,
        applications,
        invitations,
        projects,
        tasks,
        announcements,
        notifications,
        auditLogs,
        homepageConfig,
        userLikes,
        toggleLike,
        isLiked,
        updateHomepageConfig,
        addPortfolioItem,
        updatePortfolioItem,
        moderatePortfolioItem,
        deletePortfolioItem,
        toggleFloatingArtwork,
        updateArtistProfile,
        updateProfile,
        submitApplication,
        moderateApplication,
        createInvitation,
        acceptInvitation,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addPosition,
        updatePosition,
        promoteStaff,
        transferStaff,
        addRole,
        updateRole,
        deleteRole,
        addCreator,
        updateCreator,
        deleteCreator,
        updateService,
        addTask,
        updateTask,
        deleteTask,
        createAnnouncement,
        logAuditEvent,
      }}
    >
      {children}
    </VantaContext.Provider>
  );
};

export const useVanta = () => {
  const context = useContext(VantaContext);
  if (!context) {
    throw new Error('useVanta must be used within a VantaProvider');
  }
  return context;
};
