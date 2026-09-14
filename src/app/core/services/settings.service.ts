import { Injectable, signal } from '@angular/core';

export type TemplateId = 'classic' | 'elegant' | 'quran';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly templateKey = 'default_template';

  defaultTemplate = signal<TemplateId>(
    (localStorage.getItem(this.templateKey) as TemplateId) || 'classic'
  );

  setDefaultTemplate(templateId: TemplateId): void {
    this.defaultTemplate.set(templateId);
    localStorage.setItem(this.templateKey, templateId);
  }
}
