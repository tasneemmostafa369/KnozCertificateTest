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

/**
 * -------------------------------------------------------------
 * 🎓 ACADEMY CONFIGURATION (إعدادات هوية الأكاديمية)
 * -------------------------------------------------------------
 * عدّلي بيانات أي أكاديمية هنا مباشرة في الكود، وستنعكس فوراً
 * على كل شاشات الموقع والشهادات وتصميم التطبيق بدون الحاجة لـ Vercel Environment Variables.
 */
export const ACADEMY_CONFIG: AcademyConfig = {
  // اسم الأكاديمية
  nameAr: 'أكاديمية النيل',
  nameEn: 'Nile Academy',

  // الهوية البصرية (اللوجو والألوان)
  logoUrl: '/assets/logo.jpeg',
  primaryColor: '#1E3A8A',    // اللون الأساسي (الأزرار، القوائم، الشهادات)
  secondaryColor: '#FBBF24',  // اللون الثانوي (الذهبي للإطارات واللمسات الجمالية)

  // بيانات التوقيع في الشهادة
  signatureUrl: '/assets/Signature.png',
  signatoryTitleAr: 'المدير الأكاديمي',
  signatoryTitleEn: 'Academic Director',
  signatoryNameAr: '',
  signatoryNameEn: '',
};
