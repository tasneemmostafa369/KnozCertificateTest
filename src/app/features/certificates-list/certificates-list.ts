import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Certificate } from '../../core/models/certificate';
import { CertificateService } from '../../core/services/certificate-service';
import { DatePipe } from '@angular/common';
import { DICTIONARY, Language } from '../../core/mock/dictionary';
import { LanguageService } from '../../core/services/language-service';
import { LoadingService } from '../../core/services/loading-service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-certificates-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './certificates-list.html',
})
export class CertificatesListComponent implements OnInit {
  private readonly certificateService = inject(CertificateService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  
  certificateToDelete: Certificate | null = null;
  isDeleteModalOpen = false;
  isLogoutModalOpen = false;
  isMobileSidebarOpen = false;
  readonly dictionary = DICTIONARY;
  certificates: Certificate[] = [];

  ngOnInit(): void {
    this.loadingService.show();
    this.certificates = [...this.certificateService.getCertificates()].reverse();
    this.loadingService.hide();
  }

  viewCertificate(certificate: Certificate): void {
    this.loadingService.show();
    this.certificateService.setCertificate(certificate);
    this.router.navigate(['/certificates/preview']).finally(() => {
      this.loadingService.hide();
    });
  }

  openDeleteModal(certificate: Certificate): void {
    this.certificateToDelete = certificate;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.certificateToDelete = null;
  }

  confirmDelete(): void {
    if (!this.certificateToDelete) {
      return;
    }
    this.certificateService.deleteCertificate(this.certificateToDelete.id);
    this.certificates = [...this.certificateService.getCertificates()].reverse();
    this.closeDeleteModal();
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

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
