import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationDialogComponent } from './destination-dialog.component';
import { DestinationService } from '@core/services/destination.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Destination } from '@core/models/destination.model';

describe('DestinationDialogComponent', () => {
  let fixture: ComponentFixture<DestinationDialogComponent>;
  let component: DestinationDialogComponent;
  let service: jasmine.SpyObj<DestinationService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<DestinationDialogComponent>>;

  beforeEach(() => {
    service = jasmine.createSpyObj('DestinationService', ['create', 'update']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
  });

  async function createComponent(data: any) {
    await TestBed.configureTestingModule({
      imports: [DestinationDialogComponent],
      providers: [
        { provide: DestinationService, useValue: service },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await createComponent({ mode: 'create' });
    expect(component).toBeTruthy();
  });

  it('should populate form and disable in view mode', async () => {
    const destination: Destination = {
      id: 1,
      name: 'Test',
      description: 'Desc',
      countryCode: 'US',
      type: 'BEACH',
      createdDate: '',
      updatedDate: ''
    };
    await createComponent({ mode: 'view', destination });
    expect(component.form.value.name).toBe('Test');
    expect(component.form.disabled).toBeTrue();
  });

  it('should mark form as touched when invalid', async () => {
    await createComponent({ mode: 'create' });
    spyOn(component.form, 'markAllAsTouched');
    component.save();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('should create destination on save in create mode', async () => {
    await createComponent({ mode: 'create' });
    service.create.and.returnValue(of({ id: 1 }));
    component.form.setValue({ id: 0, name: 'Test', description: 'Desc', countryCode: 'US', type: 'BEACH' });
    component.save();
    expect(service.create).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should update destination on save in edit mode', async () => {
    const destination: Destination = {
      id: 1,
      name: 'Test',
      description: 'Desc',
      countryCode: 'US',
      type: 'BEACH',
      createdDate: '',
      updatedDate: ''
    };
    await createComponent({ mode: 'edit', destination });
    service.update.and.returnValue(of());
    component.form.setValue({ id: 0, name: 'Test', description: 'Desc', countryCode: 'US', type: 'BEACH' });
    component.save();
    expect(service.update).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});

