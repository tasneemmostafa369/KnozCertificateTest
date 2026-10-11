# Academic Certificate Issuance & Management Platform

<div align="center">

  <h1>🎓 Academic Certificate Issuance & Management Platform<br/><span>منظومة إدارة وإصدار الشهادات الأكاديمية</span></h1>

  <p><strong>Enterprise-Grade, White-Label, Real-Time Credential Issuance, Course Auditing & Academic Management Engine for Educational Institutions</strong></p>

  <p>
    <a href="#-part-1-english-documentation">English Documentation</a> &nbsp;•&nbsp;
    <a href="#-الجزء-الثاني-دليل-التوثيق-باللغة-العربية">الوثائق باللغة العربية</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/White--Label-Ready-1E3A8A?style=for-the-badge" alt="White-Label Ready" />
    <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/Architecture-Zoneless_Signals-0F392B?style=for-the-badge" alt="Zoneless Signals" />
    <img src="https://img.shields.io/badge/License-MIT-C8A559?style=for-the-badge" alt="License MIT" />
  </p>

</div>

---

## 📑 Table of Global Contents

- [Part 1: English Documentation](#part-1-english-documentation)
  - [1. Executive Overview](#1-executive-overview)
  - [2. White-Label Branding System](#2-white-label-branding-system)
  - [3. Key Features & Academic Highlights](#3-key-features--academic-highlights)
  - [4. Architecture & Technical Stack](#4-architecture--technical-stack)
  - [5. Reverse Proxy & Security Architecture](#5-reverse-proxy--security-architecture)
  - [6. Project Directory & File Structure](#6-project-directory--file-structure)
  - [7. Getting Started & Installation](#7-getting-started--installation)
  - [8. Production Deployment (Vercel & Self-Hosted)](#8-production-deployment-vercel--self-hosted)
  - [9. Engineering Best Practices & Standards](#9-engineering-best-practices--standards)
  - [10. Product Roadmap](#10-product-roadmap)
  - [11. Contributing & License](#11-contributing--license)

---

# Part 1: English Documentation

## 1. Executive Overview

The **Academic Certificate Issuance & Management Platform** is a high-speed, secure, production-grade management application engineered for **academies, universities, and training institutes**. Its primary mission is to streamline academic administrative workflows: issuing accredited certificates, previewing multi-template graduation designs, monitoring expired course compliances, and generating dynamic, tamper-proof QR verification tokens linking directly to independent verification portals.

Built on **Angular 21** with a **Zoneless Signal-based architecture**, styled with **Tailwind CSS v4**, and backed by an isolated **Serverless / Reverse-Proxy Gateway**, the platform guarantees:
- **Instant White-Label Adaptation:** Complete institution customization (name, logo, brand colors, and academic signature) managed via a single configuration file.
- **Zero API Credential Exposure:** End users and client browsers never see internal authentication tokens, remote server addresses, or database identifiers.
- **Client-Side High-Fidelity Rendering:** Instant vector-accurate PDF generation and high-resolution print exports without overloading upstream servers.
- **Bilingual Fluidity:** Seamless, instantaneous switching between Arabic (RTL) and English (LTR) without page reloads.
- **Multi-Template Prestige Presentation:** Support for Classic, Elegant Gold, and Traditional Quranic certificate templates with adaptive typography.

---

## 2. White-Label Branding System

The platform is designed from the ground up as a turnkey **White-Label Solution**. You can rebrand the entire application for any educational institution in seconds without modifying core components or environment variables.

### Central Configuration File: `src/app/core/config/academy.config.ts`

```typescript
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
  nameAr: 'اسم الأكاديمية بالعربية',
  nameEn: 'Academy Name in English',
  logoUrl: '/assets/logo.jpeg',
  primaryColor: '#1E3A8A',    // Main Brand Color (Buttons, headers, certificates)
  secondaryColor: '#FBBF24',  // Accent Color (Gold trim, highlights, borders)
  signatureUrl: '/assets/Signature.png',
  signatoryTitleAr: 'المدير الأكاديمي',
  signatoryTitleEn: 'Academic Director',
  signatoryNameAr: '',
  signatoryNameEn: '',
};
```

### How It Works:
- **`BrandingService`**: Injects CSS variables (`--brand-primary`, `--brand-secondary`) dynamically into `:root`.
- **Dynamic Assets**: Automatically updates the browser favicon, document title, dashboard navigation headers, and certificate stamps according to the active configuration.
- **Tailwind Integration**: Colors cascade directly through Tailwind CSS v4 `@theme` tokens without rebuilding stylesheets.

---

## 3. Key Features & Academic Highlights

### 📜 1. Multi-Template Certificate Designer & Live Preview
- **Classic Academic Template:** Timeless formal design tailored for general graduation diplomas.
- **Elegant Dark/Gold Template:** Modern luxury layout with high-contrast golden trims for specialized programs.
- **Quranic & Traditional Template:** Intricate Islamic geometric borders designed for Quranic memorization and tajweed accreditations.

### 🖨️ 2. Vector-Accurate Client-Side PDF & Print Engine
- High-fidelity PDF rendering via `jspdf`, `html2canvas`, and `html-to-image`.
- Client-side document assembly eliminates server memory bloat and enables offline printing capabilities.
- Standardized A4 Landscape print stylesheets for zero-margin physical printing.

### 🔍 3. Dynamic QR Code Routing & Tamper Protection
- Every issued certificate includes an automated QR code containing a secure verification token.
- Seamless redirection linking students and employers directly to the dedicated **Verification Portal**.

### 📊 4. Expired Courses Compliance Auditing
- Granular administrative dashboard tracking student enrollments that have exceeded their timeframe.
- Real-time search, multi-column sorting, pagination, and course supervisor status telemetry.

### 🌐 5. Real-Time Localization (RTL / LTR)
- Centralized dictionary covering all UI elements in **Arabic** and **English**.
- Instant document direction switching (`dir="rtl"` / `dir="ltr"`).

---

## 4. Architecture & Technical Stack

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                       |
|                                                                                         |
|   +-----------------------+     +------------------------+     +--------------------+   |
|   | Angular 21 Standalone | --> |   BrandingService      | --> | CertificateService |   |
|   | Components & Signals  |     |  (CSS Var Injection)   |     |  (PDF & QR Engine) |   |
|   +-----------------------+     +------------------------+     +--------------------+   |
+---------------------------------------------------------------------------|-------------+
                                                                            |
                                               Internal Secure Route (/api) |
                                                                            v
+-----------------------------------------------------------------------------------------+
|                           SERVER RUNTIME (Vercel / Node.js)                             |
|                                                                                         |
|       +-------------------------------------------------------------------------+       |
|       | api/proxy.js (Vercel Function)  OR  server.mjs (Express Proxy)          |       |
|       |                                                                         |       |
|       | 1. Read environment variables (Base URL & service credentials)          |       |
|       | 2. Authenticate securely with central academic services                 |       |
|       | 3. Query courses, authentication, and report payloads                   |       |
|       | 4. Return sanitized data to Angular frontend                            |       |
|       +-------------------------------------------------------------------------+       |
+-----------------------------------------------------------------------------------------+
```

### Technical Stack Matrix

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Angular** | `21.2.0` | Standalone components, Zoneless change detection, Signals. |
| **Language & Typings** | **TypeScript** | `~5.9.2` | Strict mode typing for zero runtime surprises. |
| **Styling Engine** | **Tailwind CSS** | `^4.1.12` | Modern styling via `@tailwindcss/postcss` and CSS variables. |
| **Document Processing** | **jsPDF & html2canvas** | `^4.2` / `^1.4` | Client-side vector PDF compilation and image capture. |
| **QR Code Engine** | **QRCode.js** | `^1.5.4` | Dynamic SVG/Canvas token QR generation. |
| **Server Runtime** | **Node.js / Express** | `20+` / `4.18` | Application serving and internal proxy endpoint. |
| **Serverless Engine** | **Vercel Functions** | ES Modules | Edge-ready serverless execution for `/api/proxy`. |

---

## 5. Reverse Proxy & Security Architecture

To eliminate client-side credential exposure and bypass CORS restrictions:
- **No Upstream Leaks:** Browser requests travel exclusively to `/api/proxy/*`.
- **Credential Masking:** Remote endpoints reside solely in server environment variables.
- **Session Protection:** Automated 401 interceptor captures expired JWT tokens and redirects clients securely to `/login`.

---

## 6. Project Directory & File Structure

```
academic-management/
├── api/
│   └── proxy.js                      # Vercel serverless reverse proxy handler
├── public/
│   ├── assets/                       # Brand logo and signature assets
│   └── favicon.ico                   # Browser favicon
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config/
│   │   │   │   └── academy.config.ts # Central White-Label branding configuration
│   │   │   ├── guards/               # Route protection (authGuard, guestGuard)
│   │   │   ├── interceptors/         # Error & loading HTTP interceptors
│   │   │   ├── mock/
│   │   │   │   └── dictionary.ts     # Bilingual dictionary (Arabic / English)
│   │   │   ├── services/
│   │   │   │   ├── branding.service.ts     # Dynamic branding & CSS custom properties
│   │   │   │   ├── certificate.service.ts  # Certificate generation and persistence
│   │   │   │   └── report.service.ts       # Expired courses compliance reporting
│   │   │   └── utils/
│   │   ├── features/
│   │   │   ├── certificate-preview/  # Multi-template certificate canvas & PDF export
│   │   │   ├── certificates-list/    # Historical certificate inventory
│   │   │   ├── create-certificate/   # Certificate generation form
│   │   │   ├── dashboard/            # Administrative KPI summary
│   │   │   ├── expired-courses/      # Compliance audit data table
│   │   │   ├── login/                # Authentication entry point
│   │   │   ├── profile/              # Administrator identity badge
│   │   │   └── settings/             # System and template preferences
│   │   ├── app.config.ts             # Application providers and routing registration
│   │   ├── app.html                  # Shell layout with router-outlet
│   │   ├── app.routes.ts             # Declarative route configuration
│   │   └── app.ts                    # Root standalone component
│   ├── index.html                    # Application HTML shell
│   ├── main.ts                       # Application entry point (Zoneless)
│   └── styles.css                    # Tailwind CSS imports and brand CSS custom properties
├── .env.example                      # Template for required environment variables
├── angular.json                      # Angular workspace configuration
├── package.json                      # Project dependencies and npm scripts
├── server.mjs                        # Production Express server with proxy and static serving
└── tsconfig.json                     # Base TypeScript configuration
```

---

## 7. Getting Started & Installation

### Prerequisites
- **Node.js**: `v20.12.0` or higher
- **npm**: `v10+`
- **Git**

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_ORGANIZATION/academic-management.git
   cd academic-management
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your upstream service configuration in `.env`:
   ```env
   KNOZ_API_BASE_URL=https://your-api-domain.example.com
   ```

4. **Customize Your Branding:**
   Open `src/app/core/config/academy.config.ts` and set your institution's name, logo URL, colors, and signature.

5. **Start Development Server:**
   ```bash
   npm start
   ```
   The portal will run on:
   ```
   http://localhost:3000
   ```

---

## 8. Production Deployment (Vercel & Self-Hosted)

### Deployment Option A: Vercel (Recommended)
1. Push your repository to **GitHub**.
2. Import the project in **[Vercel](https://vercel.com)**.
3. In **Project Settings > Environment Variables**, add:
   - `KNOZ_API_BASE_URL`: Your backend API base URL
4. Click **Deploy**.

### Deployment Option B: Self-Hosted Node.js Server
```bash
npm run build
npm start
```

---

## 9. Engineering Best Practices & Standards

- **Strict Clean Architecture:** Pure Signals for branding tokens; zero hardcoded fallback strings.
- **Fail-Fast Configuration:** Mandatory TypeScript contracts ensure complete institution branding before deployment.
- **Client-Side Offloading:** PDF and image rendering handled purely on the client canvas, protecting server resources.

---

## 10. Product Roadmap

- [ ] Bulk certificate generation via Excel/CSV import.
- [ ] Direct email dispatch of issued certificates to learners.
- [ ] Decentralized cryptographic verification anchors.

---

## 11. Contributing & License

Contributions are welcome via standard Pull Requests.

**License:** Licensed under the **MIT License**. Open source for academic and enterprise use.

---
---

## 📑 فهرس المحتويات العام
- [الجزء الثاني: دليل التوثيق باللغة العربية](#-الجزء-الثاني-دليل-التوثيق-باللغة-العربية)
  - [1. نظرة عامة ورؤية المنصة](#1-نظرة-عامة-ورؤية-المنصة)
  - [2. نظام تخصيص الهوية للمؤسسات (White-Label)](#2-نظام-تخصيص-الهوية-للمؤسسات-white-label)
  - [3. الميزات الرئيسية وإدارة الشهادات](#3-الميزات-الرئيسية-وإدارة-الشهادات)
  - [4. المعمارية الهندسية وحزمة التقنيات](#4-المعمارية-الهندسية-وحزمة-التقنيات)
  - [5. المعمارية الأمنية وخادم البروكسي العكسي](#5-المعمارية-الأمنية-وخادم-البروكسي-العكسي)
  - [6. الهيكل التنظيمي للملفات والمجلدات](#6-الهيكل-التنظيمي-للملفات-والمجلدات)
  - [7. دليل التثبيت والتشغيل المحلي](#7-دليل-التثبيت-والتشغيل-المحلي)
  - [8. إعدادات النشر على السحابة](#8-إعدادات-النشر-على-السحابة)
  - [9. معايير التطوير وجودة الكود](#9-معايير-التطوير-وجودة-الكود)
  - [10. خارطة الطريق والتطوير المستقبلي](#10-خارطة-الطريق-والتطوير-المستقبلي)
  - [11. المساهمة والترخيص](#11-المساهمة-والترخيص)

---

# الجزء الثاني: دليل التوثيق باللغة العربية

## 1. نظرة عامة ورؤية المنصة

**منظومة إدارة وإصدار الشهادات الأكاديمية (Academic Certificate Issuance & Management Platform)** هي منصة ويب مؤسسية متكاملة وفائقة السرعة، صُممت لصالح **الجامعات، الأكاديميات، والمراكز التعليمية والتدريبية**. الهدف الأساسي من المنظومة هو توفير بيئة عمل إدارية متكاملة لإنشاء وتوليد الشهادات الأكاديمية المعتمدة، معاينتها بتصاميم متعددة وراقية، تصديرها كملفات PDF عالية الدقة، وتوليد باركود (QR Code) ذكي يربط كل شهادة مباشرة ببوابة التحقق الإلكتروني المستقلة.

تم بناء المنظومة بالاعتماد على أحدث إصدارات إطار العمل **Angular 21** بنظام **الإشارات التفاعلية (Signals)** وبمعمارية خالية من Zone.js (**Zoneless Architecture**)، مع واجهة بصرية عصرية مبنية بـ **Tailwind CSS v4**، وخادم وسيط آمن لحماية الـ APIs (**Reverse Proxy Gateway**).

### ركائز المنظومة:
- **نظام هوية قابل للتخصيص الكامل (White-Label):** إمكانية ضبط اسم الأكاديمية، شعارها، ألوانها، وتوقيعها المعتمد من ملف كود مركزي واحد في ثوانٍ معدودة.
- **تصدير فوري دون إجهاد السيرفر:** توليد ملفات الـ PDF عالية الدقة وتجهيز الطباعة مباشرة من المتصفح عبر مكتبات معالجة الرسوميات.
- **توليد رموز تحقق ذكية:** ربط كل شهادة صادرة برمز QR آمن يوجه مباشرة لبوابة التحقق المستقلة.
- **متابعة وتدقيق الدورات:** لوحة بيانات متقدمة لمراقبة الدورات منتهية الصلاحية وسجلات التزام الطلاب.
- **دعم كامل للغتين (العربية والإنجليزية):** تبديل فوري بين واجهة RTL و LTR بضغطة زر وبدون إعادة تحميل الصفحة.

---

## 2. نظام تخصيص الهوية للمؤسسات (White-Label)

المنظومة مهيأة كحل متكامل جاهز لإعادة التسمية (**Turnkey White-Label Solution**) لأي مؤسسة تعليمية دون الحاجة لتعديل المكونات البرمجية أو إعدادات السيرفر.

### ملف الإعدادات المركزي: `src/app/core/config/academy.config.ts`

```typescript
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
  nameAr: 'أكاديمية التعليم الحديث',
  nameEn: 'Modern Learning Academy',
  logoUrl: '/assets/logo.jpeg',
  primaryColor: '#1E3A8A',    // اللون الأساسي للأزرار والقوائم والشهادات
  secondaryColor: '#FBBF24',  // اللون الثانوي (الذهبي للإطارات والزخارف)
  signatureUrl: '/assets/Signature.png',
  signatoryTitleAr: 'المدير الأكاديمي',
  signatoryTitleEn: 'Academic Director',
  signatoryNameAr: '',
  signatoryNameEn: '',
};
```

### كيف يعمل النظام برمجياً؟
- تتولى خدمة **`BrandingService`** قراءة هذه القيم وحقن متغيرات CSS مباشرة داخل `:root` (`--brand-primary` و `--brand-secondary`).
- يتغير عنوان الصفحة (`document.title`) وأيقونة الموقع (`favicon`) والترويسة وتوقيع الشهادات تلقائياً بحسب الإعدادات.
- ترتبط ألوان الواجهة تلقائياً بـ Tailwind CSS v4 دون الحاجة لإعادة بناء ملفات الـ CSS يدوياً.

---

## 3. الميزات الرئيسية وإدارة الشهادات

### 📜 1. قوالب شهادات متعددة وراقية
- **القالب الكلاسيكي الأكاديمي (Classic):** تصميم رسمي موثق يناسب الدورات والشهادات الجامعية والمهنية.
- **القالب الملكي الذهبي (Elegant):** تصميم فاخر بلمسات ذهبية متناسقة للبرامج التدريبية المتقدمة.
- **القالب القرآني والإسلامي (Quranic):** إطارات وزخارف إسلامية أصيلة مخصصة لحلقات ودورات القرآن الكريم والتجويد.

### 🖨️ 2. محرك تصدير الـ PDF والطباعة المباشرة
- تصدير متجهي عالي الدقة للشهادة بضغطة زر بصيغة PDF عبر `jspdf` و `html-to-image`.
- إمكانية الطباعة الفيزيائية المباشرة من المتصفح مع ضبط مقاس A4 بالعرض وبدون هوامش مزعجة.

### 🔍 3. الربط الذكي مع بوابة التحقق الإلكتروني
- كل شهادة تحمل باركود توثيق خاص، يوجه مباشرة إلى بوابة التحقق الرسمية للمنظومة للتأكد من مصداقية الوثيقة.

### 📊 4. تدقيق الدورات منتهية الصلاحية (Expired Courses)
- جداول بيانات تفاعلية تدعم البحث والفرز والترقيم لمتابعة الدورات التي تجاوزت مدتها الزمنية ومراجعة حالات المعلمين والمشرفين.

### 🌐 5. دعم كامل لثنائية اللغة والاتجاه (RTL / LTR)
- تحول لحظي وسلس بين العربية والإنجليزية لواجهة الاستخدام بالكامل مع ضبط خطوط (الأميري وتجوّل).

---

## 4. المعمارية الهندسية وحزمة التقنيات

### جدول حزمة التقنيات البرمجية

| المجال | التقنية المستخدمة | الإصدار | الوظيفة والدور الهندسي |
| :--- | :--- | :--- | :--- |
| **إطار عمل الواجهة** | **Angular** | `21.2.0` | مكونات مستقلة (Standalone)، إدارة الحالة عبر الإشارات (Signals)، كشف تغيير بدون Zone.js. |
| **لغة البرمجة** | **TypeScript** | `~5.9.2` | تدقيق صارم لضمان خلو النظام من الأخطاء أثناء التشغيل. |
| **محرك التنسيق** | **Tailwind CSS** | `^4.1.12` | أحدث جيل من تيلويند باستخدام محرك PostCSS وتطبيق متغيرات ألوان المؤسسة التفاعلية. |
| **معالجة المستندات** | **jsPDF & html2canvas** | `^4.2` / `^1.4` | تصدير الشهادات بدقة متناهية على طرف العميل. |
| **توليد الباركود** | **QRCode.js** | `^1.5.4` | رسم وتوليد رموز الاستجابة السريعة للتحقق. |
| **خادم التطوير والإنتاج** | **Express.js / Node.js** | `4.18` / `20+` | خادم لاستضافة التطبيق وتوفير مسار الـ Proxy الآمن. |
| **الدوال السحابية** | **Vercel Serverless** | ES Modules | تشغيل دالة البروكسي الخلفية سحابياً عبر `/api/proxy.js`. |

---

## 5. المعمارية الأمنية وخادم البروكسي العكسي

- **إخفاء السيرفر الداخلي:** كافة الاتصالات تمر عبر مسار موحد `/api/proxy/*`.
- **حماية بيانات الدخول:** الروابط السرية وبيانات الربط تعيش حصراً على السيرفر في ملف `.env`.
- **حارس الجلسات الذكي (`errorInterceptor`):** إنهاء فوري للجلسة عند استقبال كود 401 وإعادة توجيه المستخدم لصفحة تسجيل الدخول.

---

## 6. الهيكل التنظيمي للملفات والمجلدات

```
academic-management/
├── api/
│   └── proxy.js                      # دالة Vercel السحابية للبروكسي الوسيط
├── public/
│   ├── assets/                       # شعار الأكاديمية وصورة التوقيع
│   └── favicon.ico                   # أيقونة الموقع للمتصفح
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config/
│   │   │   │   └── academy.config.ts # إعدادات تخصيص الهوية (White-Label)
│   │   │   ├── guards/               # حراس التوجيه (authGuard و guestGuard)
│   │   │   ├── interceptors/         # معترضات الطلبات وأخطاء 401
│   │   │   ├── mock/                # قاموس النصوص للغتين العربية والإنجليزية
│   │   │   ├── services/
│   │   │   │   ├── branding.service.ts     # خدمة إدارة الهوية وحقن الألوان
│   │   │   │   ├── certificate.service.ts  # خدمة إدارة وحفظ وتوليد الشهادات
│   │   │   │   └── report.service.ts       # خدمة تقارير الدورات المنتهية
│   │   │   └── utils/
│   │   ├── features/
│   │   │   ├── certificate-preview/  # شاشة فحص ومعاينة وتصدير الشهادة (PDF)
│   │   │   ├── certificates-list/    # سجل وقائمة الشهادات الصادرة
│   │   │   ├── create-certificate/   # نموذج إنشاء شهادة جديدة
│   │   │   ├── dashboard/            # لوحة المؤشرات والإحصائيات
│   │   │   ├── expired-courses/      # تقرير الدورات التدريبية المنتهية
│   │   │   ├── login/                # بوابة تسجيل الدخول الآمن
│   │   │   ├── profile/              # الملف التعريفي للمشرف
│   │   │   └── settings/             # الإعدادات واختيار القالب الافتراضي
│   │   ├── app.config.ts             # إعدادات التطبيق وتوفير مسارات التوجيه
│   │   ├── app.html                  # حاوية التوجيه الجذرية
│   │   ├── app.routes.ts             # مسارات التوجيه وحمايتها
│   │   └── app.ts                    # المكون الرئيسي للتطبيق
│   ├── index.html                    # ملف الـ HTML الرئيسي مع خطوط جوجل
│   ├── main.ts                       # نقطة انطلاق التطبيق بدون Zone.js
│   └── styles.css                    # إعدادات Tailwind ومتغيرات الألوان التفاعلية
├── .env.example                      # نموذج استرشادي للمتغيرات البيئية
├── angular.json                      # إعدادات بناء Angular
├── package.json                      # الحزم والتبعيات والأوامر البرمجية
├── server.mjs                        # سيرفر Express للتشغيل المحلي والإنتاج
└── tsconfig.json                     # إعدادات TypeScript العامة
```

---

## 7. دليل التثبيت والتشغيل المحلي

### خطوات التشغيل:

1. **استنساخ المستودع (Clone):**
   ```bash
   git clone https://github.com/YOUR_ORGANIZATION/academic-management.git
   cd academic-management
   ```

2. **تثبيت الحزم التابعة:**
   ```bash
   npm install
   ```

3. **إعداد المتغيرات البيئية:**
   ```bash
   cp .env.example .env
   ```
   ثم ضعي رابط الـ API في ملف `.env`:
   ```env
   KNOZ_API_BASE_URL=https://your-api-domain.example.com
   ```

4. **تخصيص هوية الأكاديمية:**
   عدلي ملف `src/app/core/config/academy.config.ts` وضعي اسم وشعار وألوان وتوقيع المؤسسة التعليمية.

5. **تشغيل خادم التطوير:**
   ```bash
   npm start
   ```
   سيعمل التطبيق محلياً على:
   ```
   http://localhost:3000
   ```

---

## 8. إعدادات النشر على السحابة

### النشر عبر Vercel (موصى به)
1. ارفعي الكود إلى مستودعك على **GitHub**.
2. توجهي إلى **[Vercel](https://vercel.com)** واضغطي **Add New Project**.
3. في قسم **Environment Variables**، أضيفي:
   - **`KNOZ_API_BASE_URL`**: الرابط الأساسي للخدمة
4. اضغطي **Deploy**.

---

## 9. معايير التطوير وجودة الكود

- **معمارية الكود النظيف الصارمة (Strict Clean Architecture):** حقول إجبارية تمنع النشر غير المكتمل (Fail-Fast).
- **إدارة الحالة عبر Signals:** كفاءة وسرعة فائقة دون Zone.js.
- **تصدير مستندات آمن:** حماية ضد ثغرات الحقن ومعالجة رسومية على طرف العميل.

---

## 10. خارطة الطريق والتطوير المستقبلي

- [ ] التوليد المجمع للشهادات عبر رفع ملف Excel/CSV.
- [ ] الإرسال المباشر للشهادات لبريد الطلاب.
- [ ] التوثيق اللامركزي عبر تقنية البلوكتشين.

---

## 11. المساهمة والترخيص

المشروع مرخص تحت رخصة **MIT**. مفتوح المصدر للاستخدام الأكاديمي والمؤسسي.
