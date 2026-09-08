export interface Certificate {
    id: string;
    studentName: string;
    courseName: string;
    issueDate: string;
    language: 'ar' | 'en' ;
    // template: string;
    templateId: 'classic' | 'elegant' | 'quran';
    signerId: string;
}
