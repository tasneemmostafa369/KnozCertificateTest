import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CertificateService } from '../../core/services/certificate-service';
import { LanguageService } from '../../core/services/language-service';
import { DICTIONARY } from '../../core/mock/dictionary';
import { Certificate } from '../../core/models/certificate';
import {  NgClass } from '@angular/common';

@Component({
  selector: 'app-create-certificate',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './create-certificate.html',
  styleUrl: './create-certificate.css',
})
export class CreateCertificate {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly certificateService = inject(CertificateService);
  private readonly languageService = inject(LanguageService);
  selectedTemplate: 'classic' | 'elegant' | 'quran' = 'classic';


  certificateForm = this.fb.nonNullable.group({
    studentName: ['', [Validators.required, Validators.minLength(3)]],
    courseName: ['', [Validators.required, Validators.minLength(2)]],
    language: ['en' as 'ar' | 'en'],
    issueDate: ['']
  })

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state || history.state;
    
    // Default to today's date if accessed directly
    let finalIssueDate = new Date().toISOString().split('T')[0];

    if (state && state.prefillData) {
      const data = state.prefillData;
      
      this.certificateForm.patchValue({
        studentName: data.studentName,
        courseName: data.courseName
      });
      
      if (data.issueDate) {
        finalIssueDate = new Date(data.issueDate).toISOString().split('T')[0];
      }
    }
    
    // Assign the final date strictly in the background
    this.certificateForm.patchValue({ issueDate: finalIssueDate });
  }

  selectTemplate(
  template: 'classic' | 'elegant' | 'quran'
): void {
  this.selectedTemplate = template;
}

  onSubmit(): void {

    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }

    const formValue = this.certificateForm.getRawValue();

    const issueDate = new Date(formValue.issueDate).toISOString();

    const certificate:Certificate = {
      id: this.certificateService.generateCertificateId(),

      studentName: formValue.studentName.trim(),

      courseName: formValue.courseName.trim(),

      issueDate,

      language: formValue.language,

      // template: 'default',
      templateId: this.selectedTemplate,

      signerId: 'signer-001',
    };

    // Save in LocalStorage
    this.certificateService
      .addCertificate(certificate);

    this.certificateService.setCertificate(certificate);

    this.router.navigate(['/certificates/preview']);
  }

  // language

  get currentLanguage(): 'en' | 'ar' {
  return this.languageService.currentLanguage();
}

get direction(): 'ltr' | 'rtl' {
  return this.currentLanguage === 'ar'
    ? 'rtl'
    : 'ltr';
}
getText(key: keyof typeof DICTIONARY.en): string {
  return DICTIONARY[this.currentLanguage][key];
}
}
