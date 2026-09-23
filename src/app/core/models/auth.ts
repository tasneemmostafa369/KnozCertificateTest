export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  appType: number;
}

export interface UserCountry {
  id?: number;
  code?: string;
  flag?: string;
  isoCode?: string;
  name?: string;
  englishName?: string;
}

export interface UserProfile {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  dateOfBirth?: string;
  gender?: number; // 0 = male, 1 = female
  userType?: number;
  image?: string;
  emailConfirmed?: boolean;
  isAdult?: boolean;
  jobTitle?: string | null;
  country?: UserCountry;
  role?: string | string[];
  [key: string]: any;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  record: {
    token: string;
    userInfo?: UserProfile;
    [key: string]: any;
  };
}

