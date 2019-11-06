import { Observable } from 'rxjs';
import { PagedSearchRequest } from '../request-util';
import { Page } from '../shared.types';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class SearchService<T> {
  abstract search(request: PagedSearchRequest): Observable<Page<T>>;
}
