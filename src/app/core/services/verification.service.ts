import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  async verifyCertificate(sspId: string): Promise<any> {
    try {
      // 1. Login to get token
      const loginRes = await fetch('https://knoz-api.knoz.online/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usernameOrEmail: "Yahya511",
          password: "Yahya@2026",
          appType: 0
        })
      });

      if (!loginRes.ok) {
        throw new Error('Failed to authenticate for verification');
      }

      const loginData = await loginRes.json();
      const token = loginData?.record?.token;

      if (!token) {
        throw new Error('No token received');
      }

      // 2. Fetch course details
      const detailsRes = await fetch(`https://knoz-api.knoz.online/api/Monitor/Assigned-Student-Course-Details?SSPId=${sspId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
