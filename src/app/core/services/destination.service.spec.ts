import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DestinationService } from './destination.service';
import { environment } from 'environments/environment';

describe('DestinationService', () => {
  let service: DestinationService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/destination`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(DestinationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request destinations with default params', () => {
    service.getAll().subscribe();

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === baseUrl);
    expect(req.request.params.get('pageNumber')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('filter')).toBeNull();

    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 1 });
  });

  it('should include filter and sorting params when provided', () => {
    service.getAll('beach', 2, 5, 'name', 'desc').subscribe();

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === baseUrl);
    expect(req.request.params.get('filter')).toBe('beach');
    expect(req.request.params.get('pageNumber')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('5');
    expect(req.request.params.get('sortBy')).toBe('name');
    expect(req.request.params.get('sortDir')).toBe('desc');

    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 5, number: 2 });
  });

  it('should fetch a destination by id', () => {
    const id = 42;
    service.getById(id).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');

    req.flush({
      id,
      name: 'Test',
      countryCode: 'TT',
      type: 'island',
      createdDate: '',
      updatedDate: ''
    });
  });
});
