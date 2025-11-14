export interface AuthUser {
  id_users: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
