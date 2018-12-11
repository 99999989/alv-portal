import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { NavigationContainerComponent } from './navigation-container/navigation-container.component';
import { VersionComponent } from './version/version.component';
import { HeaderComponent } from './header/header.component';
import {
  NgbAccordion,
  NgbAccordionModule,
  NgbAlert,
  NgbAlertModule,
  NgbDropdown,
  NgbDropdownModule,
  NgbModalModule,
  NgbPanel,
  NgbPanelContent,
  NgbPanelTitle,
  NgbPopoverModule,
  NgbTooltip,
  NgbTooltipModule,
  ɵp,
  ɵq,
  ɵr
} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { PanelGroupComponent } from './panel-group/panel-group.component';
import { NotificationComponent } from './notifications/notification/notification.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { SharedAuthModule } from '../auth/shared-auth.module';
import { NotificationsComponent } from './notifications/notifications/notifications.component';
import { AlertComponent } from './notifications/alert/alert.component';
import { ModalComponent } from './modal/modal.component';
import { FormsModule } from '../forms/forms.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { LanguageComponent } from './language.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { MarkdownEscapePipe } from './pipes/markdown-escape.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { KeysPipe } from './pipes/enum-keys.pipe';
import { LocaleAwareDatePipe } from './pipes/locale-aware-date.pipe';
import { LocaleAwareDecimalPipe } from './pipes/locale-aware-number.pipe';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { ShortenPipe } from './pipes/shorten.pipe';
import { WorkingTimeRangePipe } from './pipes/working-time-range.pipe';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { LocalLoginComponent } from './local-login/local-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuEntryComponent } from './main-navigation/menu-entry/menu-entry.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    SharedAuthModule,
    FormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbPopoverModule,
    NgbModalModule,
    NgbAlertModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbDropdownModule,
  ],
  declarations: [
    UserMenuComponent,
    MainNavigationComponent,
    NavigationContainerComponent,
    VersionComponent,
    HeaderComponent,
    PanelComponent,
    PanelGroupComponent,
    NotificationComponent,
    HelpButtonComponent,
    NotificationsComponent,
    AlertComponent,
    ModalComponent,
    ConfirmModalComponent,
    StepIndicatorComponent,
    ConfirmModalComponent,
    LanguageComponent,
    ConfirmModalComponent,
    SafeHtmlPipe,
    MarkdownEscapePipe,
    CapitalizePipe,
    KeysPipe,
    LocaleAwareDatePipe,
    LocaleAwareDecimalPipe,
    PhoneNumberPipe,
    ShortenPipe,
    WorkingTimeRangePipe,
    LocalLoginComponent,
    MenuEntryComponent
  ],
  entryComponents: [
    ConfirmModalComponent,
    LocalLoginComponent
  ],
  exports: [
    NavigationContainerComponent,
    HeaderComponent,
    VersionComponent,
    PanelComponent,
    PanelGroupComponent,
    NotificationComponent,
    HelpButtonComponent,
    NotificationsComponent,
    AlertComponent,
    ModalComponent,
    NgbAlert,
    NgbTooltip,
    NgbAccordion,
    NgbPanel,
    NgbPanelContent,
    NgbPanelTitle,
    NgbDropdown,
    ɵq,
    ɵp,
    ɵr,
    LanguageComponent,
    ModalComponent,
    SafeHtmlPipe,
    MarkdownEscapePipe,
    CapitalizePipe,
    KeysPipe,
    LocaleAwareDatePipe,
    LocaleAwareDecimalPipe,
    PhoneNumberPipe,
    ShortenPipe,
    WorkingTimeRangePipe,
    StepIndicatorComponent,
    ReactiveFormsModule
  ]
})
export class LayoutModule {
}
