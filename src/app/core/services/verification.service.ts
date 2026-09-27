import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  async verifyCertificate(sspId: string): Promise<any> {
    try {
      const response = await fetch(`${window.location.origin}/api/verify?sspId=${sspId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const error = new Error(errData?.error || 'Failed to fetch certificate details') as any;
        error.status = response.status;
        error.isInvalid = errData?.invalid || false;
        throw error;
      }

      const detailsData = await response.json();
      return detailsData;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
}
