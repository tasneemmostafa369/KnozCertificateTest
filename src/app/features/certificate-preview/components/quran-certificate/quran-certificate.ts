import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Certificate } from '../../../../core/models/certificate';
import { BrandingService } from '../../../../core/services/branding.service';

@Component({
  selector: 'app-quran-certificate',
  imports: [DatePipe],
  templateUrl: './quran-certificate.html',
})
export class QuranCertificate {
  readonly branding = inject(BrandingService);
  certificate = input.required<Certificate>();
  qrCodeUrl = input.required<string>();
  verificationUrl = input<string>('');
  texts = input.required<{ [key: string]: string }>();
  direction = input.required<'ltr' | 'rtl'>();
}
