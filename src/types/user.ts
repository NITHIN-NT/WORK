export enum UserRole {
  OWNER = 'Owner',
  MEMBER = 'Team Member',
  CLIENT = 'Client stakeholder',
  GUEST = 'Guest viewer'
}

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Pending' | 'Deactivated';
  lastSeen?: string;
  companyId?: string; // For Client roles
  avatarUrl?: string;
}
