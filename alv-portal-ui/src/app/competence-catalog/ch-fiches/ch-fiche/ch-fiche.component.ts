import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  ChFiche,
  Competence,
  CompetenceType,
  Occupation
} from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { CompetenceElement } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceSetSearchModalComponent } from '../competence-set-search-modal/competence-set-search-modal.component';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map, take, takeUntil, tap } from 'rxjs/operators';
import { OccupationSearchModalComponent } from '../occupation-search-modal/occupation-search-modal.component';
import { ChFicheTitleModalComponent } from '../ch-fiche-title-modal/ch-fiche-title-modal.component';
import { CompetenceCatalogAction } from '../../shared/shared-competence-catalog.types';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import {
  OccupationLabelRepository,
  OccupationTypes
} from '../../../shared/backend-services/reference-service/occupation-label.repository';
import { I18nService } from '../../../core/i18n.service';
import { OccupationLabelData } from '../../../shared/backend-services/reference-service/occupation-label.types';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import { NotificationsService } from '../../../core/notifications.service';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceSetBacklinkComponent } from '../../shared/backlinks/competence-set-backlinks/competence-set-backlink.component';
import { ChFicheDescriptionModalComponent } from '../ch-fiche-description-modal/ch-fiche-description-modal.component';
import { CompetenceSetInFicheSettingsModalComponent } from './competence-set-in-fiche-settings-modal/competence-set-in-fiche-settings-modal.component';
import { Prerequisite } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite.types';
import { PrerequisiteRepository } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite-repository.service';
import { PrerequisiteBacklinkComponent } from '../../shared/backlinks/prerequisite-backlinks/prerequisite-backlink.component';
import { PrerequisiteSearchModalComponent } from '../prerequisite-search-modal/prerequisite-search-modal.component';
import { PrerequisiteModalComponent } from '../../shared/prerequisite-modal/prerequisite-modal.component';

/*
 * todo in this file we have 7 subscribe blocks. It's not good because this way when the
 *   @Input changes, the element is not fully redrawn. Another problem is that the subscriptions
 *   can get lost and we will end up with the memery leaks.
 *   Part of the logic should be moved to the dedicated services, and we need to strive to
 *   using only one async pipe instead of many subscribe blocks.
 *   The refactor will be done within the frame of DF-1916 Jira Issue
 */
const defaultCompetences = () => ({
  [CompetenceType.BASIC]: [],
  [CompetenceType.SPECIALIST]: []
});

@Component({
  selector: 'alv-ch-fiche',
  templateUrl: './ch-fiche.component.html',
  styleUrls: ['./ch-fiche.component.scss']
})
export class ChFicheComponent extends CompetenceCatalogEditorAwareComponent implements OnInit, OnChanges {

  @Input() chFiche: ChFiche;

  @Input() showErrors: boolean;

  @Input()
  isReadonly = false;

  IconKey = IconKey;

  collapsed = {
    OCCUPATIONS: true,
    [CompetenceType.BASIC]: true,
    [CompetenceType.SPECIALIST]: true,
    PREREQUISITES: true
  };

  competenceTypes = Object.values(CompetenceType);

  resolvedOccupations: ResolvedOccupation[] = [];

  competences: { [index: string]: CompetenceSetSearchResult[] } = defaultCompetences();

  prerequisites: Prerequisite[] = [];

  linkOccupationAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.LINK,
    icon: ['fas', 'search-plus'],
    label: 'portal.competence-catalog.ch-fiches.actions.search-and-add'
  };

  linkCompetenceAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.LINK,
    icon: ['fas', 'search-plus'],
    label: 'portal.competence-catalog.ch-fiches.actions.search-and-add'
  };

  linkPrerequisiteAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.LINK,
    icon: ['fas', 'search-plus'],
    label: 'portal.competence-catalog.ch-fiches.actions.search-and-add'
  };

  unlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.UNLINK,
    icon: ['fas', 'unlink'],
    label: 'portal.competence-catalog.ch-fiches.actions.unlink'
  };

  unlinkPrerequisiteAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.UNLINK,
    icon: ['fas', 'unlink'],
    label: 'portal.competence-catalog.ch-fiches.actions.unlink'
  };

  backlinkPrerequisiteAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };
  backlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };
  settingsCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.SETTINGS,
    icon: ['fas', 'cog'],
    label: 'portal.competence-catalog.competence-sets.overview.settings'
  };
  deleteChFicheAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'portal.competence-catalog.competence-elements.overview.delete.label'
  };

  competenceSetsActions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;
  prerequisiteActions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;
  chFicheDescriptionActions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              private i18nService: I18nService,
              private occupationLabelRepository: OccupationLabelRepository,
              private competenceSetRepository: CompetenceSetRepository,
              protected authenticationService: AuthenticationService,
              private prerequisiteRepository: PrerequisiteRepository,
              private notificationsService: NotificationsService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    // Translate all occupations initially and on language change
    this.i18nService.currentLanguage$.pipe(
      flatMap(lang => this.translateOccupations(this.chFiche ? this.chFiche.occupations : [], lang)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
    this.competenceSetsActions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkCompetenceSetAction, this.unlinkCompetenceSetAction, this.settingsCompetenceSetAction] : [this.backlinkCompetenceSetAction])
    );
    this.chFicheDescriptionActions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.deleteChFicheAction] : [])
    );
    this.prerequisiteActions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkPrerequisiteAction, this.unlinkPrerequisiteAction] : [this.backlinkPrerequisiteAction])
    );
  }

  ngOnChanges() {
    this.reset();
  }

  reset() {
    this.resolvedOccupations = [];
    this.competences = defaultCompetences();
    this.prerequisites = [];
  }

  addOccupation() {
    const modalRef = this.modalService.openMedium(OccupationSearchModalComponent);
    (<OccupationSearchModalComponent>modalRef.componentInstance).existingOccupations = this.chFiche.occupations.map(occupation => occupation.bfsCode);
    modalRef.result
      .then((result) => {
        this.chFiche.occupations.push({
          bfsCode: result.payload.mappings[OccupationTypes.BFS],
          chIsco5: result.payload.mappings[OccupationTypes.CHISCO5]
        });
        this.updateOccupationLabels(this.chFiche.occupations)
          .subscribe(() => {
            this.collapsed.OCCUPATIONS = false;
            this.notificationsService.success('portal.competence-catalog.ch-fiches.added-occupation-success-notification');
          });
      })
      .catch(() => {
      });
  }

  unlinkOccupation(index: number) {
    this.openUnlinkConfirmModal().then(result => {
      this.chFiche.occupations.splice(index, 1);
      this.updateOccupationLabels(this.chFiche.occupations)
        .subscribe(() => {
          this.notificationsService.success('portal.competence-catalog.ch-fiches.removed-occupation-success-notification');
        });
    }).catch(err => {
    });
  }

  openUnlinkCompetenceModal(type: CompetenceType, index: number) {
    this.openUnlinkConfirmModal().then(() => {
      this.unlinkCompetence(index, type);
    }).catch(err => {
    });
  }

  openAddCompetenceModal(competenceType: CompetenceType) {
    const modalRef = this.modalService.openMedium(CompetenceSetSearchModalComponent);
    (<CompetenceSetSearchModalComponent>modalRef.componentInstance).existingSetIds = this.chFiche.competences.map(competence => competence.competenceSetId);
    modalRef.result
      .then((competenceSet: CompetenceSetSearchResult) => {
        this.addCompetence(competenceType, competenceSet.id);
      })
      .catch(() => {
      });
  }

  handleCompetenceSetActionClick(action: CompetenceCatalogAction, competenceType: CompetenceType, competenceSet?: CompetenceSetSearchResult) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openSetBacklinkModal(competenceSet);
    }
    if (action === CompetenceCatalogAction.LINK) {
      this.openAddCompetenceModal(competenceType);
    }
    if (action === CompetenceCatalogAction.UNLINK) {
      this.openUnlinkCompetenceModal(competenceType, this.chFiche.competences.findIndex(competence => competence.competenceSetId === competenceSet.id));
    }
    if (action === CompetenceCatalogAction.SETTINGS) {
      this.openSettingsModal(competenceSet, competenceType);
    }
  }

  private unlinkCompetence(index: number, type: CompetenceType) {
    this.chFiche.competences.splice(index, 1);
    this.loadCompetences(type)
      .subscribe(() => {
        this.notificationsService.success('portal.competence-catalog.ch-fiches.removed-competence-set-success-notification');
      });
  }

  togglePrerequisites(collapsed: boolean) {
    if (!collapsed) {
      this.loadPrerequisites().subscribe();
    }
  }

  toggleCompetences(competenceType: CompetenceType, collapsed: boolean) {
    if (!collapsed) {
      this.loadCompetences(competenceType).subscribe();
    }
  }

  loadPrerequisites(): Observable<Prerequisite[]> {
    return this.prerequisiteRepository.findByIds(this.chFiche.prerequisiteIds).pipe(
      tap(prerequisites => {
        this.prerequisites = prerequisites;
      })
    );
  }

  getCompetencesByType(competenceType: CompetenceType): Competence[] {
    return this.chFiche.competences.filter(competence => competence.type === competenceType);
  }

  editFicheName(isReadonly: boolean) {
    const modalRef = this.modalService.openMedium(ChFicheTitleModalComponent);
    (<ChFicheTitleModalComponent>modalRef.componentInstance).isReadonly = isReadonly;
    if (this.chFiche.title) {
      (<ChFicheTitleModalComponent>modalRef.componentInstance).chFicheTitle = this.chFiche.title;
    }
    modalRef.result
      .then((multiLanguageTitle) => {
        this.chFiche.title = multiLanguageTitle;
      })
      .catch(() => {
      });
  }

  handleOccupationActionClick(action: CompetenceCatalogAction) {
    if (action === CompetenceCatalogAction.LINK) {
      this.addOccupation();
    }
  }

  private addCompetence(competenceType: CompetenceType, competenceSetId: string) {
    this.chFiche.competences.push({
      type: competenceType,
      competenceSetId: competenceSetId
    });
    this.loadCompetences(competenceType).subscribe(result => {
      this.collapsed[competenceType] = false;
      this.notificationsService.success('portal.competence-catalog.ch-fiches.added-competence-set-success-notification');
    });
  }

  private openSettingsModal(competenceSet: CompetenceSetSearchResult, competenceType: CompetenceType) {
    const modalRef = this.modalService.openMedium(CompetenceSetInFicheSettingsModalComponent);
    (<CompetenceSetInFicheSettingsModalComponent>modalRef.componentInstance).competenceType = competenceType;
    modalRef.result.then((newCompetenceType: CompetenceType) => {
      this.setNewCompetenceTypeToCompetenceSet(newCompetenceType, competenceType, competenceSet.id);
    });
  }

  private setNewCompetenceTypeToCompetenceSet(newType: CompetenceType, oldType: CompetenceType, competenceSetId: string) {
    if (!(newType === oldType)) {
      this.unlinkCompetence(this.chFiche.competences.findIndex(competence => competence.competenceSetId === competenceSetId), oldType);
      this.addCompetence(newType, competenceSetId);
    }
  }

  private updateOccupationLabels(occupations: Occupation[]): Observable<ResolvedOccupation[]> {
    return this.i18nService.currentLanguage$.pipe(
      take(1),
      flatMap(lang => this.translateOccupations(occupations, lang))
    );
  }

  private translateOccupations(occupations: Occupation[], lang: string): Observable<ResolvedOccupation[]> {
    if (!occupations.length) {
      this.resolvedOccupations = [];
      return of(this.resolvedOccupations);
    }
    return forkJoin(occupations.map(o => this.occupationLabelRepository.getOccupationLabelsByKey(OccupationTypes.BFS, o.bfsCode, lang)))
      .pipe(
        map((occupationLabels: OccupationLabelData[]) => {
          return this.resolvedOccupations = occupationLabels.map((labelData, index) => {
            return {
              labelData: labelData,
              occupation: occupations[index]
            };
          });
        })
      );
  }

  handlePrerequisiteActionClick(action: CompetenceCatalogAction, index?: number) {
    if (action === CompetenceCatalogAction.LINK) {
      this.addPrerequisite();
    }
    if (action === CompetenceCatalogAction.UNLINK) {
      this.unlinkPrerequisite(index);
    }
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openPrerequisiteBacklinkModal(index);
    }
  }

  viewPrerequisite(prerequisite: Prerequisite) {
    const modalRef = this.modalService.openLarge(PrerequisiteModalComponent);
    if (this.chFiche.title) {
      const componentInstance = <PrerequisiteModalComponent>modalRef.componentInstance;
      componentInstance.prerequisite = prerequisite;
      componentInstance.isReadonly = true;
    }
  }

  private openUnlinkConfirmModal(): Promise<CompetenceElement> {
    return this.modalService.openConfirm({
      title: 'portal.competence-catalog.competence-sets.overview.delete-confirmation.title',
      content: 'portal.competence-catalog.competence-sets.overview.delete-confirmation.text'
    }).result;
  }

  editFicheDescription(isReadonly: boolean) {
    const modalRef = this.modalService.openMedium(ChFicheDescriptionModalComponent);
    (<ChFicheDescriptionModalComponent>modalRef.componentInstance).isReadonly = isReadonly;
    if (this.chFiche.description) {
      (<ChFicheDescriptionModalComponent>modalRef.componentInstance).chFicheDescription = this.chFiche.description;
    }
    modalRef.result
      .then((multiLanguageTitle) => {
        this.chFiche.description = multiLanguageTitle;
        this.notificationsService.success('portal.competence-catalog.ch-fiches.edit-description-success-notification');

      })
      .catch(() => {
      });
  }

  handleDescriptionActionClick(action: CompetenceCatalogAction) {
    if (action === CompetenceCatalogAction.DELETE) {
      this.modalService.openConfirm({
        title: 'portal.competence-catalog.ch-fiches.remove-description-dialog.title',
        content: 'portal.competence-catalog.ch-fiches.remove-description-dialog.confirmation-question',
        confirmLabel: 'entity.action.yes-delete',
      })
        .result
        .then(() => {
            this.chFiche.description = null;
            this.notificationsService.success('portal.competence-catalog.ch-fiches.remove-description-success-notification');
          }
        )
        .catch(() => {
        });

    }
  }

  private openSetBacklinkModal(competenceSetSearchResult: CompetenceSetSearchResult) {
    const modalRef = this.modalService.openMedium(CompetenceSetBacklinkComponent);
    (<CompetenceSetBacklinkComponent>modalRef.componentInstance).competenceSetSearchResult = competenceSetSearchResult;
  }

  private addPrerequisite() {
    const modalRef = this.modalService.openMedium(PrerequisiteSearchModalComponent);
    (<PrerequisiteSearchModalComponent>modalRef.componentInstance).existingPrerequisiteIds = this.chFiche.prerequisiteIds;
    modalRef.result
      .then((prerequisite: Prerequisite) => {
        this.chFiche.prerequisiteIds.push(prerequisite.id);
        this.loadPrerequisites().subscribe(() => {
          this.collapsed['PREREQUISITES'] = false;
          this.notificationsService.success('portal.competence-catalog.ch-fiches.added-prerequisite-success-notification');
        });
      })
      .catch(() => {
      });

  }

  private loadCompetences(competenceType: CompetenceType): Observable<CompetenceSetSearchResult[]> {
    const competences = this.chFiche.competences
      .filter(competence => competence.type === competenceType)
      .map(competence => this.competenceSetRepository.findById(competence.competenceSetId));
    const result = competences.length ? forkJoin(competences) : of([]);
    return result.pipe(
      tap(competenceSets => {
        this.competences[competenceType] = competenceSets;
      })
    );
  }


  private unlinkPrerequisite(index: number) {
    this.openUnlinkConfirmModal().then(() => {
      this.chFiche.prerequisiteIds.splice(index, 1);
      this.loadPrerequisites().subscribe(() => {
        this.notificationsService.success('portal.competence-catalog.ch-fiches.removed-prerequisite-success-notification');
      });
    }).catch(err => {
    });
  }

  private openPrerequisiteBacklinkModal(index: number) {
    const modalRef = this.modalService.openMedium(PrerequisiteBacklinkComponent);
    (<PrerequisiteBacklinkComponent>modalRef.componentInstance).prerequisite = this.prerequisites[index];
  }

}

interface ResolvedOccupation {
  occupation: Occupation;
  labelData: OccupationLabelData;
}

