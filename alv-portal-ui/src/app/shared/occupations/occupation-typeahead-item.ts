import { TypeaheadItem } from '../forms/input/typeahead/typeahead-item';
import { OccupationCode } from '../backend-services/reference-service/occupation-label.types';

export enum OccupationTypeaheadItemType {
  CLASSIFICATION = 'classification',
  OCCUPATION = 'occupation'
}

export class OccupationTypeaheadItem extends TypeaheadItem<OccupationCode> {

  constructor(public type: OccupationTypeaheadItemType,
              public occupationData: OccupationCode,
              public label: string,
              public order: number) {
    super(type, occupationData, label, order);
  }

  /**
   * should be called manually after a JSON.parse to make sure we create a new object instance
   * @param obj after using JSON.parse
   */
  static fromJson(obj: any): OccupationTypeaheadItem {
    return new OccupationTypeaheadItem(obj.type, obj.payload, obj.label, obj.order);
  }
}
