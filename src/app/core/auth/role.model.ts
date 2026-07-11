export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest'
}

export interface CurrentUser {
  id: number;
  name: string;
  role: Role;
}
