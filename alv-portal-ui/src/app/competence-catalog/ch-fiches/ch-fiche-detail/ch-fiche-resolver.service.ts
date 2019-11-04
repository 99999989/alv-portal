import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChFicheRepository } from '../../../shared/backend-services/ch-fiche/ch-fiche.repository';
import { ChFiche } from '../../../shared/backend-services/ch-fiche/ch-fiche.types';

@Injectable({
  providedIn: 'root'
})
export class ChFicheResolverService implements Resolve<Observable<ChFiche>> {

  constructor(private chFicheRepository: ChFicheRepository) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChFiche> {
    const chFicheId = route.params['id'];
    return this.chFicheRepository.findById(chFicheId);
  }
}
