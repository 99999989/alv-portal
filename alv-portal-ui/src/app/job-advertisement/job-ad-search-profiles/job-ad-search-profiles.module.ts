import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { JobAdSearchProfilesRoutingModule } from './job-ad-search-profiles-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedJobAdvertisementModule } from '../shared/shared-job-advertisement.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { JobAdSearchProfilesComponent } from './job-ad-search-profiles/job-ad-search-profiles.component';
import { JobAdSearchProfilesGuard } from './job-ad-search-profiles-guard';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    JobAdSearchProfilesRoutingModule,
    InfiniteScrollModule,
    SharedJobAdvertisementModule
  ],
  declarations: [
    JobAdSearchProfilesComponent
  ],
  entryComponents: [],
  providers: [
    ModalService,
    JobAdSearchProfilesGuard
  ]
})
export class JobAdSearchProfilesModule {
}
