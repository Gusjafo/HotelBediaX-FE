import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';
import { Pagination } from '../models/pagination.model';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DestinationService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/destination`;

    getAll(
        filter = '',
        pageNumber = 1,
        pageSize = 10,
        sortBy?: string,
        sortDir?: string
    ): Observable<Pagination<Destination>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (filter) {
            params = params.set('filter', filter);
        }

        if (sortBy) {
            params = params.set('sortBy', sortBy).set('sortDir', sortDir || 'asc');
        }

        return this.http.get<Pagination<Destination>>(this.baseUrl, { params });
    }


    getById(id: number): Observable<Destination> {
        return this.http.get<Destination>(`${this.baseUrl}/${id}`);
    }

    create(payload: Partial<Destination>): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(this.baseUrl, payload);
    }

    update(id: number, payload: Partial<Destination>): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
