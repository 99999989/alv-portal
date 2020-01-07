import {
  forkJoin,
  Observable,
  of
} from 'rxjs';
import {
  OccupationLabelRepository,
  OccupationTypes,
  REFERENCE_SERVICE_API_VERSION
} from '../backend-services/reference-service/occupation-label.repository';
import { Injectable } from '@angular/core';
import {
  OccupationTypeaheadItem,
  OccupationTypeaheadItemType
} from './occupation-typeahead-item';
import { map } from 'rxjs/operators';
import {
  CompetenceCatalogOccupationCode,
  OccupationCode,
  OccupationLabel,
  OccupationLabelSuggestion
} from '../backend-services/reference-service/occupation-label.types';


const translateableOccupationTypes: string[] = [OccupationTypes.AVAM, OccupationTypes.CHISCO3, OccupationTypes.CHISCO5];

type OccupationLabelSuggestionMapper = (o: OccupationLabelSuggestion) => OccupationCode;

@Injectable({ providedIn: 'root' })
export class OccupationSuggestionService {

  constructor(private occupationLabelRepository: OccupationLabelRepository) {
  }

  translateAll(occupations: OccupationTypeaheadItem[], language: string): Observable<OccupationTypeaheadItem[]> {
    return forkJoin(occupations.map((o) => this.translate(o, language)));
  }

  translate(occupation: OccupationTypeaheadItem, language: string, apiVersion = REFERENCE_SERVICE_API_VERSION.V_1): Observable<OccupationTypeaheadItem> {
    const occupationCode = this.translateableOccupationCode(occupation);
    if (occupationCode) {
      return this.occupationLabelRepository.getOccupationLabelsByKey(occupationCode.type, occupationCode.value, language, apiVersion).pipe(
        map((label) => {
          return new OccupationTypeaheadItem(<OccupationTypeaheadItemType>occupation.type, occupation.payload, label.default, occupation.order);
        })
      );
    }
    return of(occupation);
  }

  fetchJobSearchOccupations(query: string): Observable<Array<OccupationTypeaheadItem>> {
    return this.fetch(query, [OccupationTypes.X28, OccupationTypes.CHISCO3, OccupationTypes.CHISCO5], this.toJobSearchOccupationCode);
  }

  fetchCandidateSearchOccupations(query: string): Observable<Array<OccupationTypeaheadItem>> {
    return this.fetch(query, [OccupationTypes.AVAM, OccupationTypes.CHISCO3, OccupationTypes.CHISCO5], this.toCandidateSearchOccupationCode);
  }

  fetchJobPublicationOccupations(query: string): Observable<Array<OccupationTypeaheadItem>> {
    return this.fetch(query, [OccupationTypes.AVAM], this.toJobPublicationOccupations);
  }

  fetchCompetenceCatalogOccupations(query: string, occupationTypes: OccupationTypes[]): Observable<Array<OccupationTypeaheadItem>> {
    return this.fetch(query, occupationTypes, this.toCompetenceCatalogOccupationCode, REFERENCE_SERVICE_API_VERSION.V_2).pipe(
      map(occupations => occupations.map(o => Object.assign(o, { label: o.label + ' (' + o.payload.type + '-' + o.payload.value + ')' }))));
  }

  /**
   * @param apiVersion todo remove as soon as we have only 1 copy of reference service
   */
  private fetch(query: string, occupationTypes: OccupationTypes[], occupationMapping: OccupationLabelSuggestionMapper, apiVersion = REFERENCE_SERVICE_API_VERSION.V_1)
    : Observable<OccupationTypeaheadItem[]> {
    return this.occupationLabelRepository.suggestOccupations(query, occupationTypes, apiVersion)
      .pipe(
        map((occupationLabelAutocomplete) => {
          const occupationItems = occupationLabelAutocomplete.occupations
            .map((occupation, idx) => {
              const professionCodes = occupationMapping(occupation);
              return new OccupationTypeaheadItem(OccupationTypeaheadItemType.OCCUPATION, professionCodes, occupation.label, idx);
            });

          const classificationItems = occupationLabelAutocomplete.classifications
            .map((classification, idx) => {
              const professionCodes = this.toProfessionCodesFromClassification(classification);
              return new OccupationTypeaheadItem(OccupationTypeaheadItemType.CLASSIFICATION, professionCodes, classification.label, this.determineStartIndex(occupationLabelAutocomplete, idx));
            });
          return [].concat(occupationItems, classificationItems);
        })
      );
  }

  private translateableOccupationCode(occupation: OccupationTypeaheadItem): OccupationCode {
    if (translateableOccupationTypes.includes(occupation.payload.type)) {
      return occupation.payload;
    }
    return;
  }

  private toProfessionCodesFromClassification(classification: OccupationLabel) {
    return {
      id: classification.id,
      type: classification.type,
      value: classification.code,
      classifier: classification.classifier
    };
  }

  private toJobSearchOccupationCode(occupation: OccupationLabelSuggestion) {
    const occupationCode: OccupationCode = {
      id: occupation.id,
      type: occupation.type,
      value: occupation.code
    };
    if (occupation.type === 'X28' && occupation.mappings && occupation.mappings['AVAM']) {
      occupationCode.mapping = {
        type: 'AVAM',
        value: occupation.mappings['AVAM']
      };
    }
    return occupationCode;
  }

  private toCompetenceCatalogOccupationCode(occupation: OccupationLabelSuggestion): CompetenceCatalogOccupationCode {
    return {
      id: occupation.id,
      type: occupation.type,
      value: occupation.code,
      mappings: occupation.mappings
    };
  }

  private toCandidateSearchOccupationCode(occupation: OccupationLabelSuggestion) {
    const occupationCode: OccupationCode = {
      id: occupation.id,
      type: occupation.type,
      value: occupation.code
    };
    if (occupation.type === 'AVAM' && occupation.mappings && occupation.mappings['BFS']) {
      occupationCode.mapping = {
        type: 'BFS',
        value: occupation.mappings['BFS']
      };
    }
    return occupationCode;
  }

  private toJobPublicationOccupations(occupation: OccupationLabelSuggestion) {
    return {
      id: occupation.id,
      type: occupation.type,
      value: occupation.code
    };
  }

  private determineStartIndex(occupationLabelAutocomplete, idx) {
    return occupationLabelAutocomplete.occupations.length + idx;
  }

}
