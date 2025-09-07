import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  const data = { title: 'Title', message: 'Message' };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and expose dialog data', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual(data);
  });

  it('should close the dialog with the provided result', () => {
    component.close(true);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
