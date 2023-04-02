import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import createSpyObj = jasmine.createSpyObj;
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;

  const fakeHttpClient = createSpyObj('HttpClient', [
    'post',
    'get',
    'put',
    'delete'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: fakeHttpClient
        }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('activateUser', () => {
    it('should activate user', () => {
      fakeHttpClient.put.and.returnValue(of({}));
      service.activateUser(1);
      expect(fakeHttpClient.put).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should get user by id', () => {
      fakeHttpClient.get.and.returnValue(of({}));
      service.getUserById(1);
      expect(fakeHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should get all users', () => {
      fakeHttpClient.get.and.returnValue(of({}));
      service.getAllUsers();
      expect(fakeHttpClient.get).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user', () => {
      fakeHttpClient.put.and.returnValue(of({}));
      service.updateUser({}).subscribe((user) => {
        {
          expect(user).toEqual({});
        }
      });
      expect(fakeHttpClient.put).toHaveBeenCalled();
    });
  });
});
