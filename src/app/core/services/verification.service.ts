import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  async verifyCertificate(sspId: string): Promise<any> {
    try {
      // 1. Call our secure Backend Proxy to login (no credentials passed from frontend)
      const loginRes = await fetch('/api/verification-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // We do NOT send the hardcoded username/password here.
        // We tell the browser to include/receive credentials (cookies).
      });

      if (!loginRes.ok) {
        throw new Error('Failed to authenticate for verification');
      }

      // 2. Fetch course details using our secure Backend Proxy
      // The browser will automatically attach the HttpOnly cookie received from step 1
      const detailsRes = await fetch(`/api/verification-details?sspId=${sspId}`, {
        method: 'GET'
      });

      if (!detailsRes.ok) {
        throw new Error('Failed to fetch certificate details');
      }

      const detailsData = await detailsRes.json();
      return detailsData;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
}
