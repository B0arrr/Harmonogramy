import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';
import createSpyObj = jasmine.createSpyObj;
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CompanyService', () => {
  let service: CompanyService;

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
    service = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addCompany', () => {
    it('should add company', () => {
      fakeHttpClient.post.and.returnValue(of({}));
      service.addCompany({}).subscribe((x) => {
        expect(x).toEqual({});
      });
    });
  });

  describe('getCompanyById', () => {
    it('should get company by id', () => {
      fakeHttpClient.get.and.returnValue(of({}));
      service.getCompanyById(1).subscribe((x) => {
        expect(x).toEqual({});
      });
    });
  });

  describe('getAllCompanies', () => {
    it('should get all companies', () => {
      fakeHttpClient.get.and.returnValue(of([]));
      service.getAllCompanies().subscribe((x) => {
        expect(x).toEqual([]);
      });
    });
  });

  describe('updateCompany', () => {
    it('should update company', () => {
      fakeHttpClient.put.and.returnValue(of({ company: 'test' }));
      service.updateCompany(1, 'test').subscribe((x) => {
        expect(x).toEqual({ company: 'test' });
      });
    });
  });
});
