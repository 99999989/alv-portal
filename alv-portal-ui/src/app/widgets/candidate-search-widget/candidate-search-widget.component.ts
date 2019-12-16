import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CandidateQueryPanelValues } from './candidate-query-panel/candidate-query-panel-values';
import { Router } from '@angular/router';
import { I18nService } from '../../core/i18n.service';
import { OccupationSuggestionService } from '../../shared/occupations/occupation-suggestion.service';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { OccupationTypeaheadItem } from '../../shared/occupations/occupation-typeahead-item';
import { AbstractSubscriber } from '../../core/abstract-subscriber';
import { IconKey } from '../../shared/icons/custom-icon/custom-icon.component';

@Component({
  selector: 'alv-candidate-search-widget',
  templateUrl: './candidate-search-widget.component.html',
  styleUrls: ['./candidate-search-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchWidgetComponent extends AbstractSubscriber implements OnInit {

  IconKey = IconKey;

  candidateQueryPanelValues: CandidateQueryPanelValues = {
    occupations: [],
    keywords: [],
    workplace: null,
  };

  constructor(private router: Router, private i18nService: I18nService, private occupationSuggestionService: OccupationSuggestionService) {
    super();
  }

  ngOnInit() {
    this.i18nService.currentLanguage$.pipe(
      filter(() => !!this.candidateQueryPanelValues.occupations),
      filter(() => this.candidateQueryPanelValues.occupations.length > 0),
      switchMap((lang) => {
        const occupations: OccupationTypeaheadItem[] = this.candidateQueryPanelValues.occupations;
        return this.occupationSuggestionService.translateAll(occupations, lang);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe((data) => {
      this.candidateQueryPanelValues = {
        ...this.candidateQueryPanelValues,
        occupations: [...data]
      };
    });
  }

  public onSearchSubmit(candidateQueryPanelValues1: CandidateQueryPanelValues) {
    this.router.navigate(['candidate-search'], {
      queryParams: {
        'query-values': JSON.stringify(candidateQueryPanelValues1)
      }
    });
  }

}
