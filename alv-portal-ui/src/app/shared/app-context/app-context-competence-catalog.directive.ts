import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../core/abstract-subscriber';
import {
  AppContextService,
  isCompetenceCatalog,
  isEalv
} from '../../core/app-context/app-context.service';
import { hasAnyAuthorities, UserRole } from '../../core/auth/user.model';

@Directive({
  selector: '[alvAppContextCompetenceCatalog]'
})
export class AppContextCompetenceCatalogDirective extends AbstractSubscriber implements OnInit {

  private isShown = true;

  constructor(private appContextService: AppContextService,
              private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this.appContextService.getAppContext()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(appContext => {
        this.viewContainerRef.clear();
        if (isCompetenceCatalog(appContext) === this.isShown) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });
  }

  @Input()
  set alvAppContextCompetenceCatalog(value: boolean) {
    this.isShown = value === null ? true : value;
  }

}
