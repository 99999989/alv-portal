import { JobBadge } from '../../job-badges-mapper.service';

export interface ResultListItem {
  title: string;
  subtitle: string;
  badges: JobBadge[];
  header: string;
  description: string;
  routerLink: string[];
  visited: boolean;
  // maybe in the future we will need to add queryParams and  fragment properties
  // visited: boolean; //first let's try to use css :visited attribute
}

