import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CertificateService } from '../../core/services/certificate-service';
import { DICTIONARY, Language } from '../../core/mock/dictionary';
import { LanguageService } from '../../core/services/language-service';
import { LoadingService } from '../../core/services/loading-service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly certificateService = inject(CertificateService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  
  isMobileSidebarOpen = false;
  isLogoutModalOpen = false;
  readonly dictionary = DICTIONARY;

  totalCertificates = signal(0);
  uniqueCourses = signal(0);
  uniqueStudents = signal(0);
  
  get currentUserFullName(): string {
    return this.authService.currentUserFullName() || '';
  }

  ngOnInit(): void {
    setTimeout(() => this.loadingService.show(), 0);
    
    const certs = this.certificateService.getCertificates();
    this.totalCertificates.set(certs.length);
    
    // Calculate unique courses based on generated certificates
    const uniqueCourseNames = new Set(certs.map(c => c.courseName.trim().toLowerCase()));
    this.uniqueCourses.set(uniqueCourseNames.size);

    // Calculate unique students based on generated certificates
    const uniqueStudentNames = new Set(certs.map(c => c.studentName.trim().toLowerCase()));
    this.uniqueStudents.set(uniqueStudentNames.size);
    
    setTimeout(() => this.loadingService.hide(), 0);
  }

  // sidebar
  openMobileSidebar(): void {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  // language
  get currentLanguage(): Language {
    return this.languageService.currentLanguage();
  }

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  getText(key: keyof typeof DICTIONARY.en): string {
    return this.dictionary[this.currentLanguage][key];
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeLogoutModal();
  }
}
