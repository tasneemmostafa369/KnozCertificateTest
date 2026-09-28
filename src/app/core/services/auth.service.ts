import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, UserProfile } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  public currentUserProfile = signal<UserProfile | null>(this.getStoredProfile());
  public currentUserFullName = computed(() => this.currentUserProfile()?.fullName || null);

  private getStoredProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore corrupted data
    }
    return null;
  }

  login(credentials: Partial<LoginRequest>): Observable<AuthResponse> {
    const payload: LoginRequest = {
      usernameOrEmail: credentials.usernameOrEmail || '',
      password: credentials.password || '',
      appType: 0
    };

    return this.http.post<AuthResponse>('/api/proxy/Auth/login', payload).pipe(
      tap(response => {
        if (response.status && response.record?.token) {
          localStorage.setItem('token', response.record.token);

          // Get userInfo directly and dynamically from API response
          const rawUserInfo = response.record.userInfo;
          if (rawUserInfo) {
            const profile: UserProfile = {
              ...rawUserInfo,
              gender: rawUserInfo.gender !== undefined ? Number(rawUserInfo.gender) : undefined
            };
            localStorage.setItem('userProfile', JSON.stringify(profile));
            this.currentUserProfile.set(profile);
          }

          this.isAuthenticated.set(true);
        }
      })
    );
  }

  updateProfile(profile: Partial<UserProfile>): void {
    const current = this.currentUserProfile() || {};
    const updated = { ...current, ...profile };
    localStorage.setItem('userProfile', JSON.stringify(updated));
    this.currentUserProfile.set(updated);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    this.currentUserProfile.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
