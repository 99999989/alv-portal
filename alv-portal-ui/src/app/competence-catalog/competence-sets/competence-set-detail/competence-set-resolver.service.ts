import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';

@Injectable({
  providedIn: 'root'
})
export class CompetenceSetResolverService implements Resolve<Observable<CompetenceSetSearchResult>> {

  constructor(private competenceSetRepository: CompetenceSetRepository) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CompetenceSetSearchResult> {
    const competenceSetId = route.params['id'];
    return this.competenceSetRepository.findById(competenceSetId);
  }
}
