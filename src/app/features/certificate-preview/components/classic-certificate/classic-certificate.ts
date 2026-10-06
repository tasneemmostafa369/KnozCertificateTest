import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Certificate } from '../../../../core/models/certificate';
import { BrandingService } from '../../../../core/services/branding.service';

@Component({
  selector: 'app-classic-certificate',
  imports: [DatePipe],
  templateUrl: './classic-certificate.html',
})
export class ClassicCertificate {
  readonly branding = inject(BrandingService);
  certificate = input.required<Certificate>();
  qrCodeUrl = input.required<string>();
  verificationUrl = input<string>('');
  texts = input.required<{ [key: string]: string }>();
  direction = input.required<'ltr' | 'rtl'>();
}
