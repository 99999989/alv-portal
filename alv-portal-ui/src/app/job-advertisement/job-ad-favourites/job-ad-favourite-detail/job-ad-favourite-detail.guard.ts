import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import {
  FavouriteItemLoadedAction,
  JobAdFavouritesState,
  JobAdvertisementDetailLoadedAction,
  JobAdvertisementDetailUnloadAction
} from '../state-management';
import { Store } from '@ngrx/store';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { JobAdvertisementRepository } from '../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { Injectable } from '@angular/core';
import { JobAdFavouritesRepository } from '../../../shared/backend-services/favourites/job-ad-favourites.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { isAuthenticatedUser } from '../../../core/auth/user.model';
import { JobAdFavouriteDetailComponent } from './job-ad-favourite-detail.component';

@Injectable()
export class JobAdFavouriteDetailGuard implements CanActivate, CanDeactivate<JobAdFavouriteDetailComponent> {

  constructor(private store: Store<JobAdFavouritesState>,
              private authenticationService: AuthenticationService,
              private jobAdFavouritesRepository: JobAdFavouritesRepository,
              private jobAdvertisementRepository: JobAdvertisementRepository) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params['id'];
    const jobAdvertisement$ = this.jobAdvertisementRepository.findById(id);
    const favouriteItem$ = this.authenticationService.getCurrentUser().pipe(
      take(1),
      switchMap(currentUser => {
        if (isAuthenticatedUser(currentUser)) {
          return this.jobAdFavouritesRepository.getFavourite(id, currentUser.id);
        } else {
          return of(undefined);
        }
      })
    );
    return forkJoin([jobAdvertisement$, favouriteItem$]).pipe(
      tap(results => {
        const jobAdvertisement = results[0];
        const favouriteItem = results[1];
        this.store.dispatch(new JobAdvertisementDetailLoadedAction({ jobAdvertisement: jobAdvertisement }));
        if (favouriteItem !== undefined) {
          this.store.dispatch(new FavouriteItemLoadedAction({ favouriteItem: favouriteItem }));
        }
      }),
      map(() => {
        return true;
      })
    );
  }

  canDeactivate(component: JobAdFavouriteDetailComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    this.store.dispatch(new JobAdvertisementDetailUnloadAction({}));
    return true;
  }

}

