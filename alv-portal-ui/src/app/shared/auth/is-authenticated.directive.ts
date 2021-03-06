import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../core/abstract-subscriber';
import { isAuthenticatedUser } from '../../core/auth/user.model';

@Directive({
  selector: '[alvIsAuthenticated]'
})
export class IsAuthenticatedDirective extends AbstractSubscriber implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this.authenticationService.getCurrentUser()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        this.viewContainerRef.clear();
        if (isAuthenticatedUser(user)) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });
  }

}
