export const UserRole = {
  ADMIN: 'Administrator',
  MEMBER: 'Member',
  CLIENT: 'Client',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  photoURL?: string | null;
  status?: string;
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
