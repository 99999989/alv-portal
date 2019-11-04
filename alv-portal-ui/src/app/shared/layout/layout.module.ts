import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { HeaderComponent } from './header/header.component';
import {
  NgbAlert,
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownModule,
  NgbDropdownToggle,
  NgbModalModule,
  NgbPopoverModule,
  NgbTooltip,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './notifications/notification/notification.component';
import { SharedAuthModule } from '../auth/shared-auth.module';
import { NotificationsComponent } from './notifications/notifications/notifications.component';
import { AlertComponent } from './notifications/alert/alert.component';
import { ModalComponent } from './modal/modal.component';
import { FormsModule } from '../forms/forms.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { LanguageSkillsComponent } from './language-skills/language-skills.component';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { LocalLoginComponent } from './local-login/local-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuEntryComponent } from './main-navigation/menu-entry/menu-entry.component';
import { InlineBadgesComponent } from './inline-badges/inline-badges.component';
import { CollapsePanelComponent } from './collapse-panel/collapse-panel.component';
import { PostAddressComponent } from './post-address/post-address.component';
import { ResultListItemComponent } from './result-list-item/result-list-item.component';
import { PipesModule } from '../pipes/pipes.module';
import { ThreeColumnLayoutComponent } from './column-layout/three-column-layout/three-column-layout.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ListItemContentComponent } from './list-item-content/list-item-content.component';
import { ContactModalComponent } from '../../candidate/candidate-search/candidate-detail/contact-modal/contact-modal.component';
import { CandidateContactRepository } from '../backend-services/candidate/candidate-contact-repository';
import { UserNameAndCompanyComponent } from './user-name-and-company/user-name-and-company.component';
import { TwoColumnLayoutComponent } from './column-layout/two-column-layout/two-column-layout.component';
import { GeoLocationSelectionComponent } from './geo-location-selection/geo-location-selection.component';
import { IconsModule } from '../icons/icons.module';
import { SystemNotificationComponent } from './system-notification/system-notification.component';
import { FooterComponent } from './footer/footer.component';
import { AccountabilitySwitcherComponent } from './accountability-switcher/accountability-switcher.component';
import { LinkPanelComponent } from './link-panel/link-panel.component';
import { AssistantLayoutComponent } from './column-layout/assistant-layout/assistant-layout.component';
import { EnvironmentRibbonComponent } from './environment-ribbon/environment-ribbon.component';
import { SearchProfileItemComponent } from './search-profile-item/search-profile-item.component';
import { SharedAppContextModule } from '../app-context/shared-app-context.module';
import { CollapseDirective } from './collapse-panel/collapse.directive';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    IconsModule,
    SharedAuthModule,
    SharedAppContextModule,
    FormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbPopoverModule,
    NgbCollapseModule,
    NgbModalModule,
    NgbAlertModule,
    NgbTooltipModule,
    PipesModule
  ],
  declarations: [
    UserMenuComponent,
    MainNavigationComponent,
    NavigationContainerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    NotificationsComponent,
    AlertComponent,
    ModalComponent,
    StepIndicatorComponent,
    LanguageSkillsComponent,
    ConfirmModalComponent,
    LocalLoginComponent,
    MenuEntryComponent,
    InlineBadgesComponent,
    CollapsePanelComponent,
    PostAddressComponent,
    ResultListItemComponent,
    ThreeColumnLayoutComponent,
    ScrollToTopComponent,
    ListItemContentComponent,
    ContactModalComponent,
    UserNameAndCompanyComponent,
    ContactModalComponent,
    TwoColumnLayoutComponent,
    GeoLocationSelectionComponent,
    SystemNotificationComponent,
    AccountabilitySwitcherComponent,
    LinkPanelComponent,
    AssistantLayoutComponent,
    EnvironmentRibbonComponent,
    SearchProfileItemComponent,
    CollapseDirective
  ],
  providers: [
    CandidateContactRepository
  ],
  entryComponents: [
    ConfirmModalComponent,
    LocalLoginComponent,
    ContactModalComponent

  ],
  exports: [
    AssistantLayoutComponent,
    NavigationContainerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    NotificationsComponent,
    AlertComponent,
    ModalComponent,
    NgbAlert,
    NgbTooltip,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbDropdownAnchor,
    NgbDropdownItem,
    LanguageSkillsComponent,
    ModalComponent,
    StepIndicatorComponent,
    ReactiveFormsModule,
    InlineBadgesComponent,
    CollapsePanelComponent,
    PostAddressComponent,
    ResultListItemComponent,
    ThreeColumnLayoutComponent,
    ScrollToTopComponent,
    ListItemContentComponent,
    TwoColumnLayoutComponent,
    GeoLocationSelectionComponent,
    SystemNotificationComponent,
    AccountabilitySwitcherComponent,
    LinkPanelComponent,
    EnvironmentRibbonComponent,
    SearchProfileItemComponent,
    CollapseDirective
  ]
})
export class LayoutModule {
}
