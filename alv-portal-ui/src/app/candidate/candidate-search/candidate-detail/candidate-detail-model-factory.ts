import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, merge, Observable, of } from 'rxjs';
import {
  CandidateProfile,
  CandidateProtectedData,
  JobExperience
} from '../../../shared/backend-services/candidate/candidate.types';
import { catchError, filter, map, share, switchMap } from 'rxjs/operators';
import { OccupationLabelRepository, } from '../../../shared/backend-services/reference-service/occupation-label.repository';
import { I18nService } from '../../../core/i18n.service';
import { CandidateDetailModel, JobExperienceModel } from './candidate-detail-model';
import {
  candidateContact,
  canViewCandidateProtectedData,
  extractGenderAwareTitle,
  findWantedJobExperiences,
  isDegreeDisplayed,
  isGraduationDisplayed,
  resolveJobCenterCode
} from '../candidate-rules';
import { OccupationService } from '../../../shared/occupations/occupation.service';
import { JobCenter } from '../../../shared/backend-services/reference-service/job-center.types';
import { JobCenterRepository } from '../../../shared/backend-services/reference-service/job-center.repository';
import { CandidateRepository } from '../../../shared/backend-services/candidate/candidate.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { Contact } from '../../../shared/backend-services/shared.types';


@Injectable()
export class CandidateDetailModelFactory {

  constructor(private occupationLabelRepository: OccupationLabelRepository,
              private i18nService: I18nService,
              private occupationService: OccupationService,
              private jobCenterRepository: JobCenterRepository,
              private candidateRepository: CandidateRepository,
              private authenticationService: AuthenticationService) {

  }

  private static sortLastJobFirst(experiences) {
    return experiences.sort((a, b) => +b.jobExperience.lastJob - +a.jobExperience.lastJob);
  }

  private static extractProfessionCode(jobExperience: JobExperience) {
    return {
      value: String(jobExperience.occupation.avamCode),
      type: 'AVAM'
    };
  }

  create(candidateProfile: CandidateProfile): Observable<CandidateDetailModel> {
    const jobCenter$ = this.getJobCenter(candidateProfile).pipe(share());
    const jobExperiencesModels$ = this.getJobExperiencesModels(candidateProfile);
    const candidateProtectedData$ = this.getCandidateProtectedData(candidateProfile);
    const contact$: Observable<Contact> = jobCenter$.pipe(switchMap((jobCenter => this.getContact(candidateProfile, jobCenter))));


    return combineLatest(jobCenter$, jobExperiencesModels$, candidateProtectedData$, contact$).pipe(
      map(([jobCenter, jobExperiencesModels, candidateProtectedData, contact]) => {
        return new CandidateDetailModel(
          candidateProfile,
          jobCenter,
          jobExperiencesModels,
          candidateProtectedData,
          contact
        );
      })
    );
  }

  private resolveJobExperience(candidateProfile, language, jobExperience: JobExperience): Observable<JobExperienceModel> {
    const professionCode = CandidateDetailModelFactory.extractProfessionCode(jobExperience);
    return this.occupationService.findLabel(professionCode, language).pipe(
      map(label => ({
        jobExperience: jobExperience,
        occupationLabel: extractGenderAwareTitle(candidateProfile, label),
        displayGraduation: isGraduationDisplayed(jobExperience.graduation),
        displayDegree: isDegreeDisplayed(jobExperience.degree)
      }))
    );
  }

  private getJobCenter(candidateProfile: CandidateProfile): Observable<JobCenter> {
    const jobCenterCode = resolveJobCenterCode(candidateProfile.jobCenterCode);
    return this.i18nService.currentLanguage$.pipe(
      switchMap((lang) => {
        if (jobCenterCode) {
          return this.jobCenterRepository.resolveJobCenter(jobCenterCode, lang);
        }
        return of(null);
      }),
      catchError(() => of(null as JobCenter))
    );
  }

  private getJobExperiencesModels(candidateProfile: CandidateProfile): Observable<JobExperienceModel[]> {
    return this.i18nService.currentLanguage$.pipe(
      switchMap((language) => {
        const wantedJobExperiences = findWantedJobExperiences(candidateProfile);
        if (wantedJobExperiences.length === 0) {
          return of([]);
        }
        const jobExperiencesModels$ = wantedJobExperiences
          .map(jobExperience => this.resolveJobExperience(candidateProfile, language, jobExperience));
        return forkJoin(jobExperiencesModels$);
      }),
      map(CandidateDetailModelFactory.sortLastJobFirst)
    );
  }

  private getCandidateProtectedData(candidateProfile: CandidateProfile): Observable<CandidateProtectedData> {
    const candidateProtectedData = this.authenticationService.getCurrentUser().pipe(
      filter((currentUser) => canViewCandidateProtectedData(candidateProfile, currentUser)),
      switchMap(() => this.candidateRepository.getCandidateProtectedData(candidateProfile.id)),
    );
    const canNotViewProtectedData = this.authenticationService.getCurrentUser().pipe(
      filter((currentUser) => !canViewCandidateProtectedData(candidateProfile, currentUser)),
      switchMap(() => of(null))
    );

    // inspired by https://blog.rangle.io/rxjs-where-is-the-if-else-operator/
    return merge(candidateProtectedData, canNotViewProtectedData);
  }

  private getContact(candidateProfile: CandidateProfile, jobCenter: JobCenter): Observable<Contact> {
    return this.authenticationService.getCurrentUser().pipe(
      map((currentUser) => candidateContact(candidateProfile, jobCenter, currentUser)),
    );
  }
}
