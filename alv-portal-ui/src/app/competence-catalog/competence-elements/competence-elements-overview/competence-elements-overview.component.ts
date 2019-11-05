import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-element/competence-element.repository';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  CompetenceElement,
  ElementType
} from '../../../shared/backend-services/competence-element/competence-element.types';
import { CompetenceElementModalComponent } from '../../shared/competence-element-modal/competence-element-modal.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceElementsFilterModalComponent } from '../competence-elements-filter-modal/competence-elements-filter-modal.component';
import { CompetenceElementFilterValues } from '../../shared/shared-competence-catalog.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '../../shared/constants';
import { OverviewComponent } from '../../shared/overview/overview.component';

@Component({
  selector: 'alv-competence-elements-overview',
  templateUrl: './competence-elements-overview.component.html',
  styleUrls: ['./competence-elements-overview.component.scss']
})
export class CompetenceElementsOverviewComponent extends OverviewComponent implements OnInit {

  query = new FormControl();

  competenceElements: CompetenceElement[] = [];

  filter: CompetenceElementFilterValues = {
    types: Object.values(ElementType)
  };

  private page = 0;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              private competenceElementRepository: CompetenceElementRepository) {
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
    this.competenceElementRepository.search({
      body: {
        query: this.query.value || '',
        types: this.filter.types,
      },
      page: this.page++,
      size: DEFAULT_PAGE_SIZE,
      sort: this.sortAsc ? DEFAULT_SORT.asc : DEFAULT_SORT.desc,
    }).pipe(
    ).subscribe(response => {
      this.competenceElements = [...(this.competenceElements || []), ...response.content];
    });
  }

  openCreateModal() {
    const modalRef = this.modalService.openMedium(CompetenceElementModalComponent, true);
    modalRef.result
      .then(competenceElement => {
        this.reload();
      })
      .catch(() => {
      });
  }

  openUpdateModal(competenceElement: CompetenceElement, isReadonly: boolean) {
    const modalRef = this.modalService.openMedium(CompetenceElementModalComponent, true);
    const componentInstance = <CompetenceElementModalComponent>modalRef.componentInstance;
    componentInstance.competenceElement = competenceElement;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(updatedCompetenceElement => {
        this.reload();
      })
      .catch(() => {
      });
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(CompetenceElementsFilterModalComponent, true);
    modalRef.componentInstance.currentFiltering = this.filter;
    modalRef.result
      .then(updatedFilter => {
        this.filter = updatedFilter;
        this.reload();
      })
      .catch(() => {
      });
  }



  reload() {
    this.page = 0;
    this.competenceElements = [];
    this.onScroll();
  }


}
