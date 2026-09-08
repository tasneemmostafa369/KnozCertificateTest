import { Injectable, signal } from '@angular/core';
import { Language } from '../mock/dictionary';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'language';

  currentLanguage = signal<Language>(
    (localStorage.getItem(this.storageKey) as Language) || 'en'
  );

  constructor() {

  const language = this.currentLanguage();

  document.documentElement.lang = language;

  document.documentElement.dir =
    language === 'ar'
      ? 'rtl'
      : 'ltr';
}


  setLanguage(language: Language): void {

    this.currentLanguage.set(language);

    localStorage.setItem(
      this.storageKey,
      language
    );

    document.documentElement.lang = language;

    document.documentElement.dir =
      language === 'ar'
        ? 'rtl'
        : 'ltr';
  }


  get direction(): 'rtl' | 'ltr' {

    return this.currentLanguage() === 'ar'
      ? 'rtl'
      : 'ltr';
  }
}
