export interface AdminUser {
  name: string;
  email: string;
  role: string;
  /** Set when signed in against the backend (absent in demo mode) */
  id?: string;
  roleSlug?: string;
  tokens?: { accessToken: string; refreshToken: string };
}
