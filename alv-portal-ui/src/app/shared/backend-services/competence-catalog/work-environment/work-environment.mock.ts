import { WorkEnvironment, WorkEnvironmentType } from './work-environment.types';

export const mockWorkEnvironment: WorkEnvironment = {
  type: WorkEnvironmentType.CONDITION,
  description: { de: 'dreq', en: 'ereq', fr: 'freq', it: 'ireq' },
  draft: false,
  id: 'aaz',
  published: false
};
