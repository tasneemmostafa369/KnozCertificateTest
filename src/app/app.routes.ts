import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCertificate } from './features/create-certificate/create-certificate';
import { CertificatePreview } from './features/certificate-preview/certificate-preview';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(c => c.LoginComponent)
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
        path: 'certificates/create',
        component: CreateCertificate,
        canActivate: [authGuard]
    },
    {
        path: 'certificates/preview',
        component: CertificatePreview,
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
