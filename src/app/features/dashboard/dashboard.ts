import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Certificate } from '../../core/models/certificate';
import { CertificateService } from '../../core/services/certificate-service';
import { DatePipe } from '@angular/common';
import { DICTIONARY, Language } from '../../core/mock/dictionary';
import { LanguageService } from '../../core/services/language-service';
import { LoadingService } from '../../core/services/loading-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly certificateService = inject(CertificateService);
  private readonly loadingService =inject(LoadingService);
  private readonly router = inject(Router);
  certificateToDelete: Certificate | null = null;
  isDeleteModalOpen = false;
  isMobileSidebarOpen = false;

  private readonly languageService =
  inject(LanguageService);

readonly dictionary = DICTIONARY;

  certificates: Certificate[] = [];

  ngOnInit(): void {
    this.loadingService.show()
    this.certificates =
      [...this.certificateService.getCertificates()].reverse();
    this.loadingService.hide()
  }

  // view certificate
  viewCertificate(certificate: Certificate): void {
    this.loadingService.show();
    this.certificateService.setCertificate(certificate);

    this.router.navigate(['/certificates/preview']).finally(() => {
      this.loadingService.hide();
    });
  }

  // delete cetificate

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

    this.certificateService.deleteCertificate(
      this.certificateToDelete.id
    );

    this.certificates =
      [...this.certificateService.getCertificates()].reverse();

    this.closeDeleteModal();
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


getText(
  key: keyof typeof DICTIONARY.en
): string {

  return this.dictionary[
    this.currentLanguage
  ][key];

}

}
