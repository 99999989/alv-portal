import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-element/competence-element.repository';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { CompetenceElement } from '../../../shared/backend-services/competence-element/competence-element.types';
import { CompetenceElementModalComponent } from '../../shared/competence-element-modal/competence-element-modal.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'alv-competence-elements-overview',
  templateUrl: './competence-elements-overview.component.html',
  styleUrls: ['./competence-elements-overview.component.scss']
})
export class CompetenceElementsOverviewComponent extends AbstractSubscriber implements OnInit {

  query = new FormControl();

  competenceElements: CompetenceElement[] = [];

  isCompetenceCatalogEditor$: Observable<boolean>;

  private page = 0;

  private readonly DEFAULT_PAGE_SIZE = 20;

  constructor(private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private competenceElementRepository: CompetenceElementRepository) {
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
    this.competenceElementRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: this.DEFAULT_PAGE_SIZE
    }).pipe(
    ).subscribe(response => {
      this.competenceElements = [...(this.competenceElements || []), ...response.content];
    });
  }

  openCreateModal() {
    const createModalRef = this.modalService.openMedium(CompetenceElementModalComponent, true);
    createModalRef.result
      .then(competenceElement => {
        this.reload();
      })
      .catch(() => {
      });
  }

  openUpdateModal(competenceElement: CompetenceElement) {
    const createModalRef = this.modalService.openMedium(CompetenceElementModalComponent, true);
    createModalRef.componentInstance.competenceElement = competenceElement;
    createModalRef.result
      .then(updatedCompetenceElement => {
        this.reload();
      })
      .catch(() => {
      });
  }

  private reload() {
    this.page = 0;
    this.competenceElements = [];
    this.onScroll();
  }
}