import { TestBed } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AccountService } from '../services/account.service';
import createSpyObj = jasmine.createSpyObj;

describe('ErrorInterceptor', () => {
  let client: HttpClient;
  let httpMock: HttpTestingController;

  const fakeAccountService = createSpyObj('AccountService', [
    'tokenValue',
    'logout'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    });

    client = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('intercept', () => {
    it('should throw error and logout', () => {
      fakeAccountService.tokenValue = {
        access_token: 'test',
        token_type: 'bearer'
      };
      client.get('/test').subscribe(
        () => {},
        (res) => {
          expect(fakeAccountService.logout).toHaveBeenCalled();
          expect(res).toEqual('Bad Request');
        }
      );

      const testMock = httpMock.expectOne('/test');
      testMock.flush(
        { data: 'Invalid request' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should throw error', () => {
      fakeAccountService.tokenValue = null;
      client.get('/test').subscribe(
        () => {},
        (res) => {
          expect(res).toEqual('Bad Request');
        }
      );

      const testMock = httpMock.expectOne('/test');
      testMock.flush(
        { data: 'Invalid request' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });
});
