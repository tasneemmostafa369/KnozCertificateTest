import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Certificate } from '../../../../core/models/certificate';

@Component({
  selector: 'app-elegant-certificate',
  imports: [DatePipe],
  templateUrl: './elegant-certificate.html',
})
export class ElegantCertificate {
  certificate = input.required<Certificate>();
  qrCodeUrl = input.required<string>();
  texts = input.required<{ [key: string]: string }>();
  direction = input.required<'ltr' | 'rtl'>();
}
