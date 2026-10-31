export interface AdminUser {
  name: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}
