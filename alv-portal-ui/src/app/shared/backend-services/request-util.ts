import { HttpParams } from '@angular/common/http';

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
  let params = new HttpParams()
    .set('page', '' + req.page)
    .set('sort', '' + req.sort)
    .set('size', '' + req.size);
  return params;
}

export const DEFAULT_PAGE_SIZE = 20;

export interface PagedSearchRequest {
  page: number;
  size: number;
  sort?: string | Array<string>;
  body?: {[p: string]: any};
}
