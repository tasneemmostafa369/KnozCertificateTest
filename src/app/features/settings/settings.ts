import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language-service';
import { SettingsService, TemplateId } from '../../core/services/settings.service';
import { DICTIONARY, Language } from '../../core/mock/dictionary';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './settings.html'
})
export class SettingsComponent {
  private readonly languageService = inject(LanguageService);
  private readonly settingsService = inject(SettingsService);

  selectedLanguage: Language = this.languageService.currentLanguage();
  selectedTemplate: TemplateId = this.settingsService.defaultTemplate();
  showSaveToast = signal(false);

  getText(key: keyof typeof DICTIONARY['ar']) {
    return DICTIONARY[this.languageService.currentLanguage()][key];
  }

  get direction() {
    return this.languageService.direction;
  }

  onLanguageChange(lang: Language) {
    this.selectedLanguage = lang;
    this.languageService.setLanguage(lang);
    this.showToast();
  }

  onTemplateChange(template: TemplateId) {
    this.selectedTemplate = template;
    this.settingsService.setDefaultTemplate(template);
    this.showToast();
  }

  private showToast() {
    this.showSaveToast.set(true);
    setTimeout(() => {
      this.showSaveToast.set(false);
    }, 3000);
  }
}
