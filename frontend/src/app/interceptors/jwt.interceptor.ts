import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../models/token';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: Token | null = this.accountService.tokenValue;
    const user: User | null = this.accountService.userValue;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (token && user && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access_token}`
        }
      });
    }

    return next.handle(request);
  }
}
