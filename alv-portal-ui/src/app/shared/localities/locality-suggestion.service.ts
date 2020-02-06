import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalityRepository } from '../backend-services/reference-service/locality.repository';
import { map } from 'rxjs/operators';
import {
  CantonSuggestion,
  LocalitySuggestion,
} from '../backend-services/reference-service/locality.types';
import { LocalityInputType, LocalityTypeaheadItem } from './locality-typeahead-item';
import { ZipAndCity, ZipAndCityTypeaheadItem } from './zip-and-city-typeahead-item';


const ISO_CANTON_CODE_LIECHTENSTEIN = 'FL';

@Injectable({ providedIn: 'root' })
export class LocalitySuggestionService {

  constructor(private localityRepository: LocalityRepository) {
  }

  public static toZipAndCityTypeaheadItem(zipAndCity: ZipAndCity, order: number): ZipAndCityTypeaheadItem {
    const { zipCode, city } = zipAndCity;
    const payload = { city, zipCode };
    const label = (zipCode || '') + (city ? ' ' : '') + (city || '');

    return new ZipAndCityTypeaheadItem(payload, label, order);
  }

  public static toLocalityTypeaheadItem(locality: LocalitySuggestion, order = 0) {
    return new LocalityTypeaheadItem(LocalityInputType.LOCALITY, locality, locality.city, order);
  }

  fetch(query: string): Observable<LocalityTypeaheadItem[]> {
    return this.localityRepository.suggestLocalities(query).pipe(
      map((localityAutocomplete) => {
        const localities = localityAutocomplete.localities
          .map((o: LocalitySuggestion, index) => LocalitySuggestionService.toLocalityTypeaheadItem(o, index));

        const cantons = localityAutocomplete.cantons
          .map((o: CantonSuggestion, index) =>
            new LocalityTypeaheadItem(LocalityInputType.CANTON, {
              cantonCode: o.code,
            },
              o.name + ' (' + o.code + ')', localities.length + index));
        return [].concat(localities, cantons);
      })
    );
  }

  fetchJobPublicationLocations(query: string): Observable<ZipAndCityTypeaheadItem[]> {
    const localityComparator = (a: LocalitySuggestion, b: LocalitySuggestion) =>
      a.city.localeCompare(b.city) || a.zipCode.localeCompare(b.zipCode);

    return this.localityRepository.suggestLocalities(query, false).pipe(
      map((localityAutocomplete) => localityAutocomplete.localities
        .filter((locality) => locality.zipCode !== '----' && locality.cantonCode !== ISO_CANTON_CODE_LIECHTENSTEIN)
        .sort(localityComparator)
        .map((o: LocalitySuggestion, index) => LocalitySuggestionService.toZipAndCityTypeaheadItem(o, index))
      )
    );
  }
}
