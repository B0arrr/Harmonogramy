import { TestBed } from '@angular/core/testing';

import { JwtInterceptor } from './jwt.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import createSpyObj = jasmine.createSpyObj;
import { AccountService } from '../services/account.service';
import { environment } from '../../environments/environment';

describe('JwtInterceptor', () => {
  let client: HttpClient;
  let httpMock: HttpTestingController;

  const fakeAccountService = createSpyObj('AccountService', [
    'tokenValue',
    'userValue'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
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
    it('should add headers to request', () => {
      fakeAccountService.tokenValue = {
        access_token: 'test',
        token_type: 'bearer'
      };
      fakeAccountService.userValue = {
        first_name: 'test'
      };

      client.get(`${environment.apiUrl}/test`).subscribe();

      const testMock = httpMock.match(`${environment.apiUrl}/test`);
      const authorization = testMock[0].request.headers.get('Authorization');
      expect(authorization).toEqual(
        `Bearer ${fakeAccountService.tokenValue.access_token}`
      );
    });
  });
});
