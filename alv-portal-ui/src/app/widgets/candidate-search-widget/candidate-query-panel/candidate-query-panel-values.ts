import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';
import { StringTypeaheadItem } from '../../../shared/forms/input/typeahead/string-typeahead-item';
import { LocalityTypeaheadItem } from '../../../shared/localities/locality-typeahead-item';

export interface CandidateQueryPanelValues {
  occupations: OccupationTypeaheadItem[];
  keywords: StringTypeaheadItem[];
  workplace: LocalityTypeaheadItem;
}
