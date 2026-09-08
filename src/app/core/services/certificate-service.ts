import { Injectable } from '@angular/core';
import { Certificate } from '../models/certificate';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  private readonly storageKey = 'certificates';

  private certificate: Certificate | null = null;



  // Selected Certificate

  setCertificate(certificate: Certificate): void {
    this.certificate = certificate;
  }

  getCertificate(): Certificate | null {
    return this.certificate;
  }

  clearCertificate(): void {
    this.certificate = null;
  }


  // Certificate ID

  generateCertificateId(): string {
    const randomNumber = Math.floor(
      10000000 + Math.random() * 90000000
    );

    return `KNOZ${randomNumber}`;
  }

  // LocalStorage

  getCertificates(): Certificate[] {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }


  saveCertificates(
    certificates: Certificate[]
  ): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(certificates)
    );
  }


  // Add Certificate

  addCertificate(
    certificate: Certificate
  ): void {

    const certificates =
      this.getCertificates();

    certificates.push(certificate);

    this.saveCertificates(certificates);
  }



  // Delete Certificate

  deleteCertificate(id: string): void {

    const certificates =
      this.getCertificates();

    const updatedCertificates =
      certificates.filter(
        certificate => certificate.id !== id
      );

    this.saveCertificates(
      updatedCertificates
    );

  }

}
