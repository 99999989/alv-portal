import { ConfirmModalConfig } from '../layout/modal/confirm-modal/confirm-modal-config.model';

export function getJobAdDeleteConfirmModalConfig(profileName: string): ConfirmModalConfig {
  return {
    title: 'portal.job-ad-search-profiles.delete-confirmation-modal.title',
    content: 'portal.job-ad-search-profiles.delete-confirmation-modal.question',
    confirmLabel: 'portal.job-ad-search-profiles.delete-confirmation-modal.button.confirm',
    cancelLabel: 'portal.job-ad-search-profiles.delete-confirmation-modal.button.cancel',
    contentParams: { profileName: profileName }
  };
}

export function getCandidateDeleteConfirmModalConfig(profileName: string): ConfirmModalConfig {
  return {
    title: 'portal.candidate-search-profiles.delete-confirmation-modal.title',
    content: 'portal.candidate-search-profiles.delete-confirmation-modal.question',
    confirmLabel: 'portal.candidate-search-profiles.delete-confirmation-modal.button.confirm',
    contentParams: { profileName: profileName }
  };
}

