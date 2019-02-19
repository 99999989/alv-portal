export interface LocalityAutocomplete {
  localities: LocalitySuggestion[];
  cantons: CantonSuggestion[];
}

export interface LocalitySuggestion {
  city: string;
  communalCode: number;
  cantonCode: string;
  regionCode: string;
  zipCode: string;
  geoPoint?: GeoPoint;
}

export interface CantonSuggestion {
  code: string;
  name: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}
