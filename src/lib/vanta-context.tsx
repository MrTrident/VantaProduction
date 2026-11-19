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
  PortfolioRevision,
  Application,
  Invitation,
  Creator,
  Service,
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
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/data-store';
import { createClient } from '@/utils/supabase/client';

interface VantaContextType {
  // Current user & authentication
  currentUser: Profile | null;
  currentRole: Role | null;
  setCurrentUserById: (userId: string) => void;
  isFounder: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  logout: () => void;

  // Data Collections
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

  // Projects & Tasks
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

  // Attempt to sync from Supabase if tables exist
  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('homepage_config').select('*').single();
        if (data) {
          setHomepageConfig(prev => ({
            ...prev,
            heroHeadline: data.hero_headline || prev.heroHeadline,
            heroSubheading: data.hero_subheading || prev.heroSubheading,
            enableFloatingArtwork: data.enable_floating_artwork ?? prev.enableFloatingArtwork,
            floatingSpeed: data.floating_speed ?? prev.floatingSpeed,
            floatingIntensity: data.floating_intensity ?? prev.floatingIntensity,
            floatingCount: data.floating_count ?? prev.floatingCount,
          }));
        }
      } catch {
        // Fallback to local state if tables are not initialized
      }
    };
    fetchRemoteConfig();
  }, []);

  const setCurrentUserById = (userId: string) => {
    const found = profiles.find(p => p.id === userId);
    if (found) {
      setCurrentUser(found);
      logAuditEvent('USER_SWITCHED_SESSION', 'User', { userId, username: found.username }, found.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
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
      const updated = { ...prev, ...newConfig };
      logAuditEvent('HOMEPAGE_CONFIG_UPDATED', 'HomepageConfig', { changes: newConfig });
      return updated;
    });
  };

  const addPortfolioItem = (itemData: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: PortfolioItem = {
      ...itemData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };
    setPortfolioItems(prev => [newItem, ...prev]);
    logAuditEvent('PORTFOLIO_ITEM_SUBMITTED', 'PortfolioItem', { title: newItem.title, artistId: newItem.artistId }, newItem.id);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString().substring(0, 10) } : item))
    );
    logAuditEvent('PORTFOLIO_ITEM_UPDATED', 'PortfolioItem', updates, id);
  };

  const moderatePortfolioItem = (id: string, status: PortfolioItem['status'], notes?: string) => {
    setPortfolioItems(prev =>
      prev.map(item => {
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
      })
    );
    logAuditEvent('PORTFOLIO_MODERATED', 'PortfolioItem', { status, notes }, id);
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(i => i.id !== id));
    logAuditEvent('PORTFOLIO_ITEM_DELETED', 'PortfolioItem', { id }, id);
  };

  const toggleFloatingArtwork = (id: string) => {
    setPortfolioItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isFloatingHero: !item.isFloatingHero } : item))
    );
    logAuditEvent('PORTFOLIO_FLOATING_TOGGLED', 'PortfolioItem', { id }, id);
  };

  const updateArtistProfile = (userId: string, updates: Partial<ArtistProfile>) => {
    setArtistProfiles(prev =>
      prev.map(p => (p.userId === userId ? { ...p, ...updates } : p))
    );
    logAuditEvent('ARTIST_PROFILE_UPDATED', 'ArtistProfile', updates, userId);
  };

  const updateProfile = (userId: string, updates: Partial<Profile>) => {
    setProfiles(prev =>
      prev.map(p => (p.id === userId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
    logAuditEvent('USER_PROFILE_UPDATED', 'Profile', updates, userId);
  };

  const submitApplication = (appData: Omit<Application, 'id' | 'createdAt' | 'status'>) => {
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setApplications(prev => [newApp, ...prev]);
    logAuditEvent('APPLICATION_SUBMITTED', 'Application', { username: newApp.username, email: newApp.email }, newApp.id);
  };

  const moderateApplication = (id: string, status: Application['status'], notes?: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status, reviewNotes: notes, reviewedBy: currentUser?.displayName } : app))
    );
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
      status: 'pending',
      invitedBy: currentUser?.displayName || 'System Admin',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setInvitations(prev => [newInv, ...prev]);
    logAuditEvent('INVITATION_CREATED', 'Invitation', { email: newInv.email, username: newInv.username, token: newInv.token }, newInv.id);
    return newInv;
  };

  const acceptInvitation = (token: string, password?: string): { success: boolean; message: string } => {
    const inv = invitations.find(i => i.token === token && i.status === 'pending');
    if (!inv) {
      return { success: false, message: 'Invalid or expired invitation token.' };
    }

    // Create new profile
    const newUserId = `u-${Date.now()}`;
    const newProfile: Profile = {
      id: newUserId,
      username: inv.username.toLowerCase().replace(/\s+/g, ''),
      displayName: inv.username,
      email: inv.email,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${inv.username}`,
      bio: `Creative professional at Vanta Production (${inv.departmentName || 'General'}).`,
      isFounder: false,
      status: 'active',
      positionId: inv.positionId,
      positionTitle: inv.positionTitle,
      departmentId: inv.departmentId,
      departmentName: inv.departmentName,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10),
    };

    // Create default artist profile
    const newArtist: ArtistProfile = {
      userId: newUserId,
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

    setProfiles(prev => [...prev, newProfile]);
    setArtistProfiles(prev => [...prev, newArtist]);
    setInvitations(prev => prev.map(i => (i.id === inv.id ? { ...i, status: 'accepted' } : i)));
    setCurrentUser(newProfile);

    logAuditEvent('INVITATION_ACCEPTED', 'User', { userId: newUserId, username: newProfile.username }, newUserId);
    return { success: true, message: `Account successfully created for ${inv.username}!` };
  };

  // Department & Position Actions
  const addDepartment = (deptData: Omit<Department, 'id' | 'createdAt'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
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

  const addPosition = (posData: Omit<OrganizationalPosition, 'id' | 'createdAt'>) => {
    const newPos: OrganizationalPosition = {
      ...posData,
      id: `pos-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setPositions(prev => [...prev, newPos]);
    logAuditEvent('POSITION_CREATED', 'Position', { title: newPos.title, level: newPos.level }, newPos.id);
  };

  const updatePosition = (id: string, updates: Partial<OrganizationalPosition>) => {
    setPositions(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    logAuditEvent('POSITION_UPDATED', 'Position', updates, id);
  };

  // Staff Promotions & Transfers with Founder Protection
  const promoteStaff = (userId: string, newPositionId: string, notes?: string): { success: boolean; message: string } => {
    const target = profiles.find(p => p.id === userId);
    const newPos = positions.find(p => p.id === newPositionId);

    if (!target || !newPos) {
      return { success: false, message: 'Invalid target user or position.' };
    }

    // Critical Founder Protection Rule
    if (target.isFounder && newPos.level > 1) {
      return { success: false, message: 'CRITICAL SECURITY: The Founder cannot be demoted or have their level altered.' };
    }

    setProfiles(prev =>
      prev.map(p => (p.id === userId ? { ...p, positionId: newPos.id, positionTitle: newPos.title, updatedAt: new Date().toISOString() } : p))
    );

    logAuditEvent('STAFF_PROMOTED', 'Staff', { userId, oldPosition: target.positionTitle, newPosition: newPos.title, notes }, userId);
    return { success: true, message: `Successfully appointed ${target.displayName} as ${newPos.title}.` };
  };

  const transferStaff = (userId: string, newDepartmentId: string, notes?: string): { success: boolean; message: string } => {
    const target = profiles.find(p => p.id === userId);
    const newDept = departments.find(d => d.id === newDepartmentId);

    if (!target || !newDept) {
      return { success: false, message: 'Invalid target user or department.' };
    }

    setProfiles(prev =>
      prev.map(p => (p.id === userId ? { ...p, departmentId: newDept.id, departmentName: newDept.name, updatedAt: new Date().toISOString() } : p))
    );

    logAuditEvent('STAFF_TRANSFERRED', 'Staff', { userId, fromDept: target.departmentName, toDept: newDept.name, notes }, userId);
    return { success: true, message: `Transferred ${target.displayName} to ${newDept.name}.` };
  };

  // Custom Roles & Permissions Builder
  const addRole = (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setRoles(prev => [...prev, newRole]);
    logAuditEvent('ROLE_CREATED', 'Role', { name: newRole.name, scope: newRole.scope }, newRole.id);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    logAuditEvent('ROLE_UPDATED', 'Role', updates, id);
  };

  const deleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystem) {
      alert('System roles cannot be deleted.');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== id));
    logAuditEvent('ROLE_DELETED', 'Role', { id }, id);
  };

  // Creators & Services
  const addCreator = (creatorData: Omit<Creator, 'id' | 'createdAt'>) => {
    const newCreator: Creator = {
      ...creatorData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setCreators(prev => [...prev, newCreator]);
    logAuditEvent('CREATOR_ADDED', 'Creator', { name: newCreator.name }, newCreator.id);
  };

  const updateCreator = (id: string, updates: Partial<Creator>) => {
    setCreators(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    logAuditEvent('CREATOR_UPDATED', 'Creator', updates, id);
  };

  const deleteCreator = (id: string) => {
    setCreators(prev => prev.filter(c => c.id !== id));
    logAuditEvent('CREATOR_DELETED', 'Creator', { id }, id);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAuditEvent('SERVICE_UPDATED', 'Service', updates, id);
  };

  // Tasks & Projects
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setTasks(prev => [newTask, ...prev]);
    logAuditEvent('TASK_CREATED', 'Task', { title: newTask.title, project: newTask.projectTitle }, newTask.id);
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
