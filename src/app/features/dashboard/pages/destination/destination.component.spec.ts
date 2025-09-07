import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationComponent } from './destination.component';
import { DestinationService } from '@core/services/destination.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Destination } from '@core/models/destination.model';

const mockPagination = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  number: 0
};

describe('DestinationComponent', () => {
  let component: DestinationComponent;
  let fixture: ComponentFixture<DestinationComponent>;
  let service: jasmine.SpyObj<DestinationService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('DestinationService', ['getAll']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    service.getAll.and.returnValue(of(mockPagination));

    await TestBed.configureTestingModule({
      imports: [DestinationComponent],
      providers: [
        { provide: DestinationService, useValue: service },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service.getAll.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const data: Destination = {
      id: 1,
      name: 'Test',
      description: 'Desc',
      countryCode: 'US',
      type: 'BEACH',
      createdDate: '',
      updatedDate: ''
    };
    service.getAll.and.returnValue(of({ ...mockPagination, content: [data], totalElements: 1 }));
    component.loadData();
    expect(service.getAll).toHaveBeenCalled();
    expect(component.data.length).toBe(1);
    expect(component.total).toBe(1);
  });

  it('should open create dialog and reload data on success', () => {
    const afterClosed = { afterClosed: () => of(true) } as any;
    dialog.open.and.returnValue(afterClosed);
    spyOn(component, 'loadData');
    component.newDestination();
    expect(dialog.open).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
    expect(component.loadData).toHaveBeenCalled();
  });
});

