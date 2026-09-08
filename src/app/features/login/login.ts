import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth';
import { LanguageService } from '../../core/services/language-service';
import { DICTIONARY } from '../../core/mock/dictionary';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" [attr.dir]="direction">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <img class="h-20 w-auto rounded-full shadow-sm" src="/assets/logo.jpeg" alt="Knoz Academy">
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 font-['Tajawal']">
          {{ getText('loginTitle') }}
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            @if (feedbackMessage()) {
              <div class="p-3 rounded-lg text-sm mb-4 text-center font-medium transition-all duration-300 border"
                   [class.bg-green-50]="feedbackType() === 'success'"
                   [class.text-green-700]="feedbackType() === 'success'"
                   [class.border-green-200]="feedbackType() === 'success'"
                   [class.bg-red-50]="feedbackType() === 'error'"
                   [class.text-red-700]="feedbackType() === 'error'"
                   [class.border-red-200]="feedbackType() === 'error'">
                {{ feedbackMessage() }}
              </div>
            }

            <div>
              <label for="usernameOrEmail" class="block text-sm font-medium text-gray-700 font-['Tajawal'] text-start">{{ getText('usernameOrEmail') }}</label>
              <div class="mt-1">
                <input id="usernameOrEmail" formControlName="usernameOrEmail" type="text" required
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-knoz-green focus:border-knoz-green sm:text-sm transition-shadow">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 font-['Tajawal'] text-start">{{ getText('password') }}</label>
              <div class="mt-1">
                <input id="password" formControlName="password" type="password" required
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-knoz-green focus:border-knoz-green sm:text-sm transition-shadow">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="isLoading() || loginForm.invalid"
                      class="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-knoz-gold bg-knoz-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-knoz-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Tajawal']">
                @if (isLoading()) {
                  <svg class="animate-spin h-5 w-5 text-knoz-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ getText('signingIn') }}
                } @else {
                  {{ getText('signIn') }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  loginForm = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  feedbackMessage = signal<string | null>(null);
  feedbackType = signal<'success' | 'error' | null>(null);

  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  get direction(): 'ltr' | 'rtl' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  getText(key: keyof typeof DICTIONARY.en): string {
    return DICTIONARY[this.currentLanguage][key];
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.feedbackMessage.set(null);
    this.feedbackType.set(null);

    const credentials: Partial<LoginRequest> = {
      usernameOrEmail: this.loginForm.value.usernameOrEmail || '',
      password: this.loginForm.value.password || ''
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status) {
          this.feedbackType.set('success');
          this.feedbackMessage.set(res.message || this.getText('loginSuccess'));
          setTimeout(() => {
            this.router.navigate(['/expired-courses']);
          }, 1000);
        } else {
          this.feedbackType.set('error');
          this.feedbackMessage.set(res.message || this.getText('loginFailed'));
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.feedbackType.set('error');
        const msg = err.error?.message || this.getText('loginInvalid');
        this.feedbackMessage.set(msg);
      }
    });
  }
}
