import { Component, OnInit } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
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

  items: ChFiche[];

  constructor(private itemsRepository: ChFicheRepository,
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
    this.itemsRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: DEFAULT_PAGE_SIZE,
      sort: this.sortAsc ? DEFAULT_SORT.asc : DEFAULT_SORT.desc,
    }).pipe(
    ).subscribe(response => {
      this.items = [...(this.items || []), ...response.content];
    });
  }

  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

  reload() {
    this.page = 0;
    this.items = [];
    this.onScroll();
  }
}
