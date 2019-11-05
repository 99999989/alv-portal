import { Component, OnInit } from '@angular/core';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { Observable } from 'rxjs';
import { ChFicheRepository } from '../../../shared/backend-services/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ChFiche } from '../../../shared/backend-services/ch-fiche/ch-fiche.types';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '../../shared/constants';
import { OverviewComponent } from '../../shared/overview/overview.component';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends OverviewComponent implements OnInit {

  query = new FormControl();

  sortAsc = true;

  chFiches: ChFiche[];

  private page = 0;

  constructor(private chFicheRepository: ChFicheRepository,
              private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onScroll();

    this.query.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.reload();
      });
  }

  onScroll() {
    this.chFicheRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: DEFAULT_PAGE_SIZE,
      sort: this.sortAsc ? DEFAULT_SORT.asc : DEFAULT_SORT.desc,
    }).pipe(
    ).subscribe(response => {
      this.chFiches = [...(this.chFiches || []), ...response.content];
    });
  }

  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.reload();
  }

  private reload() {
    this.page = 0;
    this.chFiches = [];
    this.onScroll();
  }
}
