
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
  status?: 'online' | 'offline' | 'idle' | 'typing';
}
