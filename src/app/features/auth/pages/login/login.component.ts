import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private router = inject(Router);
    private fb = inject(FormBuilder);

    form!: FormGroup;

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            email: [''],
            password: ['']
        });
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.router.navigate(['/dashboard']);
    }
}
