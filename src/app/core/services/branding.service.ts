import { Injectable, inject, signal, computed } from '@angular/core';
import { LanguageService } from './language-service';
import { ACADEMY_CONFIG, AcademyConfig } from '../config/academy.config';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private readonly languageService = inject(LanguageService);

  private readonly config = signal<AcademyConfig>(ACADEMY_CONFIG);

  readonly nameAr = computed(() => this.config().nameAr);
  readonly nameEn = computed(() => this.config().nameEn);
  readonly academyNameAr = computed(() => this.config().nameAr);
  readonly academyNameEn = computed(() => this.config().nameEn);
  readonly logoUrl = computed(() => this.config().logoUrl);
  readonly primaryColor = computed(() => this.config().primaryColor);
  readonly secondaryColor = computed(() => this.config().secondaryColor);
  readonly signatureUrl = computed(() => this.config().signatureUrl);

  // اسم الأكاديمية التفاعلي حسب اللغة الحالية
  readonly academyName = computed(() => {
    return this.languageService.currentLanguage() === 'ar'
      ? this.nameAr()
      : this.nameEn();
  });

  // مسمى التوقيع حسب اللغة الحالية
  readonly signatoryTitle = computed(() => {
    return this.languageService.currentLanguage() === 'ar'
      ? this.config().signatoryTitleAr
      : this.config().signatoryTitleEn;
  });

  // اسم صاحب التوقيع (الحقل الاختياري الوحيد)
  readonly signatoryName = computed(() => {
    const cfg = this.config();
    return this.languageService.currentLanguage() === 'ar'
      ? (cfg.signatoryNameAr ?? '')
      : (cfg.signatoryNameEn ?? '');
  });

  // تهيئة وتطبيق الهوية عند بدء التطبيق
  init(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--brand-primary', this.primaryColor());
    root.style.setProperty('--brand-secondary', this.secondaryColor());

    // تحديث عنوان التبويب
    document.title = this.academyName();

    // تحديث الأيقونة المصغرة (Favicon)
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = this.logoUrl();
  }
}
