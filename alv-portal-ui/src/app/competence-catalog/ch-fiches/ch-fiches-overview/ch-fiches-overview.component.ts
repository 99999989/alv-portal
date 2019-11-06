import { Component, OnInit } from '@angular/core';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewComponent } from '../../shared/overview/overview.component';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends OverviewComponent<ChFiche> implements OnInit {


  constructor(protected itemsRepository: ChFicheRepository,
              private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService) {
    super(authenticationService, itemsRepository);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

}
