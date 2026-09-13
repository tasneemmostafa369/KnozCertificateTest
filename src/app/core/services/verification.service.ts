import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  async verifyCertificate(sspId: string): Promise<any> {
    try {
      const response = await fetch(`/api/verify?sspId=${sspId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificate details');
      }

      const detailsData = await response.json();
      return detailsData;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
}
