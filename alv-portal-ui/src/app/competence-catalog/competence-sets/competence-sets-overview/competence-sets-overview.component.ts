import { Component, OnInit } from '@angular/core';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-set/competence-set.repository';
import { FormControl } from '@angular/forms';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-set/competence-set.types';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'alv-competence-sets-overview',
  templateUrl: './competence-sets-overview.component.html',
  styleUrls: ['./competence-sets-overview.component.scss']
})
export class CompetenceSetsOverviewComponent extends AbstractSubscriber implements OnInit {

  query = new FormControl();

  competenceSets: CompetenceSetSearchResult[] = [];

  isCompetenceCatalogEditor$: Observable<boolean>;

  private page = 0;

  private readonly DEFAULT_PAGE_SIZE = 20;

  constructor(private competenceSetRepository: CompetenceSetRepository,
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
    this.competenceSetRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: this.DEFAULT_PAGE_SIZE
    }).pipe(
    ).subscribe(response => {
      this.competenceSets = [...(this.competenceSets || []), ...response.content];
    });
  }

  private reload() {
    this.page = 0;
    this.competenceSets = [];
    this.onScroll();
  }
}
