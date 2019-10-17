import { Component, OnInit } from '@angular/core';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { Observable } from 'rxjs';
import { ChFicheRepository } from '../../../shared/backend-services/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ChFiche } from '../../../shared/backend-services/ch-fiche/ch-fiche.types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends AbstractSubscriber implements OnInit {

  query = new FormControl();

  isCompetenceCatalogEditor$: Observable<boolean>;

  chFiches: ChFiche[];

  private page = 0;

  private readonly DEFAULT_PAGE_SIZE = 20;

  constructor(private chFicheRepository: ChFicheRepository,
              private router: Router,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    this.onScroll();

    this.query.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.reload();
      });

    this.isCompetenceCatalogEditor$ = this.authenticationService.getCurrentUser().pipe(
      map(user => user && user.isCompetenceCatalogEditor())
    );
  }

  onScroll() {
    this.chFicheRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: this.DEFAULT_PAGE_SIZE
    }).pipe(
    ).subscribe(response => {
      this.chFiches = [...(this.chFiches || []), ...response.content];
    });
  }

  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

  private reload() {
    this.page = 0;
    this.chFiches = [];
    this.onScroll();
  }
}
