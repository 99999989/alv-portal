export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT = {
  date_asc: 'date_asc',
  date_desc: 'date_desc',
  alpha_asc: 'alphabetically_asc',
  alpha_desc: 'alphabetically_desc'
};

export interface CompetenceCatalogSortValue {
  type: SortType;
  icon: SortIcon;
}

export enum SortType {
  CREATED_DATE_DESC = 'CREATED_DATE_DESC',
  CREATED_DATE_ASC = 'CREATED_DATE_ASC',
  ALPHA_DESC = 'ALPHA_DESC',
  ALPHA_ASC = 'ALPHA_ASC'
}

export enum SortIcon {
  NUMERIC_DESC = 'sort-numeric-down',
  NUMERIC_UP = 'sort-numeric-up',
  ALPHA_DESC = 'sort-alpha-down',
  ALPHA_ASC = 'sort-alpha-up'
}
