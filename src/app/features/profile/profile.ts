import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language-service';
import { DICTIONARY } from '../../core/mock/dictionary';
import { UserProfile } from '../../core/models/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
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
        fullName: this.authService.currentUserFullName() || 'الطالب',
        userName: 'student',
        email: 'student@knoz.online'
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
    if (g === 1 || g === '1' as any) {
      return this.getText('female');
    }
    if (g === 0 || g === '0' as any) {
      return this.getText('male');
    }
    return this.getText('notSpecified');
  }

  isFemale(): boolean {
    const g = this.userProfile()?.gender;
    return g === 1 || g === '1' as any;
  }

  isMale(): boolean {
    const g = this.userProfile()?.gender;
    return g === 0 || g === '0' as any;
  }

  getCountryDisplay(): string {
    const country = this.userProfile()?.country;
    if (!country) return this.getText('notSpecified');
    let name = country.name || country.englishName || '';
    if (this.currentLanguage === 'ar') {
      if (name.toLowerCase() === 'egypt' || !name) {
        name = 'مصر';
      }
    } else {
      if (name === 'مصر' || !name) {
        name = 'Egypt';
      }
    }
    return name.trim();
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
