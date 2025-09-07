import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DestinationService } from '@core/services/destination.service';
import { Destination } from '@core/models/destination.model';
import { DestinationType } from '@core/models/destination-type.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

interface DialogData {
    mode: 'create' | 'edit' | 'view';
    destination?: Destination;
}

@Component({
    selector: 'app-destination-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './destination-dialog.component.html'
})
export class DestinationDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(DestinationService);
    private dialogRef = inject(MatDialogRef<DestinationDialogComponent>);

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    form = this.fb.nonNullable.group({
        id: [0],
        name: ['', Validators.required],
        description: ['', Validators.required],
        countryCode: ['', Validators.required],
        type: ['', Validators.required]
    });

    typeOptions = Object.values(DestinationType);

    get isView() {
        return this.data.mode === 'view';
    }

    loading = false;

    ngOnInit(): void {
        if (this.data.destination) {
            this.form.patchValue(this.data.destination);
        }

        if (this.isView) {
            this.form.disable();
        }
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const value = this.form.getRawValue();
        this.loading = true;
        if (this.data.mode === 'edit' && this.data.destination) {
            value.id = this.data.destination.id;
            this.service
                .update(this.data.destination.id, value)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.dialogRef.close(true);
                });
        } else if (this.data.mode === 'create') {
            this.service
                .create(value)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.dialogRef.close(true);
                });
        }
    }

    close() {
        this.dialogRef.close(false);
    }
}
