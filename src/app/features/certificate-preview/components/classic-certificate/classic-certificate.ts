import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Certificate } from '../../../../core/models/certificate';

@Component({
  selector: 'app-classic-certificate',
  imports: [DatePipe],
  templateUrl: './classic-certificate.html',
})
export class ClassicCertificate {
  certificate = input.required<Certificate>();
  qrCodeUrl = input.required<string>();
  texts = input.required<{ [key: string]: string }>();
  direction = input.required<'ltr' | 'rtl'>();
}
