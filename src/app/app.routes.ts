import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCertificate } from './features/create-certificate/create-certificate';
import { CertificatePreview } from './features/certificate-preview/certificate-preview';
import { SettingsComponent } from './features/settings/settings';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

const redirectToNewVerification = (route: ActivatedRouteSnapshot) => {
    const sspId = route.paramMap.get('sspId') || '';
    if (typeof window !== 'undefined') {
        window.location.replace(`https://knoz-verification.vercel.app/${sspId}`);
    }
    return false;
};

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
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(c => c.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'certificates',
        loadComponent: () => import('./features/certificates-list/certificates-list').then(c => c.CertificatesListComponent),
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
        canActivate: [redirectToNewVerification],
        loadComponent: () => import('./features/certificate-verification/certificate-verification').then(c => c.CertificateVerificationComponent)
    },
    {
        path: 'certificates/verification/:sspId',
        canActivate: [redirectToNewVerification],
        loadComponent: () => import('./features/certificate-verification/certificate-verification').then(c => c.CertificateVerificationComponent)
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
