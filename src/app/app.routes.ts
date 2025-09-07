import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/auth-layout/auth-layout.component')
            .then(m => m.AuthLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/auth/pages/login/login.component')
                    .then(m => m.LoginComponent)
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layouts/main-layout/main-layout.component')
            .then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/pages/home/home.component')
                    .then(m => m.HomeComponent)
            },
            {
                path: 'destination',
                loadComponent: () =>
                    import('./features/dashboard/pages/destination/destination.component')
                        .then(m => m.DestinationComponent)
            },
            {
                path: 'rooms',
                loadComponent: () =>
                    import('./features/dashboard/pages/rooms/rooms.component')
                        .then(m => m.RoomsComponent)
            },
            {
                path: 'bookings',
                loadComponent: () =>
                    import('./features/dashboard/pages/bookings/bookings.component')
                        .then(m => m.BookingsComponent)
            },
            {
                path: 'services',
                loadComponent: () =>
                    import('./features/dashboard/pages/services/services.component')
                        .then(m => m.ServicesComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
