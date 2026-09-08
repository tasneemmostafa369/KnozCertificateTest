import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { ExpiredCourse } from '../../core/models/course';
import { LanguageService } from '../../core/services/language-service';
import { DICTIONARY } from '../../core/mock/dictionary';

@Component({
  selector: 'app-expired-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './expired-courses.html'
})
export class ExpiredCoursesComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  courses = signal<ExpiredCourse[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  isLoading = signal(false);
  searchQuery = signal('');

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  private searchSubject = new Subject<string>();
  private subscription = new Subscription();

  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  get direction(): 'ltr' | 'rtl' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  getText(key: keyof typeof DICTIONARY.en): string {
    return DICTIONARY[this.currentLanguage][key];
  }

  ngOnInit() {
    this.subscription.add(
      this.searchSubject.pipe(debounceTime(500)).subscribe((searchValue) => {
        this.searchQuery.set(searchValue);
        this.currentPage.set(1);
        this.loadData();
      })
    );
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.isLoading.set(true);
    this.reportService.getExpiredCourses(this.currentPage(), this.pageSize(), this.searchQuery()).subscribe({
      next: (response) => {
        if (response.status && response.record) {
          this.courses.set(response.record.items);
          this.totalCount.set(response.record.totalCount);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  refresh() {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.loadData();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadData();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadData();
    }
  }

  navigateToCertificate(course: ExpiredCourse) {
    this.router.navigate(['/certificates/create'], {
      state: {
        prefillData: {
          studentName: course.studentName,
          courseName: course.planName,
          issueDate: course.endDate,
          sspId: course.sspId
        }
      }
    });
  }
}
