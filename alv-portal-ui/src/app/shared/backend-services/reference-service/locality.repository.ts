import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalityAutocomplete, LocalitySuggestion } from './locality.types';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocalityRepository {

  private readonly REFERENCESERVICE_URL = '/referenceservice/api';

  private readonly LOCALITIES_SUGGESTION = this.REFERENCESERVICE_URL + '/_search/localities';

  private readonly LOCALITIES_URL = this.LOCALITIES_SUGGESTION + '/nearest';

  constructor(private http: HttpClient) {
  }

  public suggestLocalities(query: string, distinctByLocalityCity = true): Observable<LocalityAutocomplete> {
    const params = new HttpParams()
      .set('prefix', query)
      .set('resultSize', '10')
      .set('distinctByLocalityCity', distinctByLocalityCity.toString());
    return this.http.get<LocalityAutocomplete>(this.LOCALITIES_SUGGESTION, { params });
  }

  public suggestNearestLocality(coordinates: Coordinates): Observable<LocalitySuggestion> {
    const params = new HttpParams()
      .set('latitude', coordinates.latitude.toString())
      .set('longitude', coordinates.longitude.toString());
    return this.http.get<LocalitySuggestion>(this.LOCALITIES_URL, { params });
  }

}
