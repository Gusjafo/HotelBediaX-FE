import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        RouterLinkActive
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    private router = inject(Router);

    toggleSidenav() {
        this.sidenav.toggle();
    }

    logout() {
        this.router.navigate(['/']);
    }
}
