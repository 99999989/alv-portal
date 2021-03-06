import { TypeaheadItem } from './typeahead-item';

export class StringTypeaheadItem extends TypeaheadItem<string> {

  constructor(type: string, payload: string, label: string, order = 0) {
    super(type, payload, label, order);
  }

  /**
   * should be called manually after a JSON.parse to make sure we create a new object instance
   * @param obj after using JSON.parse
   */
  static fromJson(obj: any): StringTypeaheadItem {
    return new StringTypeaheadItem(obj.type, obj.payload, obj.label, obj.order);
  }

}
