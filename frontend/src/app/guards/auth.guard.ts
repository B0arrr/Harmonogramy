import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AccountService } from '../services/account.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.accountService.userValue;
    if (user) {
      return true;
    }

    this.router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
