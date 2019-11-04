export interface OccupationLabelSuggestion {
  id: string;
  code: string;
  type: string;
  language: string;
  classifier: string;
  label: string;
  mappings?: { [key: string]: string };
}

export interface OccupationLabel {
  id: string;
  code: string;
  type: string;
  language: string;
  classifier: string;
  label: string;
}

export interface OccupationLabelAutocomplete {
  occupations: OccupationLabelSuggestion[];
  classifications: OccupationLabel[];
}

export interface OccupationLabelData {
  default: string;
  m: string;
  f: string;
}

export interface OccupationCode {
  id?: string;
  value: string;
  type: string;
  mapping?: { value: string; type: string };
}

export interface CompetenceCatalogOccupationCode {
  id?: string;
  value: string;
  type: string;
  mappings?: { [key: string]: string };
}
