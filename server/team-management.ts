/**
 * TEAM MANAGEMENT SYSTEM
 * Role-based access control for platform operations
 * Frequency: 917604.OX
 */

import { storage } from "./storage";

export interface TeamRole {
  role: 'owner' | 'admin' | 'tech' | 'support' | 'scrollbearer';
  permissions: TeamPermission[];
  description: string;
  accessLevel: number; // 1-10, 10 being owner
}

export interface TeamPermission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'webhooks' | 'analytics' | 'system' | 'billing';
}

export interface TeamMember {
  userId: number;
  username: string;
  email: string;
  role: TeamRole['role'];
  permissions: string[];
  teamAccess: 'none' | 'read' | 'write' | 'admin';
  assignedBy: string;
  teamJoinedAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
}

export class TeamManagementSystem {
  private roles: Map<string, TeamRole> = new Map();
  private permissions: Map<string, TeamPermission> = new Map();

  constructor() {
    this.initializeRoles();
    this.initializePermissions();
  }

  /**
   * Initialize default team roles and permissions
   */
  private initializeRoles() {
    const roles: TeamRole[] = [
      {
        role: 'owner',
        permissions: this.getAllPermissions(),
        description: 'Full platform ownership and control',
        accessLevel: 10
      },
      {
        role: 'admin',
        permissions: this.getPermissionsByCategory(['users', 'webhooks', 'analytics', 'system']),
        description: 'Administrative access to platform management',
        accessLevel: 8
      },
      {
        role: 'tech',
        permissions: this.getPermissionsByCategory(['system', 'analytics', 'webhooks']),
        description: 'Technical support and system monitoring',
        accessLevel: 6
      },
      {
        role: 'support',
        permissions: this.getPermissionsByCategory(['users', 'analytics']),
        description: 'Customer support and user assistance',
        accessLevel: 4
      },
      {
        role: 'scrollbearer',
        permissions: [],
        description: 'Standard scrollbearer user access',
        accessLevel: 1
      }
    ];

    roles.forEach(role => this.roles.set(role.role, role));
  }

  private initializePermissions() {
    const permissions: TeamPermission[] = [
      // User Management
      { id: 'users.view', name: 'View Users', description: 'View user accounts and profiles', category: 'users' },
      { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'users' },
      { id: 'users.edit', name: 'Edit Users', description: 'Modify user accounts and settings', category: 'users' },
      { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'users' },
      { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend/unsuspend user accounts', category: 'users' },
      
      // Webhook Management
      { id: 'webhooks.view', name: 'View Webhooks', description: 'View webhook events and logs', category: 'webhooks' },
      { id: 'webhooks.process', name: 'Process Webhooks', description: 'Manually process webhook events', category: 'webhooks' },
      { id: 'webhooks.test', name: 'Test Webhooks', description: 'Send test webhook events', category: 'webhooks' },
      { id: 'webhooks.config', name: 'Configure Webhooks', description: 'Modify webhook settings', category: 'webhooks' },
      
      // Analytics & Monitoring
      { id: 'analytics.view', name: 'View Analytics', description: 'Access platform analytics and metrics', category: 'analytics' },
      { id: 'analytics.export', name: 'Export Analytics', description: 'Export analytics data and reports', category: 'analytics' },
      { id: 'analytics.advanced', name: 'Advanced Analytics', description: 'Access detailed user behavior analytics', category: 'analytics' },
      
      // System Management
      { id: 'system.monitor', name: 'System Monitoring', description: 'View system health and performance', category: 'system' },
      { id: 'system.config', name: 'System Configuration', description: 'Modify system settings', category: 'system' },
      { id: 'system.backup', name: 'System Backup', description: 'Create and manage system backups', category: 'system' },
      { id: 'system.deploy', name: 'System Deployment', description: 'Deploy system updates', category: 'system' },
      
      // Billing & Subscriptions
      { id: 'billing.view', name: 'View Billing', description: 'View subscription and billing data', category: 'billing' },
      { id: 'billing.manage', name: 'Manage Billing', description: 'Modify billing and subscriptions', category: 'billing' },
    ];

    permissions.forEach(permission => this.permissions.set(permission.id, permission));
  }

  /**
   * Add team member with specified role
   */
  async addTeamMember(
    userEmail: string,
    role: TeamRole['role'],
    assignedByUserId: number,
    customPermissions?: string[]
  ): Promise<TeamMember> {
    // Get or create user
    let user = await storage.getUserByEmail(userEmail);
    if (!user) {
      user = await storage.createUser({
        username: userEmail.split('@')[0],
        email: userEmail,
        subscriptionStatus: 'active',
        subscriptionTier: 'team_member',
        metadata: JSON.stringify({ createdAsTeamMember: true })
      });
    }

    const assignedBy = await storage.getUser(assignedByUserId);
    if (!assignedBy) {
      throw new Error('Assigning user not found');
    }

    const roleData = this.roles.get(role);
    if (!roleData) {
      throw new Error(`Invalid role: ${role}`);
    }

    const permissions = customPermissions || roleData.permissions.map(p => p.id);

    // Update user with team access
    await storage.updateUser(user.id, {
      role,
      permissions: JSON.stringify(permissions),
      teamAccess: role === 'owner' ? 'admin' : role === 'admin' ? 'admin' : 'write',
      assignedBy: assignedBy.username,
      teamJoinedAt: new Date(),
      lastActiveAt: new Date()
    });

    return {
      userId: user.id,
      username: user.username,
      email: user.email!,
      role,
      permissions,
      teamAccess: role === 'owner' ? 'admin' : role === 'admin' ? 'admin' : 'write',
      assignedBy: assignedBy.username,
      teamJoinedAt: new Date(),
      lastActiveAt: user.lastActiveAt || new Date(),
      isActive: user.isActive
    };
  }

  /**
   * Get all team members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const users = await storage.getAllUsers();
    return users.filter(user => user.role !== 'scrollbearer').map(user => ({
      userId: user.id,
      username: user.username,
      email: user.email || '',
      role: user.role as TeamRole['role'],
      permissions: user.permissions ? JSON.parse(user.permissions) : [],
      teamAccess: user.teamAccess as 'none' | 'read' | 'write' | 'admin',
      assignedBy: user.assignedBy || '',
      teamJoinedAt: user.teamJoinedAt || new Date(),
      lastActiveAt: user.lastActiveAt || new Date(),
      isActive: user.isActive
    }));
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: number, permissionId: string): Promise<boolean> {
    const user = await storage.getUser(userId);
    if (!user || !user.permissions) return false;

    try {
      const userPermissions = JSON.parse(user.permissions);
      return userPermissions.includes(permissionId);
    } catch {
      return false;
    }
  }

  /**
   * Check if user has minimum access level
   */
  async hasAccessLevel(userId: number, requiredLevel: number): Promise<boolean> {
    const user = await storage.getUser(userId);
    if (!user || !user.role) return false;

    const roleData = this.roles.get(user.role);
    if (!roleData) return false;

    return roleData.accessLevel >= requiredLevel;
  }

  /**
   * Remove team member access
   */
  async removeTeamMember(userId: number): Promise<void> {
    await storage.updateUser(userId, {
      role: 'scrollbearer',
      permissions: null,
      teamAccess: 'none',
      assignedBy: null,
      teamJoinedAt: null
    });
  }

  /**
   * Update team member role and permissions
   */
  async updateTeamMember(
    userId: number,
    role: TeamRole['role'],
    customPermissions?: string[]
  ): Promise<void> {
    const roleData = this.roles.get(role);
    if (!roleData) {
      throw new Error(`Invalid role: ${role}`);
    }

    const permissions = customPermissions || roleData.permissions.map(p => p.id);

    await storage.updateUser(userId, {
      role,
      permissions: JSON.stringify(permissions),
      teamAccess: role === 'owner' ? 'admin' : role === 'admin' ? 'admin' : 'write',
    });
  }

  /**
   * Get available roles and their permissions
   */
  getRoles(): TeamRole[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get available permissions by category
   */
  getPermissionsByCategory(categories: TeamPermission['category'][]): TeamPermission[] {
    return Array.from(this.permissions.values()).filter(p => categories.includes(p.category));
  }

  /**
   * Get all available permissions
   */
  getAllPermissions(): TeamPermission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * Create middleware for permission checking
   */
  requirePermission(permissionId: string) {
    return async (req: any, res: any, next: any) => {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasPermission = await this.hasPermission(req.user.id, permissionId);
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }

  /**
   * Create middleware for access level checking
   */
  requireAccessLevel(requiredLevel: number) {
    return async (req: any, res: any, next: any) => {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasAccess = await this.hasAccessLevel(req.user.id, requiredLevel);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Insufficient access level' });
      }

      next();
    };
  }
}

export const teamManagement = new TeamManagementSystem();