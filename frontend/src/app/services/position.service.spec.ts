import { TestBed } from '@angular/core/testing';

import { PositionService } from './position.service';
import { HttpClient } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('PositionService', () => {
  let service: PositionService;

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
    service = TestBed.inject(PositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addPosition', () => {
    it('should add position', () => {
      fakeHttpClient.post.and.returnValue(of({}));
      service.addPosition({}).subscribe((x) => {
        expect(x).toEqual({});
      });
    });
  });

  describe('getAllPositions', () => {
    it('should get all positions', () => {
      fakeHttpClient.get.and.returnValue(of([]));
      service.getAllPositions().subscribe((x) => {
        expect(x).toEqual([]);
      });
    });
  });

  describe('updatePosition', () => {
    it('should update position', () => {
      fakeHttpClient.put.and.returnValue(of({ position: 'test' }));
      service.updatePosition(1, 'test').subscribe((x) => {
        expect(x).toEqual({ position: 'test' });
      });
    });
  });
});
