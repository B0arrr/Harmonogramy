import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

describe('AccountService', () => {
  let service: AccountService;

  const fakeHttpClient = createSpyObj('HttpClient', [
    'post',
    'get',
    'put',
    'delete'
  ]);
  const fakeRouter = createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    localStorage.setItem(
      'token',
      JSON.stringify({
        access_token: 'test',
        token_type: 'bearer'
      })
    );
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        email: 'test@test.pl',
        password: 'test'
      })
    );
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: fakeHttpClient
        },
        HttpHandler,
        {
          provide: Router,
          useValue: fakeRouter
        }
      ]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tokenValue', () => {
    it('should return tokenSubject value', () => {
      const result = service.tokenValue;
      expect(result).toEqual(
        JSON.parse(localStorage.getItem('token') as string)
      );
    });
  });

  describe('userValue', () => {
    it('should return tokenSubject value', () => {
      const result = service.userValue;
      expect(result).toEqual(
        JSON.parse(localStorage.getItem('user') as string)
      );
    });
  });

  describe('login', () => {
    it('should get user and token from api', function () {
      const token = {
        access_token: 'test',
        token_type: 'bearer'
      };
      const user = {
        email: 'test@test.pl',
        password: 'test'
      };
      fakeHttpClient.post.and.returnValues(of(token), of(user));
      service.login('test', 'test').subscribe();
      expect(service.tokenValue).toEqual(token);
      expect(JSON.parse(localStorage.getItem('token') as string)).toEqual(
        token
      );
      expect(service.userValue).toEqual(user as User);
      expect(JSON.parse(localStorage.getItem('user') as string)).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should clear token and user', () => {
      service.logout();
      expect(service.tokenValue).toEqual(null);
      expect(JSON.parse(localStorage.getItem('token') as string)).toEqual(null);
      expect(service.userValue).toEqual(null);
      expect(JSON.parse(localStorage.getItem('user') as string)).toEqual(null);
      expect(fakeRouter.navigate).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should add user', () => {
      const user = {
        email: 'test@test.pl',
        password: 'test'
      };
      fakeHttpClient.post.and.returnValue(of(user));
      service.register(user).subscribe((x) => {
        expect(x).toEqual(user);
      });
    });
  });

  describe('getAll', () => {
    it('should get all users', () => {
      const users = [
        {
          email: 'test@test.pl',
          password: 'test'
        },
        {
          email: 'test2@test.pl',
          password: 'test2'
        },
        {
          email: 'test3@test.pl',
          password: 'test3'
        }
      ];
      fakeHttpClient.get.and.returnValue(of(users));
      service.getAll().subscribe((x) => {
        expect(x).toEqual(users);
      });
    });
  });

  describe('getById', () => {
    it('should get user by id', () => {
      const user = {
        id: 1,
        email: 'test@test.pl',
        password: 'test'
      };
      fakeHttpClient.get.and.returnValue(of(user));
      service.getById(user.id).subscribe((x) => {
        expect(x).toEqual(user as User);
      });
    });
  });

  describe('update', () => {
    it('should update user', () => {
      const user = JSON.parse(localStorage.getItem('user') as string);
      const params = {
        email: 'test2@test.pl',
        password: 'test2'
      };
      fakeHttpClient.put.and.returnValue(of(user));
      service.update(user.id, params).subscribe((x) => {
        const updatedUser = { ...user, ...params };
        expect(x).toEqual(updatedUser);
        expect(service.userValue).toEqual(updatedUser);
        expect(JSON.parse(localStorage.getItem('user') as string)).toEqual(
          updatedUser
        );
      });
    });
  });

  describe('delete', () => {
    it('should delete user', () => {
      const user = JSON.parse(localStorage.getItem('user') as string);
      fakeHttpClient.delete.and.returnValue(of(user));
      service.delete(user.id).subscribe((x) => {
        expect(x).toEqual(user);
      });
    });
  });
});
