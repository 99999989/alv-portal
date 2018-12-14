import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplyFilterAction } from '../state-management/actions/job-ad-search.actions';
import { JobSearchFilter } from '../job-search-filter.types';
import { JobAdSearchState } from '../state-management/state/job-ad-search.state';
import { JobSearchFilterParameterService } from './job-search-filter-parameter.service';

@Injectable()
export class JobSearchGuard implements CanActivate {

  constructor(private router: Router,
              private jobSearchFilterParameterService: JobSearchFilterParameterService,
              private store: Store<JobAdSearchState>) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {

    const filterString = route.queryParams['filter'];
    if (filterString) {
      const filter = this.extractFilterFromParam(filterString);
      if (filter) {
        this.store.dispatch(new ApplyFilterAction(filter));
        this.router.navigate(['job-search']);
        return false;
      }
    }
    return true;
  }

  private extractFilterFromParam(jobSearchFilterParamValue: string): JobSearchFilter {
    if (!jobSearchFilterParamValue) {
      return null;
    }
    return this.jobSearchFilterParameterService.decode(jobSearchFilterParamValue);
  }

}