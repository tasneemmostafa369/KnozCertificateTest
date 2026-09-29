# 🎓 Knoz Academy — Enterprise Certificate & Academic Management Platform

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.12-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.0.8-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge)

<p align="center">
  <strong>An enterprise-grade, high-performance academic management and certificate issuance platform engineered with Angular 21, reactive signals, secure Reverse Proxy architecture, and dynamic verification workflows.</strong>
</p>

[English Documentation](#-part-1--english-documentation) • [الوثائق باللغة العربية](#-part-2--الوثائق-باللغة-العربية)

</div>

---

## 🇬🇧 Part 1 — English Documentation

### Table of Contents
- [1. Executive Summary & Vision](#1-executive-summary--vision)
- [2. Key Features & Business Highlights](#2-key-features--business-highlights)
- [3. Architecture & Tech Stack](#3-architecture--tech-stack)
- [4. Security & Reverse Proxy Architecture](#4-security--reverse-proxy-architecture)
- [5. Directory & File Structure](#5-directory--file-structure)
- [6. Getting Started & Installation](#6-getting-started--installation)
- [7. Engineering Best Practices & Quality](#7-engineering-best-practices--quality)
- [8. Roadmap & Future Enhancements](#8-roadmap--future-enhancements)
- [9. Contributing & License](#9-contributing--license)

---

### 1. Executive Summary & Vision

**Knoz Academy** is a modern, enterprise-ready web application built to streamline educational operations, report tracking, and certificate generation/verification. Designed with the latest **Angular 21** standalone paradigm and powered by **Angular Signals**, the platform offers:

- **Zero-Trust Security**: Complete masking of upstream APIs using a **Backend-For-Frontend (BFF) / Reverse Proxy** pattern.
- **Bilingual Accessibility**: Instant, reactive RTL/LTR switching between Arabic and English.
- **High-Fidelity Document Generation**: Client-side rendering of cryptographic-grade QR codes, high-resolution certificate previews, and vector PDF exports.
- **Auditable Academic Reports**: Real-time monitoring and reporting of expired courses and learner credentials.

---

### 2. Key Features & Business Highlights

| Feature Module | Business Impact & Technical Implementation |
| :--- | :--- |
| 🔐 **Authentication & Session Lifecycle** | Guard-protected routes (`authGuard`, `guestGuard`) with centralized token revocation via functional HTTP interceptors (`errorInterceptor`). |
| 📜 **Certificate Builder & Live Preview** | Real-time design canvas utilizing reactive forms, instant visual preview (`CertificatePreview`), and dynamic styling. |
| 🖨️ **High-Res PDF & Image Export** | Vector-accurate client exports via `jspdf`, `html2canvas`, and `html-to-image` without taxing server resources. |
| 🔍 **QR Code Verification Routing** | Dynamic generation of verification QR codes linking directly to a decentralized verification portal (`https://knoz-verification.vercel.app/:sspId`). |
| 📊 **Expired Courses Reporting** | Granular data tables with multi-parameter filtering, pagination, and status tracking for academy administrative audits. |
| 🌐 **Bi-directional Internationalization (i18n)** | Seamless Arabic (RTL) and English (LTR) localization powered by a reactive `LanguageService` and dictionary mapping. |
| ⏳ **Non-Blocking UI Feedback** | Integrated loading telemetry via `ngx-spinner` and contextual status alerts. |

---

### 3. Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│  (Angular 21 Standalone + Signals + Tailwind CSS v4)   │
└───────────────────────────┬────────────────────────────┘
                            │ /api/proxy/* (Protected Route)
                            ▼
┌────────────────────────────────────────────────────────┐
│            BFF Layer (Reverse Proxy)                   │
│   • Local Dev: Express Server (server.mjs)             │
│   • Production: Vercel Serverless (api/proxy.js)       │
│   • Secret Injection: process.env.KNOZ_API_BASE_URL    │
└───────────────────────────┬────────────────────────────┘
                            │ https://api.upstream-domain.com
                            ▼
┌────────────────────────────────────────────────────────┐
│               Upstream Knoz API Backend                │
│             (Microservices / REST API)                 │
└────────────────────────────────────────────────────────┘
```

#### Technology Inventory
- **Core Framework**: Angular 21.2 (Zoneless-ready, Standalone Components, Signal State)
- **Language**: TypeScript 5.9.2 (Strict type-checking)
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/postcss`), FontAwesome 7.3
- **Networking & API**: Angular `HttpClient`, RxJS 7.8, Functional Interceptors
- **PDF & Canvas Processing**: `jspdf` 4.2, `html2canvas` 1.4, `html-to-image` 1.11, `qrcode` 1.5
- **BFF / Proxy Middleware**: Node.js, Express 4.18, Vercel Serverless Functions
- **Testing Engine**: Vitest 4.0, JSDOM 28.0

---

### 4. Security & Reverse Proxy Architecture

To safeguard proprietary endpoints and eliminate client-side credential leakage, Knoz Academy applies a **Reverse Proxy / BFF architecture**:

1. **GitHub Leak Prevention**: The base URL (`KNOZ_API_BASE_URL`) is never hardcoded. It resides exclusively in an ignored `.env` file.
2. **Network Tab Masking**: Browsers only communicate with `/api/proxy/*`. The upstream domain and port remain invisible to end-users and malicious actors.
3. **CORS Elimination**: By dispatching requests to the same origin, browser CORS preflight friction is completely eliminated.
4. **Session Guard (`errorInterceptor`)**: Automatically captures `401 Unauthorized` responses across all streams, purges cached JWT credentials, and routes the client to `/login`.

---

### 5. Directory & File Structure

```
knoz-academy/
├── api/                             # Serverless edge runtime functions
│   └── proxy.js                     # Vercel production reverse proxy handler
├── public/                          # Static public web assets
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, interceptors, and guards
│   │   │   ├── guards/              # authGuard, guestGuard
│   │   │   ├── interceptors/        # errorInterceptor (401 catch & redirection)
│   │   │   ├── mock/                # Mock datasets for offline development
│   │   │   ├── models/              # TypeScript contracts and domain interfaces
│   │   │   ├── services/            # AuthService, CertificateService, ReportService, etc.
│   │   │   └── utils/               # Common helper utilities
│   │   ├── features/                # Domain-driven feature modules
│   │   │   ├── certificate-preview/ # Certificate visual inspection canvas
│   │   │   ├── certificates-list/   # Certificate inventory and management
│   │   │   ├── create-certificate/  # Form-driven certificate generation
│   │   │   ├── dashboard/           # Administrative overview metrics
│   │   │   ├── expired-courses/     # Expired courses compliance reporting
│   │   │   ├── login/               # Secure credential entry and validation
│   │   │   ├── profile/             # User settings and credential management
│   │   │   └── settings/            # Academy-wide system preferences
│   │   ├── app.config.ts            # Application providers and routing registration
│   │   ├── app.css                  # Global styles and Tailwind v4 import
│   │   ├── app.html                 # Shell layout with router-outlet & spinner
│   │   ├── app.routes.ts            # Declarative route configuration
│   │   └── app.ts                   # Root application standalone component
│   ├── index.html                   # HTML document root
│   ├── main.ts                      # Application bootstrap entry point
│   └── styles.css                   # Core stylesheet entry
├── .env.example                     # Environment template for secrets
├── angular.json                     # Angular CLI build & workspace configurations
├── package.json                     # Project manifest and dependency matrix
├── server.mjs                       # Local Express development proxy server
├── tsconfig.json                    # Strict TypeScript compiler options
└── vercel.json                      # Vercel edge rewrite rules
```

---

### 6. Getting Started & Installation

#### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+) or `bun`
- **Angular CLI**: `npm install -g @angular/cli@21`

#### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tasneemmostafa369/KnozCertificateTest.git
   cd KnozCertificateTest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Populate your upstream API base URL:
   ```env
   KNOZ_API_BASE_URL=https://api.your-backend-domain.com
   PORT=3000
   ```

4. **Launch Local Development Server:**
   ```bash
   # Starts the Express proxy with Angular compilation
   npm start
   ```
   Navigate to `http://localhost:3000/`.

5. **Execute Unit Tests:**
   ```bash
   npm test
   ```

6. **Production Build:**
   ```bash
   npm run build
   ```
   Compiled distribution files will be generated in `dist/knoz-academy`.

---

### 7. Engineering Best Practices & Quality

- **Reactive State via Signals**: Signals (`signal()`, `computed()`) replace legacy reactive patterns for fine-grained DOM updates without zone overhead.
- **Strict Forms**: Reactive Forms with rigorous validations (`Validators.required`, custom email validators) are used exclusively.
- **AOT & Tree Shaking**: Standalone components enforce complete tree-shaking, producing minimal bundle footprints.
- **Safe HTML & Sanitization**: QR code generation and certificate rendering execute through verified canvas pipelines to prevent XSS vulnerabilities.

---

### 8. Roadmap & Future Enhancements

- [ ] **Batch Certificate Generation**: Bulk upload via CSV/Excel with parallel background PDF generation.
- [ ] **Blockchain Attestation**: Optional cryptographic proof anchoring on decentralized ledgers.
- [ ] **Automated Email Dispatch**: Direct distribution of issued credentials to student inboxes.
- [ ] **Progressive Web App (PWA)**: Offline caching of downloaded certificates with service workers.

---

### 9. Contributing & License

Contributions are restricted to authorized academy contributors.
1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes with conventional messages: `git commit -m 'feat: add bulk verification'`
3. Push to your branch: `git push origin feature/amazing-feature`
4. Open a Pull Request for architectural review.

**License**: Proprietary and confidential. All rights reserved by **Knoz Academy**.

---

<br/>

## 🇸🇦 Part 2 — الوثائق باللغة العربية

### فهرس المحتويات
- [1. الملخص التنفيذي والرؤية](#1-الملخص-التنفيذي-والرؤية)
- [2. الميزات الرئيسية ومجالات العمل](#2-الميزات-الرئيسية-ومجالات-العمل)
- [3. الهيكلية المعمارية والبنية التقنية](#3-الهيكلية-المعمارية-والبنية-التقنية)
- [4. المعمارية الأمنية وخادم البروكسي العكسي](#4-المعمارية-الأمنية-وخادم-البروكسي-العكسي)
- [5. الهيكل التنظيمي للمشروع والملفات](#5-الهيكل-التنظيمي-للمشروع-والملفات)
- [6. دليل التثبيت والتشغيل](#6-دليل-التثبيت-والتشغيل)
- [7. معايير الجودة وأفضل الممارسات الهندسية](#7-معايير-الجودة-وأفضل-الممارسات-الهندسية)
- [8. خارطة الطريق والتطوير المستقبلي](#8-خارطة-الطريق-والتطوير-المستقبلي)
- [9. المساهمة والترخيص](#9-المساهمة-والترخيص)

---

### 1. الملخص التنفيذي والرؤية

منصة **أكاديمية كنوز (Knoz Academy)** هي نظام مؤسسي متكامل صُمم لإدارة السجلات الأكاديمية، متابعة تقارير الدورات، وإصدار وتوثيق الشهادات الرقمية بأعلى معايير الدقة والأمان.

تم بناء المنصة باستخدام أحدث إصدارات إطار العمل **Angular 21** بالاعتماد الكامل على نمط المكونات المستقلة (Standalone Components) وإدارة الحالة التفاعلية عبر (Angular Signals)، مما يوفر:
- **حماية متقدمة للروابط (Zero-Trust API Protection)**: إخفاء تام لخوادم الباك إند عبر خادم وسيط (BFF / Reverse Proxy).
- **تجربة ثنائية اللغة فائقة السلاسة**: دعم فوري وكامل للغتين العربية (RTL) والإنجليزية (LTR).
- **تصدير رقمي عالي الدقة**: توليد فوري لرموز التحقق السريع (QR Code) وتصدير الشهادات بتنسيق PDF دون إجهاد السيرفر.
- **تقارير تدقيق شاملة**: لوحة مخصصة لمراقبة الدورات منتهية الصلاحية وحالات الطلاب.

---

### 2. الميزات الرئيسية ومجالات العمل

| الوحدة الوظيفية | الأثر التقني والتشغيلي |
| :--- | :--- |
| 🔐 **نظام المصادقة وإدارة الجلسات** | حماية المسارات بالحراس البرمجية (`authGuard` و `guestGuard`) مع إنهاء تلقائي للجلسات المنتهية عبر `errorInterceptor`. |
| 📜 **مُنشئ ومعاين الشهادات التفاعلي** | واجهة تفاعلية لتصميم الشهادات مع إمكانية المعاينة الفورية المباشرة قبل الاعتماد. |
| 🖨️ **تصدير فوري للشهادات (PDF & Image)** | تصدير الشهادات كملفات PDF وصور عالية الدقة مباشرة من المتصفح عبر مكتبات `jspdf` و `html2canvas`. |
| 🔍 **نظام التحقق الذكي عبر الـ QR Code** | توليد باركود تفاعلي يوجه مباشرة لمنظومة التحقق المستقلة (`https://knoz-verification.vercel.app/:sspId`). |
| 📊 **تقرير الدورات منتهية الصلاحية** | جداول بيانات متقدمة تدعم الفلترة، والترقيم، والبحث لمساعدة إدارة الأكاديمية في عمليات التدقيق. |
| 🌐 **دعم كامل للغة العربية والاتجاه (RTL)** | تبديل فوري بين العربية والإنجليزية بواسطة خدمة `LanguageService` مع ضبط اتجاه الواجهة بالكامل. |
| ⏳ **مؤشرات تحميل واضحة** | تغذية بصرية فورية للمستخدم أثناء معالجة الطلبات عبر `ngx-spinner`. |

---

### 3. الهيكلية المعمارية والبنية التقنية

```
┌────────────────────────────────────────────────────────┐
│                   متصفح العميل (Client)                 │
│      (Angular 21 Standalone + Signals + Tailwind)      │
└───────────────────────────┬────────────────────────────┘
                            │ طلب محلي: /api/proxy/*
                            ▼
┌────────────────────────────────────────────────────────┐
│             طبقة الخادم الوسيط (Reverse Proxy)          │
│   • أثناء التطوير: خادم Express محلي (server.mjs)       │
│   • في بيئة الإنتاج: دالة Vercel السحابية (proxy.js)    │
│   • جلب الرابط المشفر: process.env.KNOZ_API_BASE_URL    │
└───────────────────────────┬────────────────────────────┘
                            │ اتصال داخلي آمن بالسيرفر الحقيقي
                            ▼
┌────────────────────────────────────────────────────────┐
│               سيرفر الباك إند الحقيقي للأكاديمية        │
│             (Upstream API Services)                    │
└───────────────────────────┴────────────────────────────┘
```

#### جدول التقنيات المستخدمة:
- **إطار العمل الرئيسي**: Angular 21.2 (مكونات مستقلة بالكامل Standalone، وإدارة حالة Signals)
- **لغة البرمجة**: TypeScript 5.9.2 (مع تفعيل أعلى درجات التدقيق الصارم Strict Mode)
- **التصميم وتنسيق الواجهات**: Tailwind CSS v4، ومكتبة الأيقونات FontAwesome 7.3
- **إدارة الشبكة والمصادقة**: `HttpClient`، و RxJS 7.8، و Functional Interceptors
- **معالجة المستندات والـ QR**: `jspdf` 4.2، و `html2canvas` 1.4، و `qrcode` 1.5
- **طبقة الوسيط والحماية**: Node.js، و Express 4.18، و Vercel Serverless Functions
- **منظومة الاختبارات الآلية**: Vitest 4.0، و JSDOM 28.0

---

### 4. المعمارية الأمنية وخادم البروكسي العكسي

حرصاً على سرية البنية التحتية لمنظومة الأكاديمية، يعتمد المشروع نمط **BFF (Backend-For-Frontend)**:

1. **حماية الروابط من التسريب على GitHub**:
   - لا يوجد أي رابط للسيرفر الحقيقي داخل ملفات الكود المرفوعة.
   - الرابط الحقيقي يتم تخزينه حصراً في ملف `.env` المشفر والمستبعد تماماً عبر `.gitignore`.
2. **إخفاء السيرفر داخل المتصفح (Network Tab)**:
   - كافة طلبات الـ HTTP تذهب إلى مسار موحد وآمن هو `/api/proxy/*`.
   - لا يستطيع المستخدم أو المهاجم معرفة عنوان IP أو دومين السيرفر الحقيقي.
3. **معالجة أخطاء CORS جذرياً**:
   - نظراً لأن المتصفح يرسل الطلبات لنفس النطاق (Same-Origin)، تختفي مشاكل تعارض النطاقات نهائياً.
4. **حارس الجلسات (`errorInterceptor`)**:
   - عند انتهاء صلاحية التوكن واستلام كود `401 Unauthorized`، يقوم فوراً بإنهاء الجلسة وتوجيه المستخدم لصفحة الدخول `/login`.

---

### 5. الهيكل التنظيمي للمشروع والملفات

```
knoz-academy/
├── api/                             # دوال السيرفر السحابية في بيئة الإنتاج
│   └── proxy.js                     # البروكسي الوسيط الخاص بمنصة Vercel
├── public/                          # الملفات العامة والثابتة (الصور والأيقونات)
├── src/
│   ├── app/
│   │   ├── core/                    # الخدمات المركزية والحراس والمعترضات
│   │   │   ├── guards/              # حراس التوجيه (authGuard و guestGuard)
│   │   │   ├── interceptors/        # معترضات الطلبات (errorInterceptor للتعامل مع 401)
│   │   │   ├── mock/                # بيانات وهمية للاختبار والتطوير المنفصل
│   │   │   ├── models/              # عقود البيانات وواجهات TypeScript (Interfaces)
│   │   │   ├── services/            # خدمات البيانات (Auth, Certificate, Report, Language)
│   │   │   └── utils/               # دوال المساعدة العامة
│   │   ├── features/                # وحدات النظام وشاشات المستخدم الرئيسية
│   │   │   ├── certificate-preview/ # شاشة فحص ومعاينة الشهادة
│   │   │   ├── certificates-list/   # قائمة وسجل الشهادات المصدرة
│   │   │   ├── create-certificate/  # نموذج إنشاء وتوليد شهادة جديدة
│   │   │   ├── dashboard/           # لوحة التحكم والإحصائيات العامة
│   │   │   ├── expired-courses/     # تقرير الدورات التدريبية منتهية الصلاحية
│   │   │   ├── login/               # بوابة تسجيل الدخول الآمن
│   │   │   ├── profile/             # الملف الشخصي وإعدادات الحساب
│   │   │   └── settings/            # الإعدادات العامة للنظام
│   │   ├── app.config.ts            # تهيئة مزودات الخدمة والتوجيه في Angular
│   │   ├── app.css                  # التنسيقات العامة واستيراد Tailwind v4
│   │   ├── app.html                 # الهيكل العام للتطبيق مع شاشة التحميل والموجه
│   │   ├── app.routes.ts            # جدول توجيه المسارات وحمايتها
│   │   └── app.ts                   # المكون الأساسي للتطبيق (Root Component)
│   ├── index.html                   # ملف الـ HTML الأساسي
│   ├── main.ts                      # نقطة الإقلاع وبدء تشغيل التطبيق
│   └── styles.css                   # ملف الأنماط الأساسي
├── .env.example                     # نموذج استرشادي للمتغيرات البيئية
├── angular.json                     # إعدادات البناء وأوامر Angular CLI
├── package.json                     # سجل الاعتماديات وحزم المشروع
├── server.mjs                       # خادم Express الوسيط للبيئة المحلية
├── tsconfig.json                    # إعدادات مترجم TypeScript الصارمة
└── vercel.json                      # قواعد توجيه مسارات Vercel
```

---

### 6. دليل التثبيت والتشغيل

#### المتطلبات الأساسية
- **Node.js**: إصدار `v20.x` أو `v22.x` (يفضل إصدار الدعم الطويل LTS).
- **مدير الحزم**: `npm` (الإصدار 10 وما بعده) أو `bun`.
- **أداة Angular CLI**:
  ```bash
  npm install -g @angular/cli@21
  ```

#### خطوات التشغيل خطوة بخطوة

1. **استنساخ المستودع (Clone):**
   ```bash
   git clone https://github.com/tasneemmostafa369/KnozCertificateTest.git
   cd KnozCertificateTest
   ```

2. **تثبيت حزم المشروع:**
   ```bash
   npm install
   ```

3. **إعداد المتغيرات البيئية:**
   قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع:
   ```bash
   cp .env.example .env
   ```
   ثم حدد رابط السيرفر المشفر:
   ```env
   KNOZ_API_BASE_URL=https://api.your-backend-domain.com
   PORT=3000
   ```

4. **تشغيل بيئة التطوير المحلية:**
   ```bash
   npm start
   ```
   افتح المتصفح وتوجه إلى: `http://localhost:3000/`.

5. **تشغيل الاختبارات البرمجية:**
   ```bash
   npm test
   ```

6. **بناء المشروع للإنتاج (Production Build):**
   ```bash
   npm run build
   ```
   سيتم تجهيز ملفات الإنتاج النهائية المضغوطة داخل مجلد `dist/knoz-academy`.

---

### 7. معايير الجودة وأفضل الممارسات الهندسية

- **الاعتماد الكلي على Signals**: يتم إدارة البيانات التفاعلية من خلال `signal()` و `computed()` مما يضمن تحديث أجزاء الصفحة المطلوبة فقط دون إهدار موارد الجهاز.
- **النماذج التفاعلية الصارمة (Reactive Forms)**: كافة النماذج مدعمة بفلاتر تدقيق وحماية لمنع إدخال بيانات غير مكتملة أو غير صالحة.
- **عزل المكونات (Standalone Paradigm)**: إلغاء الـ NgModules القديمة لتقليل حجم ملفات الجافاسكريبت وتحسين سرعة التحميل الأولى.
- **معايير الأمان ضد الـ XSS**: يتم فحص وتمرير نصوص الشهادات ورموز الـ QR عبر طبقات حماية مخصصة في Canvas.

---

### 8. خارطة الطريق والتطوير المستقبلي

- [ ] **إصدار الشهادات المجمع (Bulk Generation)**: إمكانية رفع ملف إكسل وإصدار مئات الشهادات دفعة واحدة في الخلفية.
- [ ] **التوثيق الرقمي عبر البلوكتشين (Blockchain Verification)**: إضافة طبقة توثيق لامركزية غير قابلة للتزوير.
- [ ] **الإرسال التلقائي عبر البريد الإلكتروني**: تسليم الشهادات فور إصدارها مباشرة لبريد الطالب.
- [ ] **تطبيق ويب تقدمي (PWA)**: إمكانية حفظ واستعراض الشهادات المصدرة بدون اتصال بالإنترنت.

---

### 9. المساهمة والترخيص

المساهمات البرمجية مخصصة لفريق عمل ومطوري أكاديمية كنوز:
1. أنشئ فرعاً جديداً للخاصية: `git checkout -b feature/new-capability`
2. دوّن التعديلات برسائل واضحة: `git commit -m 'feat: enhance certificate preview'`
3. ارفع التعديلات للفرع: `git push origin feature/new-capability`
4. افتح طلب دمج (Pull Request) للمراجعة المعمارية.

**حقوق النشر والترخيص**: جميع الحقوق محفوظة لـ **أكاديمية كنوز (Knoz Academy)** © 2026. الاستخدام مقتصر على الأغراض المصرح بها رسمياً.
