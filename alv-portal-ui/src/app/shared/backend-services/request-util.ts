import { HttpParams } from '@angular/common/http';
import { noop } from 'rxjs';

export function createRequestOption(req?: any): HttpParams {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach((key) => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      if (req.sort instanceof Array) {
        req.sort.forEach((val) => {
          options = options.append('sort', val);
        });
      } else {
        options = options.set('sort', req.sort);
      }
    }
  }
  return options;
}

export function createPageableURLSearchParams(req?: PagedSearchRequest): HttpParams {
  const params = new HttpParams();
  req.page ? params.set('page', '' + req.page) : noop();
  req.sort ? params.set('sort', '' + req.sort) : noop();
  req.size ? params.set('sort', '' + req.size) : noop();
  return params;
}

export const DEFAULT_PAGE_SIZE = 20;

export type RequestBody = Record<string, any>;

export interface PagedSearchRequest {
  page: number;
  size: number;
  sort?: string | Array<string>;
  body?: RequestBody;
}
