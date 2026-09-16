import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  public currentUserFullName = signal<string | null>(localStorage.getItem('fullName'));

  login(credentials: Partial<LoginRequest>): Observable<AuthResponse> {
    const payload: LoginRequest = {
      usernameOrEmail: credentials.usernameOrEmail || '',
      password: credentials.password || '',
      appType: 0
    };

    return this.http.post<AuthResponse>('https://knoz-api.knoz.online/api/Auth/login', payload).pipe(
      tap(response => {
        if (response.status && response.record?.token) {
          localStorage.setItem('token', response.record.token);
          const fullName = response.record.userInfo?.fullName;
          if (fullName) {
            localStorage.setItem('fullName', fullName);
            this.currentUserFullName.set(fullName);
          }
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    this.currentUserFullName.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
