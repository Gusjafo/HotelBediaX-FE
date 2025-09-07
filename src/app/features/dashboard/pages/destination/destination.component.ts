import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DestinationService } from '@core/services/destination.service';
import { Destination } from '@core/models/destination.model';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DestinationDialogComponent } from '../destination-dialog/destination-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, finalize, EMPTY, catchError } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PAGE_SIZE_OPTIONS } from '@shared/constants/constants';


@Component({
    selector: 'app-destination',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        ScrollingModule,
        MatSortModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './destination.component.html'
})
export class DestinationComponent implements OnInit, OnDestroy {
    private service = inject(DestinationService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    columns = ['id', 'name', 'description', 'countryCode', 'type', 'updatedDate', 'actions'];
    data: Destination[] = [];

    loading = false;

    total = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = PAGE_SIZE_OPTIONS;
    filterControl = new FormControl('');
    private destroy$ = new Subject<void>();

    sortActive = 'id';
    sortDirection: 'asc' | 'desc' = 'asc';

    ngOnInit(): void {
        this.loadData();
        this.filterControl.valueChanges
            .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.destroy$))
            .subscribe(() => {
                this.pageIndex = 0;
                this.loadData();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private handleError = (message: string) => (error: any) => {
        console.error(error);
        this.snackBar.open(message, 'close', { duration: 3000 });
        return EMPTY;
    };

    loadData(event?: PageEvent) {
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
        }

        this.loading = true;
        this.service
            .getAll(this.filterControl.value ?? '', this.pageIndex + 1, this.pageSize, this.sortActive, this.sortDirection)
            .pipe(
                catchError(this.handleError('Error loading destinations')),
                finalize(() => (this.loading = false))
            )
            .subscribe(res => {
                this.data = res.content;
                this.total = res.totalElements;
            });
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction === '' ? 'asc' : event.direction;

        this.loadData();
    }

    newDestination() {
        const dialogRef = this.dialog.open(DestinationDialogComponent, {
            data: { mode: 'create' },
            width: '400px',
            maxWidth: '90vw'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.snackBar.open('Destination created successfully', 'close', { duration: 3000 });
                this.loadData();
            }
        });
    }

    view(el: Destination) {
        this.dialog.open(DestinationDialogComponent, {
            data: { mode: 'view', destination: el },
            width: '400px',
            maxWidth: '90vw'
        });
    }

    edit(el: Destination) {
        const dialogRef = this.dialog.open(DestinationDialogComponent, {
            data: { mode: 'edit', destination: el },
            width: '400px',
            maxWidth: '90vw'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.snackBar.open('Destination edited successfully', 'close', { duration: 3000 });
                this.loadData();
            }
        });
    }

    remove(el: Destination) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Destination',
                message: 'Are you sure you want to delete this destination?'
            },
            width: '400px',
            maxWidth: '90vw'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.service
                    .delete(el.id)
                    .pipe(
                        catchError(this.handleError('Error deleting destination')),
                        finalize(() => (this.loading = false))
                    )
                    .subscribe(() => {
                        this.snackBar.open('Destination deleted successfully', 'close', { duration: 3000 });
                        this.loadData();
                    });
            }
        });
    }
}
