import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import {
  CompetenceElement,
  ElementType
} from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.repository';
import { collapseExpandAnimation } from '../../../shared/animations/animations';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceElementSearchModalComponent } from '../../competence-sets/competence-element-search-modal/competence-element-search-modal.component';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompetenceElementModalComponent } from '../competence-element-modal/competence-element-modal.component';
import { CompetenceCatalogAction } from '../shared-competence-catalog.types';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';

@Component({
  selector: 'alv-competence-set',
  templateUrl: './competence-set.component.html',
  styleUrls: ['./competence-set.component.scss'],
  animations: [collapseExpandAnimation]
})
export class CompetenceSetComponent implements OnInit {

  @Input() competenceSet: CompetenceSetSearchResult;

  @Input() isReadonly = false;

  @Input() isInnerElementsReadonly = false;

  @Input() showActionButtons: boolean;

  @Input() isCollapsed = true;

  @Input() showErrors: boolean;

  @Input() actions: ActionDefinition<CompetenceCatalogAction>[];

  @Output() actionClick = new EventEmitter<CompetenceCatalogAction>();

  elementType = ElementType;

  subElementTypes = [
    ElementType.KNOW_HOW_INDICATOR,
    ElementType.KNOWLEDGE
  ];

  knowHowIndicators: CompetenceElement[];

  knowledgeItems: CompetenceElement[];

  collapsed = {
    [ElementType.KNOW_HOW_INDICATOR]: true,
    [ElementType.KNOWLEDGE]: true
  };

  linkElementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.LINK,
    icon: ['fas', 'search-plus'],
    label: 'portal.competence-catalog.competence-sets.actions.search-and-add'
  };

  unlinkElementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.UNLINK,
    icon: ['fas', 'unlink'],
    label: 'portal.competence-catalog.competence-sets.actions.unlink'
  };

  constructor(private competenceElementRepository: CompetenceElementRepository,
              private modalService: ModalService) {
  }

  ngOnInit() {
    this.loadCompetenceElementsIfRequired();
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.loadCompetenceElementsIfRequired();
  }

  viewCompetenceElementModal(competenceElement: CompetenceElement) {
    const modalRef = this.modalService.openMedium(CompetenceElementModalComponent, true);
    modalRef.componentInstance.competenceElement = competenceElement;
    modalRef.componentInstance.isReadonly = true;
    modalRef.result
      .then(updatedCompetenceElement => {
        if (competenceElement.type === ElementType.KNOW_HOW) {
          this.competenceSet.knowHow = updatedCompetenceElement;
        } else {
          this.loadCompetenceElements().subscribe();
        }
      })
      .catch(() => {
      });
  }

  addKnowHow() {
    const modalRef = this.modalService.openMedium(CompetenceElementSearchModalComponent);
    modalRef.componentInstance.elementType = ElementType.KNOW_HOW;
    modalRef.result
      .then((competenceElement) => {
        this.competenceSet.knowHow = competenceElement;
      })
      .catch(() => {
      });
  }

  getElementsByType(elementType: ElementType): CompetenceElement[] {
    if (elementType === ElementType.KNOW_HOW_INDICATOR) {
      return this.knowHowIndicators;
    }
    if (elementType === ElementType.KNOWLEDGE) {
      return this.knowledgeItems;
    }
  }

  handleSubElementsActionClick(action: CompetenceCatalogAction, competenceElement: CompetenceElement) {
    if (action === CompetenceCatalogAction.UNLINK) {
      this.unlinkCompetenceElement(competenceElement);
    }
  }

  handleKnowHowActionClick(action: CompetenceCatalogAction, competenceElement: CompetenceElement) {
    if (action === CompetenceCatalogAction.UNLINK) {
      this.unlinkKnowHow(competenceElement);
    }
  }

  private unlinkCompetenceElement(competenceElement: CompetenceElement) {
    this.openUnlinkConfirmModal().then(result => {
      const indexToRemove = this.competenceSet.competenceElementIds.indexOf(competenceElement.id);
      this.competenceSet.competenceElementIds.splice(indexToRemove, 1);
      this.loadCompetenceElements().subscribe();
    }).catch(err => {
    });
  }

  private unlinkKnowHow(competenceElement: CompetenceElement) {
    this.openUnlinkConfirmModal().then(result => {
      this.competenceSet.knowHow = null;
    }).catch(err => {
    });
  }

  private openUnlinkConfirmModal(): Promise<CompetenceElement> {
    return this.modalService.openConfirm({
      title: 'portal.competence-catalog.competence-sets.overview.delete-confirmation.title',
      content: 'portal.competence-catalog.competence-sets.overview.delete-confirmation.text'
    }).result;
  }

  private addCompetenceElement(type: ElementType) {
    const modalRef = this.modalService.openMedium(CompetenceElementSearchModalComponent);
    modalRef.componentInstance.elementType = type;
    modalRef.componentInstance.existingElementIds = this.competenceSet.competenceElementIds;
    modalRef.result
      .then((competenceElement) => {
        this.competenceSet.competenceElementIds.push(competenceElement.id);
        this.loadCompetenceElements().subscribe(result => {
          this.collapsed[type] = false;
        });
      })
      .catch(() => {
      });
  }

  private loadCompetenceElementsIfRequired() {
    if (!this.isCollapsed) {
      this.loadCompetenceElements().subscribe();
    }
  }

  private loadCompetenceElements(): Observable<CompetenceElement[]> {
    const result = this.competenceSet.competenceElementIds.length ?
      this.competenceElementRepository.findByIds(this.competenceSet.competenceElementIds) :
      of([]);
    return result.pipe(
      tap(competenceElements => {
        this.knowHowIndicators = competenceElements.filter(element => element.type === ElementType.KNOW_HOW_INDICATOR);
        this.knowledgeItems = competenceElements.filter(element => element.type === ElementType.KNOWLEDGE);
      })
    );
  }
}
