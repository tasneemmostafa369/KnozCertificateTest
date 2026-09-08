import { Component, inject, OnInit, signal } from '@angular/core';
import { CertificateService } from '../../core/services/certificate-service';
import { RouterLink } from "@angular/router";
import { DatePipe, NgClass } from '@angular/common';
import { DICTIONARY } from '../../core/mock/dictionary';
import QRCode from 'qrcode';
import { LanguageService } from '../../core/services/language-service';
import { LoadingService } from '../../core/services/loading-service';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

import { ClassicCertificate } from './components/classic-certificate/classic-certificate';
import { ElegantCertificate } from './components/elegant-certificate/elegant-certificate';
import { QuranCertificate } from './components/quran-certificate/quran-certificate';

@Component({
  selector: 'app-certificate-preview',
  imports: [
    RouterLink,
    NgClass,
    ClassicCertificate,
    ElegantCertificate,
    QuranCertificate
  ],
  templateUrl: './certificate-preview.html',
  styleUrl: './certificate-preview.css',
})
export class CertificatePreview implements OnInit {
  private readonly certificateService = inject(CertificateService);
  private readonly languageService = inject(LanguageService);
  private readonly loadingService = inject(LoadingService);

  certificate = this.certificateService.getCertificate();
  qrCodeUrl = signal<string>('');

  get templateId(): 'classic' | 'elegant' | 'quran' {
    return this.certificate?.templateId ?? 'classic';
  }

  ngOnInit(): void {
    if (this.certificate?.id) {
      this.generateQrCode(this.certificate.id);
    }
  }

  private generateQrCode(qrData: string): void {
    // Generate QR code asynchronously so it doesn't block rendering
    QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
    }).then(url => {
      this.qrCodeUrl.set(url);
    }).catch(err => {
      console.error('QR Code error:', err);
    });
  }

  get texts(): { [key: string]: string } {
    if (!this.certificate) return DICTIONARY['en'];
    return DICTIONARY[this.certificate.language];
  }

  get direction(): 'rtl' | 'ltr' {
    return this.certificate?.language === 'ar' ? 'rtl' : 'ltr';
  }

  printCertificate(): void {
    setTimeout(() => {
      window.print();
    }, 150);
  }

  async downloadCertificate(): Promise<void> {
    const element = document.getElementById('certificate-download-container');
    if (!element) return;

    this.loadingService.show();

    try {
      // Ensure all web fonts and styles are fully painted before capture
      await new Promise((resolve) => setTimeout(resolve, 500));

      const imgData = await toJpeg(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const elementWidth = element.clientWidth;
      const elementHeight = element.clientHeight;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (elementHeight * pdfWidth) / elementWidth;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.certificate?.studentName ?? 'certificate'}.pdf`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  get pageDirection(): 'rtl' | 'ltr' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  getPageText(key: keyof typeof DICTIONARY.en): string {
    return DICTIONARY[this.currentLanguage][key];
  }
}
