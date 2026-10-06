import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language-service';
import { BrandingService } from '../../core/services/branding.service';
import { DICTIONARY } from '../../core/mock/dictionary';
import { UserProfile } from '../../core/models/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  readonly branding = inject(BrandingService);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);

  userProfile = signal<UserProfile | null>(null);
  isMobileSidebarOpen = signal<boolean>(false);
  isLogoutModalOpen = signal<boolean>(false);

  imageLoadFailed = signal<boolean>(false);

  ngOnInit(): void {
    const profile = this.authService.currentUserProfile();
    if (profile) {
      this.userProfile.set(profile);
    } else {
      // Fallback
      this.userProfile.set({
        fullName: this.authService.currentUserFullName() || 'المشرف',
        userName: 'admin',
        email: 'admin@knoz.online'
      });
    }
  }

  get currentLanguage() {
    return this.languageService.currentLanguage();
  }

  get direction() {
    return this.languageService.direction;
  }

  getText(key: keyof typeof DICTIONARY.ar): string {
    return DICTIONARY[this.currentLanguage][key];
  }

  getGenderLabel(): string {
    const g = this.userProfile()?.gender;
    if (g === 1) {
      return this.getText('female');
    }
    if (g === 0) {
      return this.getText('male');
    }
    return this.getText('notSpecified');
  }

  isFemale(): boolean {
    return this.userProfile()?.gender === 1;
  }

  isMale(): boolean {
    return this.userProfile()?.gender === 0;
  }

  getCountryDisplay(): string {
    const country = this.userProfile()?.country;
    if (!country) return this.getText('notSpecified');

    if (this.currentLanguage === 'ar') {
      return (country.name || country.englishName || this.getText('notSpecified')).trim();
    }
    return (country.englishName || country.name || this.getText('notSpecified')).trim();
  }

  getFormattedPhoneNumber(): string {
    const profile = this.userProfile();
    if (!profile || !profile.phoneNumber) {
      return this.getText('notSpecified');
    }
    const code = profile.phoneCountryCode || profile.country?.code || '';
    if (code && !profile.phoneNumber.startsWith('+')) {
      return `${code} ${profile.phoneNumber}`;
    }
    return profile.phoneNumber;
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout(): void {
    this.authService.logout();
  }

  getInitials(name?: string): string {
    if (!name) return 'K';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
}
