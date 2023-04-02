import { TestBed } from '@angular/core/testing';

import { EmploymentService } from './employment.service';
import { HttpClient } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('EmploymentService', () => {
  let service: EmploymentService;

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
    service = TestBed.inject(EmploymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addEmployment', () => {
    it('should add employment', () => {
      fakeHttpClient.post.and.returnValue(of({}));
      service.addEmployment({}).subscribe((x) => {
        expect(x).toEqual({});
      });
    });
  });

  describe('getAllEmployments', () => {
    it('should get all employments', () => {
      fakeHttpClient.get.and.returnValue(of([]));
      service.getAllEmployments().subscribe((x) => {
        expect(x).toEqual([]);
      });
    });
  });

  describe('updateEmployment', () => {
    it('should update employment', () => {
      fakeHttpClient.put.and.returnValue(of({ employment: 'test' }));
      service.updateEmployment(1, 'test').subscribe((x) => {
        expect(x).toEqual({ employment: 'test' });
      });
    });
  });
});
