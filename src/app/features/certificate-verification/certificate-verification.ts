import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from '../../core/services/verification.service';

@Component({
  selector: 'app-certificate-verification',
  imports: [CommonModule],
  templateUrl: './certificate-verification.html'
})
export class CertificateVerificationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private verificationService = inject(VerificationService);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  courseData = signal<any>(null);
  sessions = signal<any[]>([]);

  ngOnInit() {
    const sspId = this.route.snapshot.paramMap.get('sspId');
    if (sspId) {
      this.verify(sspId);
    } else {
      this.error.set('رقم الكورس غير متوفر.');
      this.isLoading.set(false);
    }
  }

  async verify(sspId: string) {
    try {
      this.isLoading.set(true);
      const data = await this.verificationService.verifyCertificate(sspId);
      if (data && data.status && data.record) {
        this.courseData.set(data.record.course);
        this.sessions.set(data.record.sessions || []);
      } else {
        this.error.set('لم يتم العثور على بيانات الشهادة.');
      }
    } catch (err) {
      this.error.set('حدث خطأ أثناء التحقق من الشهادة.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getDayName(dayOfWeek: number): string {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayOfWeek] || '';
  }

  get firstSessionDate(): string | null {
    const s = this.sessions();
    if (!s || s.length === 0) return null;
    return s[0].sessionDate;
  }

  get lastSessionDate(): string | null {
    const s = this.sessions();
    if (!s || s.length === 0) return null;
    return s[s.length - 1].sessionDate;
  }

  currentYear(): number {
    return new Date().getFullYear();
  }
}
