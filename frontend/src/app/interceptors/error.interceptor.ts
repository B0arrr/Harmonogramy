// tslint:disable:no-console
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          [400, 401, 403].includes(err.status) &&
          this.accountService.tokenValue
        ) {
          this.accountService.logout();
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}
