import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-rooms',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './rooms.component.html'
})
export class RoomsComponent { }
