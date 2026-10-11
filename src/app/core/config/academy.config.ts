export interface AcademyConfig {
  nameAr: string;
  nameEn: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  signatureUrl: string;
  signatoryTitleAr: string;
  signatoryTitleEn: string;
  signatoryNameAr?: string;
  signatoryNameEn?: string;
}

export const ACADEMY_CONFIG: AcademyConfig = {
  nameAr: 'أكاديمية كنوز',
  nameEn: 'Knoz Academy',

  logoUrl: '/assets/logo.jpeg',
  primaryColor: '#0F392B',    
  secondaryColor: '#C8A559',  

  signatureUrl: '/assets/Signature.png',
  signatoryTitleAr: 'المدير الأكاديمي',
  signatoryTitleEn: 'Academic Director',
  signatoryNameAr: '',
  signatoryNameEn: '',
};
