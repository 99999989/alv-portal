import { JobCenterRepository } from '../../../shared/backend-services/reference-service/job-center.repository';
import { cold, hot } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { I18nService } from '../../../core/i18n.service';
import { mockJobCenter } from '../../../shared/backend-services/reference-service/job-center.mock';
import { CandidateDetailModelFactory } from './candidate-detail-model-factory';
import { OccupationLabelRepository } from '../../../shared/backend-services/reference-service/occupation-label.repository';
import { CandidateRepository } from '../../../shared/backend-services/candidate/candidate.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { OccupationLabelData } from '../../../shared/backend-services/reference-service/occupation-label.types';
import { CandidateProtectedData } from '../../../shared/backend-services/candidate/candidate.types';
import { RegistrationStatus, User, UserRole } from '../../../core/auth/user.model';
import {
  mockCandidateProfile,
  mockJobExperience
} from '../../../shared/backend-services/candidate/candidate.mock';
import { CandidateDetailModel, JobExperienceModel } from './candidate-detail-model';
import { of } from 'rxjs';
import { FeatureName } from '../../../shared/backend-services/feature-code-list/feature-code-list.types';

describe('CandidateDetailModelFactory', () => {
  let candidateDetailModelFactory: CandidateDetailModelFactory;
  let i18nServiceMock;
  let occupationLabelRepositoryMock;
  let jobCenterRepositoryMock: JobCenterRepository;
  let candidateRepositoryMock;
  let authenticationServiceMock;

  const LANGUAGE_VALUES = {
    e: 'en',
    f: 'fr',
    d: 'de',
    i: 'i'
  };
  const occupationLabelDataMock: OccupationLabelData = {
    default: 'programmer/ka',
    m: 'programmer',
    f: 'programmerka'
  };

  const mockProtectedData: CandidateProtectedData = {
    id: '11',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: '+41211212',
    mobile: '+41211212',
    address: {
      street: 'street',
      zipCode: '2002',
      city: 'Bern'
    },
    nationalityCode: 'de',
    candidateProfile: null
  };

  const userMock: User = {
    id: '234',
    login: 'qwert',
    email: 'asdsf@gma.com',
    langKey: 'en',
    firstName: 'Name',
    lastName: 'lastname',
    displayName: 'Name lasname',
    authorities: [UserRole.ROLE_PAV],
    registrationStatus: RegistrationStatus.REGISTERED,
    legalTermsAccepted: true,
    activeFeatures: [],
    hasAnyAuthorities(authorities: Array<UserRole>): boolean {
      return true;
    },
    isRegistered(): boolean {
      return true;
    },
    isAdmin(): boolean {
      return false;
    },
    isCompetenceCatalogEditor(): boolean {
      return false;
    },
    isLegalTermAcceptanceRequired(): boolean {
      return false;
    },
    hasFeature(featureName: FeatureName): boolean {
      return false;
    },
    isSysadmin(): boolean {
      return false;
    }
  };

  const mockJobExperienceModel: JobExperienceModel = {
    jobExperience: mockJobExperience,
    occupationLabel: occupationLabelDataMock.f,
    displayGraduation: true,
    displayDegree: false,
  };

  beforeEach(() => {
    i18nServiceMock = {
      get currentLanguage$() {
        return hot('-e-------', LANGUAGE_VALUES);
      }
    };

    jobCenterRepositoryMock = jasmine.createSpyObj('JobCenterRepository', {
      'resolveJobCenter': of(mockJobCenter)
    });

    occupationLabelRepositoryMock = jasmine.createSpyObj('OccupationLabelRepository', ['getOccupationLabelsByKey']);
    occupationLabelRepositoryMock.getOccupationLabelsByKey.and.returnValue(of(occupationLabelDataMock));

    candidateRepositoryMock = jasmine.createSpyObj('CandidateRepository', {
      'getCandidateProtectedData': of(mockProtectedData)
    });
    authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', {
      'getCurrentUser': of(userMock)
    });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CandidateDetailModelFactory,
        { provide: I18nService, useValue: i18nServiceMock },
        { provide: JobCenterRepository, useValue: jobCenterRepositoryMock },
        { provide: OccupationLabelRepository, useValue: occupationLabelRepositoryMock },
        { provide: CandidateRepository, useValue: candidateRepositoryMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock }
      ]
    });
    candidateDetailModelFactory = TestBed.get(CandidateDetailModelFactory);
  });

  it('should be created', () => {
    expect(candidateDetailModelFactory).toBeTruthy();
  });

  it('should create a CandidateDetail model object', () => {
    const candidateDetailModel$ = candidateDetailModelFactory.create(mockCandidateProfile);
    const expectedCandidateDetailModel = new CandidateDetailModel(
      mockCandidateProfile,
      mockJobCenter,
      [mockJobExperienceModel],
      mockProtectedData,
      null
    );
    const expected = cold('-r', { r: expectedCandidateDetailModel });

    expect(candidateDetailModel$).toBeObservable(expected);
  });
});
