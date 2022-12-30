import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let routeMock: any = { snapshot: {} };
  let routeStateMock: any = { snapshot: {}, url: '/cookies' };

  const fakeRouter = createSpyObj('Router', ['navigate']);
  const fakeAccountService = createSpyObj('AccountService', ['userValue']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: Router,
          useValue: fakeRouter
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should pass user if authenticated', () => {
      fakeAccountService.userValue = {} as User;
      const result = guard.canActivate(routeMock, routeStateMock);
      expect(result).toBeTrue();
    });

    it('should not pass user if not authenticated', () => {
      fakeAccountService.userValue = null;
      const result = guard.canActivate(routeMock, routeStateMock);
      expect(fakeRouter.navigate).toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });
});
