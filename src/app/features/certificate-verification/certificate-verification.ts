import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from '../../core/services/verification.service';
import { DICTIONARY, Language } from '../../core/mock/dictionary';

@Component({
  selector: 'app-certificate-verification',
  imports: [CommonModule],
  templateUrl: './certificate-verification.html',
  styles: [`
    @keyframes stamp {
      0% { transform: scale(3) rotate(-20deg); opacity: 0; }
      50% { transform: scale(0.9) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 10px rgba(200, 165, 89, 0.2); }
      50% { box-shadow: 0 0 40px rgba(200, 165, 89, 0.6); }
      100% { box-shadow: 0 0 10px rgba(200, 165, 89, 0.2); }
    }
    .animate-stamp {
      animation: stamp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .animate-glow {
      animation: glow 3s infinite;
    }
    .glass-panel {
      background: rgba(247, 243, 232, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(200, 165, 89, 0.3);
    }
  `]
})
export class CertificateVerificationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private verificationService = inject(VerificationService);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  courseData = signal<any>(null);
  sessions = signal<any[]>([]);

  lang = signal<Language>('ar');
  texts = computed(() => DICTIONARY[this.lang()]);

  ngOnInit() {
    const sspId = this.route.snapshot.paramMap.get('sspId');
    if (sspId) {
      this.verify(sspId);
    } else {
      this.error.set(this.texts()['errorNoCourseId']);
      this.isLoading.set(false);
    }
  }

  toggleLang() {
    this.lang.update(l => l === 'ar' ? 'en' : 'ar');
    // If error state exists, update the message
    if (this.error()) {
      if (this.error() === DICTIONARY['ar']['errorNoCourseId'] || this.error() === DICTIONARY['en']['errorNoCourseId']) {
        this.error.set(this.texts()['errorNoCourseId']);
      } else if (this.error() === DICTIONARY['ar']['errorNotFound'] || this.error() === DICTIONARY['en']['errorNotFound']) {
        this.error.set(this.texts()['errorNotFound']);
      } else {
        this.error.set(this.texts()['errorGeneric']);
      }
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
        this.error.set(this.texts()['errorNotFound']);
      }
    } catch (err) {
      this.error.set(this.texts()['errorGeneric']);
    } finally {
      this.isLoading.set(false);
    }
  }

  getDayName(dayOfWeek: number): string {
    const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return this.lang() === 'ar' ? daysAr[dayOfWeek] || '' : daysEn[dayOfWeek] || '';
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    
    const isAr = this.lang() === 'ar';
    const ampmEn = h >= 12 ? 'PM' : 'AM';
    const ampmAr = h >= 12 ? 'م' : 'ص';
    
    h = h % 12;
    h = h ? h : 12; // 0 becomes 12
    const paddedH = h < 10 ? '0' + h : h.toString();
    
    return isAr ? `${paddedH}:${m} ${ampmAr}` : `${paddedH}:${m} ${ampmEn}`;
  }

  get startDate(): string | null {
    const data = this.courseData();
    if (data && data.subscribeDate) {
      return data.subscribeDate;
    }
    return null;
  }

  get endDate(): string | null {
    const s = this.sessions();
    if (!s || s.length === 0) return null;
    return s[s.length - 1].sessionDate;
  }

  currentYear(): number {
    return new Date().getFullYear();
  }
}
