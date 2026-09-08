export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  appType: number;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  record: {
    token: string;
  };
}
