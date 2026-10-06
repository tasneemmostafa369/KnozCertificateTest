import { Injectable, inject, signal, computed } from '@angular/core';
import { LanguageService } from './language-service';
import { ACADEMY_CONFIG, AcademyConfig } from '../config/academy.config';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private readonly languageService = inject(LanguageService);

  private readonly configState = signal<AcademyConfig>(ACADEMY_CONFIG);

  readonly academyNameAr = computed(() => this.configState().nameAr);
  readonly academyNameEn = computed(() => this.configState().nameEn);
  readonly logoUrl = computed(() => this.configState().logoUrl);
  readonly signatureUrl = computed(() => this.configState().signatureUrl);
  readonly primaryColor = computed(() => this.configState().primaryColor);
  readonly secondaryColor = computed(() => this.configState().secondaryColor);

  readonly academyName = computed(() => {
    return this.languageService.currentLanguage() === 'ar'
      ? this.configState().nameAr
      : this.configState().nameEn;
  });

  readonly signatoryName = computed(() => {
    return this.languageService.currentLanguage() === 'ar'
      ? (this.configState().signatoryNameAr || '')
      : (this.configState().signatoryNameEn || '');
  });

  readonly signatoryTitle = computed(() => {
    return this.languageService.currentLanguage() === 'ar'
      ? (this.configState().signatoryTitleAr || 'المدير الأكاديمي')
      : (this.configState().signatoryTitleEn || 'Academic Director');
  });

  init(): void {
    const config = this.configState();
    this.applyColors(config.primaryColor, config.secondaryColor);
    this.updateDocumentMeta(config);
  }

  private applyColors(primary: string, secondary: string): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand-primary', primary);
      document.documentElement.style.setProperty('--brand-secondary', secondary);
    }
  }

  private updateDocumentMeta(config: AcademyConfig): void {
    if (typeof document !== 'undefined') {
      const name = this.languageService.currentLanguage() === 'ar' ? config.nameAr : config.nameEn;
      document.title = name;
      const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (favicon && config.logoUrl) {
        favicon.href = config.logoUrl;
      }
    }
  }
}
