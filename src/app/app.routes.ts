import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCertificate } from './features/create-certificate/create-certificate';
import { CertificatePreview } from './features/certificate-preview/certificate-preview';
import { SettingsComponent } from './features/settings/settings';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(c => c.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'expired-courses',
        loadComponent: () => import('./features/expired-courses/expired-courses').then(c => c.ExpiredCoursesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'certificates/create',
        component: CreateCertificate,
        canActivate: [authGuard]
    },
    {
        path: 'certificates/preview',
        component: CertificatePreview,
        canActivate: [authGuard]
    },
    {
        path: 'certificates/Verification/:sspId',
        loadComponent: () => import('./features/certificate-verification/certificate-verification').then(c => c.CertificateVerificationComponent)
    },
    {
        path: 'certificates/verification/:sspId',
        loadComponent: () => import('./features/certificate-verification/certificate-verification').then(c => c.CertificateVerificationComponent)
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
