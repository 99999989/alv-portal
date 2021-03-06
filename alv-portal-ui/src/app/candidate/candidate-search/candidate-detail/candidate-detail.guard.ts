import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CandidateProfileDetailLoadedAction, CandidateSearchState } from '../state-management';
import { CandidateRepository } from '../../../shared/backend-services/candidate/candidate.repository';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class CandidateDetailGuard implements CanActivate {

  constructor(private store: Store<CandidateSearchState>, private candidateRepository: CandidateRepository) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params['id'];
    return this.candidateRepository.findCandidateProfileById(id).pipe(
      tap((candidateProfile) => {
        this.store.dispatch(new CandidateProfileDetailLoadedAction({ candidateProfile }));
      }),
      map(() => {
        return true;
      })
    );
  }

}
