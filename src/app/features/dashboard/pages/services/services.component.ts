import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './services.component.html'
})
export class ServicesComponent { }
