import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-bookings',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './bookings.component.html'
})
export class BookingsComponent { }
